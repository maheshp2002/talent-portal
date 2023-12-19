namespace talent_portal.Service.Dto;

public class JobsViewDto
{
    public int Id { get; set; }

    public string Title { get; set; }

    public bool IsOpen { get; set; }

    public string? Description { get; set; }

    public List<string> Skills { get; set; }

    public string StartedDate { get; set; }

    public string? Position { get; set; }
}
