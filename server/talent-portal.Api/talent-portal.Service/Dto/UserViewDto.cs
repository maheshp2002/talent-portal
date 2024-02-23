namespace talent_portal.Service.Dto
{
    public class UserViewDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public bool IsAdmin { get; set; }

        public string? Resume { get; set; }

        public string? ResumeUrl { get; set; }

        public string? ProfileImage { get; set; }
    }
}
