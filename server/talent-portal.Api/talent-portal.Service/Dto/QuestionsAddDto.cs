namespace talent_portal.Service.Dto;

public class QuestionsAddDto
{
    public string Question { get; set; }

    public bool IsCodeProvided { get; set; }

    public string? Code { get; set; }

    public string OptionOne { get; set; }

    public string OptionTwo { get; set; }

    public string OptionThree { get; set; }

    public string OptionFour { get; set; }

    public string Answer { get; set; }

    public string Skill { get; set; }
}
