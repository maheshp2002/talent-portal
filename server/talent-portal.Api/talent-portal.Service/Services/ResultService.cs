using Microsoft.EntityFrameworkCore;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class ResultService
{
    private readonly ApplicationDbContext _db;

    public ResultService(
    ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResponse<List<ResultViewAdminDto>>> GetResultAdminAsync(int id)
    {
        var response = new ServiceResponse<List<ResultViewAdminDto>>();

        var jobs = await _db.Results.Where(c => c.JobId == id)
            .Select(c => new ResultViewAdminDto
            {
                Id = c.Id,
                Score = c.Score,
                IsPassed = c.IsPassed,
                ExamDate = c.ExamDate,
                JobName = _db.Jobs.FirstOrDefault(m => m.Id == c.JobId).Title,
                JobDescription = _db.Jobs.FirstOrDefault(m => m.Id == c.JobId).Description,
                UserEmail = _db.Users.FirstOrDefault(m => m.Id == c.ApplicationUserId).Email,
                UserName = _db.Users.FirstOrDefault(m => m.Id == c.ApplicationUserId).Name
            }).ToListAsync();

        response.Result = jobs;

        return response;
    }

    public async Task<ServiceResponse<List<ResultViewUserDto>>> GetAllResultUserAsync(string id)
    {
        var response = new ServiceResponse<List<ResultViewUserDto>>();

        var result = await _db.Results.Where(m => m.ApplicationUserId == id)
            .Select(c => new ResultViewUserDto
            {
                Id = c.Id,
                Score = c.Score,
                IsPassed = c.IsPassed,
                ExamDate = c.ExamDate,
                JobName = _db.Jobs.FirstOrDefault(m => m.Id == c.JobId).Title,
                JobDescription = _db.Jobs.FirstOrDefault(m => m.Id == c.JobId).Description
            }).ToListAsync();

        response.Result = result;

        return response;
    }

    public async Task<ServiceResponse<ResultViewUserDto>> GetCurrentResultAsync(CurrentResultDto dto)
    {
        var response = new ServiceResponse<ResultViewUserDto>();

        var data = _db.Results.FirstOrDefault(m => m.ApplicationUserId == dto.userId && m.JobId == dto.JobId);
        var result = new ResultViewUserDto
        {
            Id = data.Id,
            Score = data.Score,
            IsPassed = data.IsPassed,
            ExamDate = data.ExamDate,
            JobName = _db.Jobs.FirstOrDefault(m => m.Id == data.JobId).Title,
            JobDescription = _db.Jobs.FirstOrDefault(m => m.Id == data.JobId).Description
        };

        response.Result = result;

        return response;
    }

    public async Task<ServiceResponse<ResultViewUserDto>> ResultAddAsync(ResultAddDto dto)
    {
        var response = new ServiceResponse<ResultViewUserDto>();

        var result = new ExamResult
        {
            IsPassed = dto.IsPassed,
            Score = dto.Score,
            ApplicationUserId = dto.UserId,
            JobId = dto.JobId,
            ExamDate = DateTime.Now.ToString("MM/dd/yyyy")
        };

        _db.Results.Add(result);

        await _db.SaveChangesAsync();

        response.Result = new ResultViewUserDto
        {
            IsPassed = result.IsPassed,
            Score = result.Score,
            ExamDate = DateTime.Now.ToString("MM/dd/yyyy"),
            JobName = _db.Jobs.FirstOrDefault(m => m.Id == result.JobId).Title,
            JobDescription = _db.Jobs.FirstOrDefault(m => m.Id == result.JobId).Description
        };

        return response;
    }
}
