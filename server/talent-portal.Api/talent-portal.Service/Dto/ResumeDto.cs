using Microsoft.AspNetCore.Http;

namespace talent_portal.Service.Dto;

public class ResumeDto
{
    public string Id { get; set; }

    public IFormFile? Resume { get; set; }

    public IFormFile? ProfileImage { get; set; }

}
