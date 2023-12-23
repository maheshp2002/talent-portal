namespace talent_portal.Service.Dto;

public class ResultViewUserDto
{
    public int Id { get; set; }

    public bool IsPassed { get; set; }

    public int Score { get; set; }

    public int TotalScore { get; set; }

    public string JobName { get; set; }

    public string JobPosition { get; set; }

    public string JobDescription { get; set; }

    public string ExamDate { get; set; }
}
