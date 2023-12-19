using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class JobsService
{
    private readonly ApplicationDbContext _db;

    public JobsService(
    ApplicationDbContext db)
    {
        _db = db;
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

    public async Task<ServiceResponse<List<JobsViewDto>>> GetAllJobsAsync()
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
            }).ToListAsync();

        response.Result = jobs;

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
}
