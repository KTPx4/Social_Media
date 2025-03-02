using Server.Models.Reports;
using static Server.Models.Reports.Report;

namespace Server.DTOs.ReportDTO
{
    public class ReportResponse
    {
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

        public ReportResponse() { }

        public ReportResponse(Report report) 
        { 
            Id = report.Id;
            TargetType = report.TargetType;
            TargetId = report.TargetId;
            ReportType = report.ReportType;
            Reason = report.Reason;
            Status = report.Status;
            Result = report.Result;
            Details = report.Details;
            StaffResolveId = report.StaffResolveId;
            CreatedAt = report.CreatedAt;
            ResolvedAt = report.ResolvedAt;
        }
    }
}
