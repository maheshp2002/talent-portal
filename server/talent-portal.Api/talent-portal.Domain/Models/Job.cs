using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace talent_portal.Domain.Models
{
    public class Job
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public bool IsOpen { get; set; }

        public string Description { get; set; }

        public string Skills { get; set; }

        public string StartedDate { get; set; }
    }
}
