using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class ExamService
{
    private readonly ApplicationDbContext _db;

    public ExamService(
    ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResponse<List<QuestionsViewDto>>> GetQuestionsAsync(string skill)
    {
        var response = new ServiceResponse<List<QuestionsViewDto>>();

        var questions = await _db.Questions.Where(c => c.Skill.ToLower() == skill.ToLower())
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
}
