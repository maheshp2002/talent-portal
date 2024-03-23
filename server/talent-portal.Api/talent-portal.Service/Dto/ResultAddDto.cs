using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace talent_portal.Service.Dto;

public class ResultAddDto
{
    public bool IsPassed { get; set; }

    public decimal Score { get; set; }

    public int JobId { get; set; }

    public string? UserId { get; set; }

    public int TotalScore { get; set; }

    public string? UserImage { get; set; }
}
