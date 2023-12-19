using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class ExamService
{
    private readonly ApplicationDbContext _db;
    private List<string> excludedSkills = new();

    public ExamService(
    ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResponse<List<QuestionsViewDto>>> GetQuestionsAsync(ExamDto dto)
    {
        var response = new ServiceResponse<List<QuestionsViewDto>>();
        var user = _db.ApplicationUser.FirstOrDefault(m => m.Id == dto.UserId);
        var exam = _db.Results.FirstOrDefault(m => m.JobId == dto.JobId && m.ApplicationUserId == dto.UserId);
        var extractedSkills = new List<string>();

        if (exam != null)
        {
            response.AddError("exam already written", "You have already attendend this exam.");
            return response;
        }

        if (user.Resume == null || user.Resume == "")
        {
            response.AddError("no resume", "Please upload a resume first");
            return response;
        }

        var resume = await ConvertPdfToIFormFileAsync(user.Resume);

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
            var extractedSkillsResponse = await ExtractSkillsFromPDFAsync(resumeBytes, dto.JobId);

            // Check if skills were extracted successfully
            if (extractedSkillsResponse.IsValid)
            {
                // Use the extracted skills or perform further processing
                extractedSkills = extractedSkillsResponse.Result;
            }
            else
            {
                response.AddError("failed", "Failed to process the uploaded file");
            }
        }
        catch (Exception ex)
        {
            response.AddError("Failed to process the uploaded file: ", ex.Message);
        }

        var questionCount = _db.Questions.Where(c => extractedSkills.Contains(c.Skill.ToLower())).Count();

        var questions = await _db.Questions
            .Where(
            c => questionCount < 15
                ? extractedSkills.Contains(c.Skill.ToLower()) && excludedSkills.Contains(c.Skill.ToLower())
                : extractedSkills.Contains(c.Skill.ToLower()))
            .Select(c => new QuestionsViewDto
            {
                Id = c.Id,
                Question = c.Question,
                IsCodeProvided = c.IsCodeProvided,
                Code = c.Code,
                OptionOne = c.OptionOne,
                OptionTwo = c.OptionTwo,
                OptionThree = c.OptionThree,
                OptionFour = c.OptionFour,
                Answer = c.Answer
            }).ToListAsync();

        response.Result = questions;

        return response;
    }

    public async Task<ServiceResponse<List<QuestionsViewDto>>> GetAllQuestionsAsync()
    {
        var response = new ServiceResponse<List<QuestionsViewDto>>();

        var questions = await _db.Questions
            .Select(c => new QuestionsViewDto
            {
                Id = c.Id,
                Question = c.Question,
                IsCodeProvided = c.IsCodeProvided,
                Code = c.Code,
                OptionOne = c.OptionOne,
                OptionTwo = c.OptionTwo,
                OptionThree = c.OptionThree,
                OptionFour = c.OptionFour,
                Answer = c.Answer
            }).ToListAsync();

        response.Result = questions;

        return response;
    }

    public async Task<ServiceResponse<QuestionsViewDto>> QuestionsAddAsync(QuestionsAddDto dto)
    {
        var response = new ServiceResponse<QuestionsViewDto>();

        var questions = new ExamQuestion
        {
            Question = dto.Question,
            IsCodeProvided = dto.IsCodeProvided,
            Code = dto.Code,
            OptionOne = dto.OptionOne,
            OptionTwo = dto.OptionTwo,
            OptionThree = dto.OptionThree,
            OptionFour = dto.OptionFour,
            Answer = dto.Answer,
            Skill = dto.Skill
        };

        _db.Questions.Add(questions);

        await _db.SaveChangesAsync();

        response.Result = new QuestionsViewDto
        {
            Question = questions.Question,
            IsCodeProvided = questions.IsCodeProvided,
            Code = questions.Code,
            OptionOne = questions.OptionOne,
            OptionTwo = questions.OptionTwo,
            OptionThree = questions.OptionThree,
            OptionFour = questions.OptionFour,
            Answer = questions.Answer
        };

        return response;
    }

    public async Task<ServiceResponse<List<string>>> ExtractSkillsFromPDFAsync(byte[] pdfBytes, int jobId)
    {
        var response = new ServiceResponse<List<string>>();
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

            // Extract skills using your preferred logic (regex, keyword matching, etc.)
            List<string> extractedSkills = ExtractSkillsFromText(text.ToString(), jobId);

            response.Result = extractedSkills;
        }
        catch (Exception ex)
        {
            response.AddError("Failed to extract skills from PDF: ", ex.Message);
        }

        return response;
    }

    private List<string> ExtractSkillsFromText(string text, int jobId)
    {
        var jobSkills = new List<string>();
        List<string> result = new List<string>();
        HashSet<string> uniqueSkills = new HashSet<string>();

        // Implement your logic to extract skills from the job description.
        var job = _db.Jobs.FirstOrDefault(c => c.Id == jobId);

        if (job != null && job.Skills.ToList().Count != 0)
        {
            jobSkills = job.Skills.ToList();
        }
        else
        {
            // Load default skills
            jobSkills = LoadSkillsFromJSONFile("Skills/skills.json");
        }

        // Implement your logic to extract skills from the text.
        List<string> resumeSkills = text.Split(new char[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries).ToList();

        foreach (var resumeSkill in resumeSkills)
        {
            string lowercaseWord = resumeSkill.ToLower();

            foreach (var jobSkill in jobSkills)
            {
                string lowercaseSkill = jobSkill.ToLower();

                if (lowercaseSkill == lowercaseWord && !uniqueSkills.Contains(jobSkill)) // Check if skill hasn't been added before
                {
                    result.Add(jobSkill);
                    uniqueSkills.Add(jobSkill); // Add the skill to the HashSet
                    break;
                }
                else if (!uniqueSkills.Contains(jobSkill))
                {
                    excludedSkills.Add(jobSkill);
                    break;
                }
            }
        }
        return result;
    }

    private List<string> LoadSkillsFromJSONFile(string filePath)
    {

        // Read the JSON file content
        string jsonContent = File.ReadAllText(filePath);

        // Deserialize JSON to obtain skills
        var skillsObject = JsonConvert.DeserializeObject<JObject>(jsonContent);

        // Extract skills array from the JSON object
        List<string> skills = skillsObject["skills"].ToObject<List<string>>();

        return skills;
    }

    public async Task<IFormFile> ConvertPdfToIFormFileAsync(string filePath)
    {
        try
        {
            // Read the PDF file as a byte array
            byte[] fileBytes = await File.ReadAllBytesAsync(filePath);

            // Create an in-memory stream from the byte array
            MemoryStream ms = new MemoryStream(fileBytes);

            // Create an IFormFile from the in-memory stream
            IFormFile formFile = new FormFile(ms, 0, fileBytes.Length, "pdfFile", System.IO.Path.GetFileName(filePath));

            return formFile;
        }
        catch (Exception ex)
        {
            // Handle exceptions accordingly
            Console.WriteLine($"An error occurred: {ex.Message}");
            return null;
        }
    }
}
