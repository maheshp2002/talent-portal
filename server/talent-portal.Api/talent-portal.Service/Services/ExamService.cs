using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;
using System.Diagnostics;
using System.Text.Json;

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

    public async Task<ServiceResponse<List<QuestionsViewDto>>> GetMcqQuestionsAsync(ExamDto dto)
    {
        var response = new ServiceResponse<List<QuestionsViewDto>>();
        var user = _db.ApplicationUser.FirstOrDefault(m => m.Id == dto.UserId);
        var exam = _db.Results.FirstOrDefault(m => m.JobId == dto.JobId && m.ApplicationUserId == dto.UserId);
        var extractedSkills = new List<string>();
        var jobQuery = _db.Jobs.FirstOrDefault(job => job.Id == dto.JobId);

        if (jobQuery != null)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Deserialize the JSON array into a List<string>
            extractedSkills = System.Text.Json.JsonSerializer.Deserialize<List<string>>(jobQuery.SerializedSkills, options);
        }

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

        var questionCount = _db.Questions.Where(c => extractedSkills.Contains(c.Skill.ToLower())).Count();

        var questions = await _db.Questions
            .Where(
            c => extractedSkills.Contains(c.Skill.ToLower()) && !c.IsDescriptiveQuestion)
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
                Answer = c.Answer,
                IsDescriptiveQuestion = c.IsDescriptiveQuestion,
                Skill = c.Skill,
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
                Answer = c.Answer,
                IsDescriptiveQuestion = c.IsDescriptiveQuestion
            }).ToListAsync();

        response.Result = questions;

        return response;
    }

    public async Task<ServiceResponse<QuestionsViewDto>> QuestionsAddAsync(QuestionsAddDto dto)
    {
        var response = new ServiceResponse<QuestionsViewDto>();
        var isDuplicateQuestion = _db.Questions.FirstOrDefault(q => q.Question == dto.Question);

        if (isDuplicateQuestion != null)
        {
            response.AddError("DuplicateQuestion", "Same question already exists!");
            return response;
        }

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
            Skill = dto.Skill,
            IsDescriptiveQuestion = dto.IsDescriptiveQuestion
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
            Answer = questions.Answer,
            IsDescriptiveQuestion = questions.IsDescriptiveQuestion
        };

        return response;
    }

    public async Task<ServiceResponse<string>> QuestionsDeleteAsync(int id)
    {
        var response = new ServiceResponse<string>();

        var question = _db.Questions.FirstOrDefault(x => x.Id == id);

        if (question == null)
        {
            response.AddError("Not found", "Question not found");
            return response;
        }

        _db.Questions.Remove(question);
        await _db.SaveChangesAsync();

        response.Result = "Question deleted successfully";

        return response;
    }

    public async Task<ServiceResponse<List<QuestionsViewDto>>> GetDescriptiveQuestionsAsync(ExamDto dto)
    {
        var response = new ServiceResponse<List<QuestionsViewDto>>();
        var extractedSkills = new List<string>();
        var jobQuery = _db.Jobs.FirstOrDefault(job => job.Id == dto.JobId);

        if (jobQuery != null)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Deserialize the JSON array into a List<string>
            extractedSkills = System.Text.Json.JsonSerializer.Deserialize<List<string>>(jobQuery.SerializedSkills, options);
        }

        var questionCount = _db.Questions.Where(c => extractedSkills.Contains(c.Skill.ToLower())).Count();

        var questions = await _db.Questions
            .Where(
            c => extractedSkills.Contains(c.Skill.ToLower()) && c.IsDescriptiveQuestion)
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
                Answer = c.Answer,
                IsDescriptiveQuestion = c.IsDescriptiveQuestion,
                Skill = c.Skill,
            }).ToListAsync();

        response.Result = questions;

        return response;
    }
    public List<string> ExtractSkillsFromText(string text, int jobId)
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

    public List<string> LoadSkillsFromJSONFile(string filePath)
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

    public async Task<ServiceResponse<string>> CalculateSimilarityScore(List<DescriptiveDto> dtos)
    {
        var response = new ServiceResponse<string>();
        double totalSimilarityScore = 0.0;

        // Get all the unique question IDs from the list of DTOs
        var questionIds = dtos.Select(dto => dto.QuestionId).Distinct().ToList();

        // Query the database for all relevant answers at once
        var questionAnswers = _db.Questions
            .Where(q => questionIds.Contains(q.Id) && q.IsDescriptiveQuestion)
            .ToDictionary(q => q.Id, q => q.Answer);

        foreach (var dto in dtos)
        {
            // Get the database answer for the current DTO's question ID
            if (questionAnswers.TryGetValue(dto.QuestionId, out var dbAnswer))
            {
                try
                {
                    // Path to your Python script
                    string scriptPath = System.IO.Path.Combine("Python", "bert_similarity.py");

                    // Start a new process to run the Python script
                    ProcessStartInfo start = new ProcessStartInfo();
                    start.FileName = "python"; // Assumes python is in the PATH environment variable
                    start.Arguments = $"{scriptPath} \"{dto.UserAnswer}\" \"{dbAnswer}\"";
                    start.UseShellExecute = false;
                    start.RedirectStandardOutput = true;

                    // Capture the output of the Python script
                    using (Process process = Process.Start(start))
                    {
                        using (StreamReader reader = process.StandardOutput)
                        {
                            string result = await reader.ReadToEndAsync();
                            double similarityScore;
                            if (double.TryParse(result, out similarityScore))
                            {
                                totalSimilarityScore += similarityScore;
                            }
                            else
                            {
                                response.AddError("Bert Error", "Invalid similarity score received from Python script");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    response.AddError("Python Error", "Failed to calculate similarity score");
                }
            }
            else
            {
                response.AddError("Database Error", $"No answer found for question ID: {dto.QuestionId}");
            }
        }

        response.Result = totalSimilarityScore.ToString();
        return response;
    }

}
