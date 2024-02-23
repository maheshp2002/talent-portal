using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace talent_portal.Domain.Models
{
    [Index(nameof(Question), IsUnique = true)]
    public class ExamQuestion
    {
        public int Id { get; set; }

        public string Question { get; set; }

        public bool IsCodeProvided { get; set; }

        public string? Code { get; set; }

        public string OptionOne { get; set; }

        public string OptionTwo { get; set; }

        public string OptionThree { get; set; }

        public string OptionFour { get; set; }

        public string Answer { get; set; }

        public string Skill { get; set; }

        public bool IsDescriptiveQuestion { get; set; }
    }
}
