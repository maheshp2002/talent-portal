namespace talent_portal.Service.Dto;

public class JobsAddDto
{
    public string Title { get; set; }

    public bool IsOpen { get; set; }

    public string? Description { get; set; }

    public string? Position { get; set; }
}
