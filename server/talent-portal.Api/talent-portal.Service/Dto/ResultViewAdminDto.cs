namespace talent_portal.Service.Dto;

public class ResultViewAdminDto
{
    public int Id { get; set; }

    public bool IsPassed { get; set; }

    public decimal Score { get; set; }

    public string JobName { get; set; }

    public string Resume { get; set; }

    public int TotalScore { get; set; }

    public string JobDescription { get; set; }

    public string ExamDate { get; set; }

    public string UserName { get; set;}

    public string UserEmail { get; set; }
}
