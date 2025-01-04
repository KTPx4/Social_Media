using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Reports
{
    [Table("Reports")]

    public class Report
    {
        public enum TargetTypes
        {
            Post = 0, User = 1, Story = 2
        }

        public enum ReportStatus
        {
            Pending = 0, InProcess = 1, Resolved = 2
        }

        public Guid Id { get; set; }
        public TargetTypes TargetType { get; set; }
        public Guid? TargetId { get; set; }
        public string ReportType { get; set; }
        public string Reason { get; set; }
        public ReportStatus Status { get; set; }
        public ReportStatus Result { get; set; }
        public string Details { get; set; }
        public Guid? StaffResolveId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ResolvedAt { get; set; }

        public Staff? StaffResolve { get; set; }


    }
}
