namespace talent_portal.Service.Dto;

public class ExamResultDto
{
    public int Id { get; set; }

    public bool IsPassed { get; set; }

    public string? Score { get; set; }

    public int JobId { get; set; }

    public string? UserId { get; set; }
}
