using Microsoft.EntityFrameworkCore;
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
            Skills = jobs.Skills,
            StartedDate = jobs.StartedDate

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
                Skills = c.Skills,
                StartedDate = c.StartedDate
            }).ToListAsync();

        response.Result = jobs;

        return response;
    }

    public async Task<ServiceResponse<JobsViewDto>> JobsAddAsync(JobsAddDto dto)
    {
        var response = new ServiceResponse<JobsViewDto>();

        var jobs = new Job
        {
            Title = dto.Title,
            Description = dto.Description,
            IsOpen = dto.IsOpen,
            Skills = dto.Skills,
            StartedDate = DateTime.Now.ToString("MM/dd/yyyy")
        };

        _db.Jobs.Add(jobs);

        await _db.SaveChangesAsync();

        response.Result = new JobsViewDto
        {
            Title = jobs.Title,
            Description = jobs.Description,
            IsOpen = jobs.IsOpen,
            Skills = jobs.Skills,
            StartedDate = jobs.StartedDate
        };

        return response;
    }
}
