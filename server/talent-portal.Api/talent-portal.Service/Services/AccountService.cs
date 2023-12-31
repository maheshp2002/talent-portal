using MailKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Ocsp;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using talent_portal.Domain.Models;
using talent_portal.Service.Data;
using talent_portal.Service.Dto;
using MailService = talent_portal.Service.Email.MailService;
using talent_portal.Service.Type;

namespace talent_portal.Service.Services;

public class AccountService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signinManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _db;
    private readonly MailService _mailService;

    public AccountService(
    ApplicationDbContext db,
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager,
    SignInManager<ApplicationUser> signinManager,
    MailService mailService,
    IConfiguration configuration)
    {
        _db = db;
        _userManager = userManager;
        _roleManager = roleManager;
        _signinManager = signinManager;
        _mailService = mailService;
        _configuration = configuration;
    }

    private string GenerateToken(ApplicationUser user)
    {
        var roles = _userManager.GetRolesAsync(user)
                .GetAwaiter()
                .GetResult();
        var role = roles.FirstOrDefault();

        if (role != null)
        {
            var claims = new Claim[]
        {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, $"{user.Name}"),
                new Claim(ClaimTypes.Role, role),
                new Claim("role", role)
        };

            string issuer = _configuration["Jwt:Issuer"];
            string audience = _configuration["Jwt:Audience"];
            string key = _configuration["Jwt:Key"];

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, "HS256");

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        else
        {
            return "error";
        }
    }


    public async Task<ServiceResponse<string>> LoginAsync(LoginDto dto)
    {
        var response = new ServiceResponse<string>();

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            response.AddError(nameof(dto.Email), "An account with this email does not exist.");
            return response;
        }

        var signin = await _signinManager.CheckPasswordSignInAsync(user, dto.Password, true);
        if (signin.Succeeded)
        {
            response.Result = GenerateToken(user);
            return response;
        }

        // If the signin failed, generate error messages.
        if (signin.IsLockedOut)
            response.AddError("", "Account locked.");
        else if (signin.IsNotAllowed)
            response.AddError("", "You are not allowed to signin.");
        else
            response.AddError("", "Invalid email/password.");

        return response;
    }


    public async Task<ServiceResponse<UserViewDto>> RegisterAsync(CreateUserDto dto)
    {

        var response = new ServiceResponse<UserViewDto>();

        var existingUsersCount = await _db.ApplicationUser.CountAsync();

        var user = new ApplicationUser()
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name,
            Email = dto.Email,
            NormalizedEmail = dto.Email.ToUpper(),
            UserName = dto.Email,
            NormalizedUserName = dto.Email.ToUpper(),
            IsAdmin = false,
            Resume = ""
        };

        var hasher = new PasswordHasher<ApplicationUser>();
        user.PasswordHash = hasher.HashPassword(user, dto.Password);

        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        await _userManager.AddToRoleAsync(user, existingUsersCount != 0 ? "User" : "Admin");

        response.Result = new UserViewDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            Resume = user.Resume
        };

        return response;
    }

    public async Task<ServiceResponse<string>> UploadResumeAsync(ResumeDto dto)
    {

        var response = new ServiceResponse<string>();

        var user = _db.ApplicationUser.FirstOrDefault(m => m.Id == dto.Id && !m.IsAdmin);

        if (user == null)
        {
            response.AddError("resume upload error", "Unable to upload resume");
            return response;
        }

        if (user.Resume != null && user.Resume != "")
        {
            File.Delete(user.Resume);
        }

        string fileName = dto.File.FileName;
        string fileExtension = Path.GetExtension(fileName).ToLower();

        string uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
        string uploadsDir = Path.Join("Resumes", uniqueFileName);

        using (var fileStream = new FileStream(uploadsDir, FileMode.Create))
        {
            await dto.File.CopyToAsync(fileStream);
        }

        user.Resume = uploadsDir;
        response.Result = user.Resume;
        await _db.SaveChangesAsync();

        return response;
    }

    public async Task<ServiceResponse<UserViewDto>> GetUserProfileAsync(string userId)
    {

        var response = new ServiceResponse<UserViewDto>();

        var user = _db.Users.FirstOrDefault(u => u.Id == userId && !u.IsAdmin);

        if (user == null)
        {
            response.AddError("noUser", "No user found");
            return response;
        }

        response.Result = new UserViewDto()
        {
            Id = userId,
            Name = user.Name,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            Resume = user.Resume == null || user.Resume == "" ? "No resume uploaded" : user.Resume.Remove(0, 8),
            ResumeUrl = user.Resume == null || user.Resume == "" ? "" : "https://localhost:7163/" + user.Resume, // update url according to your local host
        };

        return response;
    }

    public async Task<ServiceResponse<AdminViewDto>> GetAdminProfileAsync(string adminId)
    {

        var response = new ServiceResponse<AdminViewDto>();

        var user = _db.Users.FirstOrDefault(u => u.Id == adminId && u.IsAdmin);

        if (user == null)
        {
            response.AddError("no admin", "No admin found");
            return response;
        }

        response.Result = new AdminViewDto()
        {
            Id = adminId,
            Name = user.Name,
            Email = user.Email
        };

        return response;
    }

    public async Task<ServiceResponse<bool>> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var response = new ServiceResponse<bool>();

        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            response.AddError("noUser", "There is no account registered with the provided email id.");
            response.Result = false;

            return response;
        }

        var jwtToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetPasswordUrl = _configuration.GetSection("AppSettings")["ResetPasswordUrl"];

        var mailData = new MailDto()
        {
            Email = dto.Email,
            Subject = "Talent Portal - Password Reset",
            Body = $"Hi {user.Name}<br><br>Please click the link below to change your password.<br><br>{resetPasswordUrl}?token={jwtToken}&email={dto.Email}<br><br>Talent Portal support team"
        };

        await _mailService.SendAsync(mailData);
        response.Result = true;

        return response;
    }

    public async Task<ServiceResponse<bool>> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var response = new ServiceResponse<bool>();

        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            response.AddError("noUser", "User not found.");
            return response;
        }

        var resetPassResult = await _userManager.ResetPasswordAsync(user, dto.Token, dto.Password);

        if (!resetPassResult.Succeeded)
        {
            response.AddError("unableToReset", "Invalid Token.");
            return response;

        }
        response.Result = true;

        return response;

    }

    // Handle jwt token decode
    private (string userId, string role) ExtractUserIdAndRoleFromToken(string token)
    {
        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadToken(token) as System.IdentityModel.Tokens.Jwt.JwtSecurityToken;

        if (jwtToken != null)
        {
            var userIdClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier);
            var roleClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role);

            if (userIdClaim != null && roleClaim != null)
            {
                return (userIdClaim.Value, roleClaim.Value);
            }
        }

        return (string.Empty, string.Empty);
    }
}