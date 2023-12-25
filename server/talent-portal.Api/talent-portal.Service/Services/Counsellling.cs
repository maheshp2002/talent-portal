using Microsoft.EntityFrameworkCore;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class CounsellingService
{
    private readonly ApplicationDbContext _db;

    public CounsellingService(
    ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResponse<List<CareerCounsellingDto>>> GetAllCounsellingAsync()
    {
        var response = new ServiceResponse<List<CareerCounsellingDto>>();

        var result = await _db.Counsellings
            .Select(c => new CareerCounsellingDto
            {
                Name = c.Name,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Address = c.Address,
                WebsiteUrl = c.WebsiteUrl
            }).ToListAsync();

        response.Result = result;

        return response;
    }

    public async Task<ServiceResponse<CareerCounsellingDto>> CounsellingAddAsync(CareerCounsellingDto dto)
    {
        var response = new ServiceResponse<CareerCounsellingDto>();

        var result = new CareerCounselling
        {
            Name = dto.Name,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            WebsiteUrl = dto.WebsiteUrl
        };

        _db.Counsellings.Add(result);

        await _db.SaveChangesAsync();

        response.Result = new CareerCounsellingDto
        {
            Name = result.Name,
            Email = result.Email,
            PhoneNumber = result.PhoneNumber,
            Address = result.Address,
            WebsiteUrl = result.WebsiteUrl
        };

        return response;
    }
}
