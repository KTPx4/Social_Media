using static Server.Models.Reports.Report;

namespace Server.DTOs.ReportDTO
{
    public class UpdateReportModel
    {
        public ReportStatus Status { get; set; }
    }
}
