namespace talent_portal.Service.Dto;

public class ResultViewAdminDto
{
    public int Id { get; set; }

    public bool IsPassed { get; set; }

    public int Score { get; set; }

    public string JobName { get; set; }

    public string JobDescription { get; set; }

    public string ExamDate { get; set; }

    public string UserName { get; set;}

    public string UserEmail { get; set; }
}
