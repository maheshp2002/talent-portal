using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;
using iTextSharp.text.pdf.parser;
using iTextSharp.text.pdf;
using System.Text;

namespace talent_portal.Service.Services;

public class JobsService
{
    private readonly ApplicationDbContext _db;
    private ExamService _examService;

    public JobsService(
    ApplicationDbContext db, ExamService examService)
    {
        _db = db;
        _examService = examService;
    }

    public async Task<ServiceResponse<JobsViewDto>> GetJobAsync(int id)
    {
        var response = new ServiceResponse<JobsViewDto>();

        var jobs = _db.Jobs.FirstOrDefault(c => c.Id == id);
        response.Result = new JobsViewDto
        {
            Id = jobs.Id,
            Title = jobs.Title,
            Description = jobs.Description,
            IsOpen = jobs.IsOpen,
            Skills = jobs.Skills.ToList(),
            StartedDate = jobs.StartedDate,
            Position = jobs.Position
        };

        return response;
    }

    public async Task<ServiceResponse<List<JobsViewDto>>> GetAllJobsAsync(string userId)
    {
        var response = new ServiceResponse<List<JobsViewDto>>();

        var user = _db.ApplicationUser.FirstOrDefault(m => m.Id == userId);
        var extractedSkills = "";

        if (user.Resume == null || user.Resume == "")
        {
            response.AddError("no resume", "Please upload a resume from user profile");
            return response;
        }

        if (user.ProfileImage == null || user.Resume == "")
        {
            response.AddError("no photo", "Please upload a profile photo from user profile");
            return response;
        }

        var resume = await _examService.ConvertPdfToIFormFileAsync(user.Resume);

        try
        {
            // Read the content of the IFormFile into a byte array
            byte[] resumeBytes;
            using (MemoryStream memoryStream = new MemoryStream())
            {
                await resume.CopyToAsync(memoryStream);
                resumeBytes = memoryStream.ToArray();
            }

            // Extract skills from the uploaded PDF
            var extractedSkillsResponse = await ExtractSkillsFromPDFAsync(resumeBytes);

            // Check if skills were extracted successfully
            if (extractedSkillsResponse.IsValid)
            {
                // Use the extracted skills or perform further processing
                extractedSkills = extractedSkillsResponse.Result;
            }
            else
            {
                response.AddError("failed", "Failed to process the uploaded resume");
            }
        }
        catch (Exception ex)
        {
            response.AddError("Failed to process the uploaded file: ", "Failed to process the uploaded resume");
        }

        // Fetch all jobs from the database
        var allJobs = await _db.Jobs.ToListAsync();

        // Filter the jobs in memory using LINQ to Objects
        var jobsWithSkills = allJobs
            .Where(job => _examService.ExtractSkillsFromText(extractedSkills, job.Id).Count > 0 && job.IsOpen)
            .Select(c => new JobsViewDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                IsOpen = c.IsOpen,
                Skills = c.Skills.ToList(),
                StartedDate = c.StartedDate,
                Position = c.Position
            })
            .OrderByDescending(c => c.StartedDate)
            .ToList();

        // Assign the filtered jobs to the response
        response.Result = jobsWithSkills;

        return response;
    }

    public async Task<ServiceResponse<List<JobsViewDto>>> GetAllJobsAdminAsync()
    {
        var response = new ServiceResponse<List<JobsViewDto>>();

        var jobs = await _db.Jobs
            .Select(c => new JobsViewDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                IsOpen = c.IsOpen,
                Skills = c.Skills.ToList(),
                StartedDate = c.StartedDate,
                Position = c.Position
            }).OrderByDescending(c => c.StartedDate).ToListAsync();

        response.Result = jobs;

        return response;
    }

    public async Task<ServiceResponse<string>> UpdateJobStatusAsync(JobUpdateDto dto)
    {
        var response = new ServiceResponse<string>();

        var jobs = _db.Jobs.FirstOrDefault(c => c.Id == dto.Id);

        if (jobs == null)
        {
            response.AddError("Not Found", $"No Job Found with the id: {dto.Id}");
            return response;
        }

        jobs.IsOpen = dto.IsOpen;

        await _db.SaveChangesAsync();

        response.Result = "Job Updated Successfully";

        return response;
    }

    public async Task<ServiceResponse<JobsViewDto>> JobsAddAsync(JobsAddDto dto)
    {
        var jobSkills = new List<string>();
        var response = new ServiceResponse<JobsViewDto>();
        HashSet<string> uniqueSkills = new HashSet<string>();
        var jsonSkills = LoadSkillsFromJSONFile("Skills/skills.json");


        // Split the description into skillsFromJob
        string[] descriptionSkill = dto.Description.ToLower().Split(new char[] { ' ', '\n', '\r', '\t', ',' }, StringSplitOptions.RemoveEmptyEntries);

        foreach (var skill in descriptionSkill)
        {
            string lowercaseWord = skill.ToLower();

            if (jsonSkills.Contains(lowercaseWord) && !uniqueSkills.Contains(lowercaseWord))
            {
                jobSkills.Add(lowercaseWord);
                uniqueSkills.Add(lowercaseWord);
            }
        }


        var jobs = new Job
        {
            Title = dto.Title,
            Description = dto.Description,
            IsOpen = dto.IsOpen,
            Skills = jobSkills,
            StartedDate = DateTime.Now.ToString("MM/dd/yyyy"),
            Position = dto.Position
        };

        _db.Jobs.Add(jobs);

        await _db.SaveChangesAsync();

        response.Result = new JobsViewDto
        {
            Title = jobs.Title,
            Description = jobs.Description,
            IsOpen = jobs.IsOpen,
            Skills = jobs.Skills.ToList(),
            StartedDate = jobs.StartedDate,
            Position = jobs.Position
        };

        return response;
    }

    private List<string> LoadSkillsFromJSONFile(string filePath)
    {
        try
        {
            // Read the JSON file content
            string jsonContent = File.ReadAllText(filePath);

            // Deserialize JSON to obtain skills
            var skillsObject = JsonConvert.DeserializeObject<JObject>(jsonContent);

            // Extract skills array from the JSON object
            List<string> skills = skillsObject["skills"].ToObject<List<string>>();

            return skills;
        }
        catch (Exception ex)
        {
            // Handle exception when reading or parsing JSON file
            // Log or handle the exception appropriately
            return new List<string>();
        }
    }

    public async Task<ServiceResponse<string>> JobCloseAsync(int Id)
    {
        var response = new ServiceResponse<string>();

        var job = _db.Jobs.FirstOrDefault(c => c.Id == Id);

        if (job == null)
        {
            response.AddError("Job not foud", "Job not found");
            return response;
        }

        job.IsOpen = false;

        _db.SaveChanges();

        response.Result = "Job closed sucessfully";
        
        return response;
    }

    public async Task<ServiceResponse<string>> ExtractSkillsFromPDFAsync(byte[] pdfBytes)
    {
        var response = new ServiceResponse<string>();
        try
        {
            // Load PDF document
            var pdfReader = new PdfReader(pdfBytes);
            var text = new StringBuilder();

            // Extract text from each page
            for (int page = 1; page <= pdfReader.NumberOfPages; page++)
            {
                text.Append(PdfTextExtractor.GetTextFromPage(pdfReader, page));
            }

            pdfReader.Close();

            response.Result = text.ToString();
        }
        catch (Exception ex)
        {
            response.AddError("Failed to extract skills from PDF: ", ex.Message);
        }

        return response;
    }
}
