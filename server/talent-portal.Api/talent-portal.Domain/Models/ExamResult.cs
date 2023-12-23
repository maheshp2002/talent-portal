using System.ComponentModel.DataAnnotations.Schema;

namespace talent_portal.Domain.Models
{
    public class ExamResult
    {
        public int Id { get; set; }

        public bool IsPassed { get; set; }

        public int Score { get; set; }

        public int TotalScore { get; set; }

        public string? ExamDate { get; set; }

        [ForeignKey(nameof(JobId))]
        public int JobId { get; set; }
        public Job Job { get; set; }

        [ForeignKey(nameof(ApplicationUserId))]
        public string? ApplicationUserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
