using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using talent_portal.Domain.Models;

namespace talent_portal.Service.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        #region Seeding Roles
        var roles = new IdentityRole[]
        {
                new IdentityRole()
                {
                    Id = "e2a85572-7b8c-4a95-a862-c557c3b2e868",
                    ConcurrencyStamp = "e2a85572-7b8c-4a95-a862-c557c3b2e868",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole()
                {
                    Id = "e2a85572-7b8c-4a95-a862-c557c3b2e870",
                    ConcurrencyStamp = "e2a85572-7b8c-4a95-a862-c557c3b2e870",
                    Name = "User",
                    NormalizedName = "USER"
                }
        };
        builder.Entity<IdentityRole>().HasData(roles);
        #endregion

        #region Seed admin User
        //var passwordHasher = new PasswordHasher<ApplicationUser>();
        //var user = new ApplicationUser
        //{
        //    Id = "e2a85572-7b8c-4a95-a862-c557c3b2e869",
        //    Email = "admin@mail.com",
        //    Name = "Admin",
        //    NormalizedEmail = "ADMIN@MAIL.COM",
        //    Resume = "",
        //    SecurityStamp = "e2a85572-7b8c-4a95-a862-c557c3b2e869",
        //    ConcurrencyStamp = "e2a85572-7b8c-4a95-a862-c557c3b2e869",
        //    UserName = "admin",
        //    NormalizedUserName = "ADMIN"
        //    // Not a good practice. Set an empty password and ask admin to enter a password
        //    // when the user tries to login for the first time.
        //    //PasswordHash = "AQAAAAEAACcQAAAAEG09qLqexOh2KjF2ffM+XoY5wlk8jp+XYNpcJoxLCn9s1XUCtiNNu817MjrnYoR0yw=="

        //};

        // Assign the "Admin" role to the "Admin" user.
        //builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        //{
        //    RoleId = "e2a85572-7b8c-4a95-a862-c557c3b2e868", // RoleId for "Admin"
        //    UserId = user.Id
        //});

        //user.PasswordHash = passwordHasher.HashPassword(user, "Pass@123");
        //builder.Entity<ApplicationUser>().HasData(user);
        #endregion
    }

    public DbSet<ApplicationUser> ApplicationUser { get; set; }

    public DbSet<ExamQuestion> Questions { get; set; }

    public DbSet<Job> Jobs { get; set; }

    public DbSet<ExamResult> Results { get; set; }
}
