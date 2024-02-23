using Microsoft.AspNetCore.Identity;

namespace talent_portal.Domain.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; }

    public string Resume { get; set; }

    public string ProfileImage { get; set; }

    public bool IsAdmin { get; set; }
}
