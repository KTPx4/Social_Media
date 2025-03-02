using System.ComponentModel.DataAnnotations;
using static Server.Models.Reports.Report;

namespace Server.DTOs.Admin
{
    public class ReportModel
    {
        public TargetTypes TargetType { get; set; } = TargetTypes.Post;
        
        [Required]
        public Guid? TargetId { get; set; }

        [Required]
        public string Reason { get; set; }

        [Required]
        public string ReportType { get; set; }
    }
}
