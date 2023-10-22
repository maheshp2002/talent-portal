using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace talent_portal.Domain.Models;

[Index(nameof(Id), IsUnique = true)]
public class ApplicationUser : IdentityUser
{
    public string Name { get; set; }

    public string Resume { get; set; }

    public bool IsAdmin { get; set; }
}
