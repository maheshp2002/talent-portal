using System.Text.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace talent_portal.Domain.Models
{
    public class Job
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public bool IsOpen { get; set; }

        public string Description { get; set; }

        [NotMapped]
        public List<string> Skills { get; set; }

        public string SerializedSkills
        {
            get => Skills != null ? JsonSerializer.Serialize(Skills) : null;
            set => Skills = !string.IsNullOrEmpty(value) ? JsonSerializer.Deserialize<List<string>>(value) : new List<string>();
        }

        public string StartedDate { get; set; }

        public string? Position { get; set; }
    }
}
