using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Account;
using Server.DTOs.Admin;
using Server.DTOs.ReportDTO;
using Server.Models.Account;
using Server.Models.Reports;
using System.Data;

namespace Server.Services
{
    public class AdminService
    {
        private readonly APIDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;

        private readonly string _ServerHost;
        private readonly string _AccessImgAccount;
        private readonly string _PublicUrl;
        public AdminService(APIDbContext context, UserManager<User> userManager, IConfiguration configuration, RoleManager<Role> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
            

            var serverSettings = _configuration.GetSection("ServerSettings");
         
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];
            _PublicUrl = $"{_ServerHost}/{_AccessImgAccount}";
        }

        public async Task<InfoSystemResponse> GetInfoSystem()
        {
            double CountMod = 0, CountPost = 0, CountAccount = 0, CountReport = 0;  
            


            var users = await _userManager.GetUsersInRoleAsync("Mod");
            if (users != null)
            {
                CountMod = users.Count();
            }

            CountAccount = await _context.Users.CountAsync();
            CountPost = await _context.Posts.CountAsync();
            CountReport = await _context.Reports.CountAsync();

            return new InfoSystemResponse()
            {
                TotalAccount = CountAccount,
                TotalMod = CountMod,
                TotalPost = CountPost,
                TotalReport = CountReport
            };
        }

        public async Task<List<InfoChartReport>> ReportAccount(int year = 2025)
        {
            var stats = await _context.Users
              .Where(u => u.CreatedAt.Year == year)
              .GroupBy(u => u.CreatedAt.Month)
              .Select(g => new InfoChartReport()
              {
                  Month = g.Key,
                  Count = g.Count()
              })
              .OrderBy(g => g.Month)
              .ToListAsync();

            return stats;
        }
        public async Task<List<InfoChartReport>> ReportPost(int year = 2025)
        {
            var stats = await _context.Posts
              .Where(u => u.CreatedAt.Year == year)
              .GroupBy(u => u.CreatedAt.Month)
              .Select(g => new InfoChartReport()
              {
                  Month = g.Key,
                  Count = g.Count()
              })
              .OrderBy(g => g.Month)
              .ToListAsync();

            return stats;
        }
        public async Task<List<InfoChartReport>> ReportReport(int year = 2025)
        {
            var stats = await _context.Reports
              .Where(u => u.CreatedAt.Year == year)
              .GroupBy(u => u.CreatedAt.Month)
              .Select(g => new InfoChartReport()
              {
                  Month = g.Key,
                  Count = g.Count()
              })
              .OrderBy(g => g.Month)
              .ToListAsync();

            return stats;
        }
        public async Task<List<ReportResponse>> GetReportPosts()
        {
            var rps = await _context.Reports
                .Where(r => r.TargetType == Models.Reports.Report.TargetTypes.Post)
                .Select (r => new ReportResponse(r))
                .ToListAsync();

            return rps;
        }

        public async Task<List<UserResponse>> GetInfoUser()
        {
            // Lấy danh sách UserId có role "Mod"
            var modRole = await _roleManager.FindByNameAsync("mod");
            var modUserIds = new HashSet<Guid>();
            var userUserIds = new HashSet<Guid>();

            if (modRole != null)
            {
                modUserIds = await _context.UserRoles
                                         .Where(ur => ur.RoleId == modRole.Id)
                                         .Select(ur => ur.UserId)
                                         .ToHashSetAsync();

            }
            // Lấy danh sách UserId có role "User"
            var userRole = await _roleManager.FindByNameAsync("User");
            if(userRole != null)
            {

                userUserIds = await _context.UserRoles
                                            .Where(ur => ur.RoleId == userRole.Id)
                                            .Select(ur => ur.UserId)
                                            .ToHashSetAsync();

            }


            // Lấy danh sách user thỏa mãn điều kiện
            var users = await _context.Users
                .Where(u =>( userUserIds.Contains(u.Id) || !modUserIds.Contains(u.Id) ) && u.UserName.ToLower() != "admin")
                .Select(u => new UserResponse()
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    UserProfile = u.UserProfile,
                    Bio = u.Bio,
                    Name = u.Name,
                    Gender = u.Gender,
                    Email = u.Email,
                    Phone = u.Phone,
                    ImageUrl = $"{_PublicUrl}/{u.Id}/{u.ImageUrl}",
                    IsDeleted = u.IsDeleted,
                    CreatedAt = u.CreatedAt,
                })
                .ToListAsync();

            return users;
             
        }
        public async Task<List<UserResponse>> GetInfoMod()
        {
            // Lấy danh sách UserId có role "Mod"
            var modRole = await _roleManager.FindByNameAsync("mod");
            if (modRole == null) return null;

            var modUserIds = await _context.UserRoles
                                     .Where(ur => ur.RoleId == modRole.Id)
                                     .Select(ur => ur.UserId)
                                     .ToHashSetAsync();

            // Lấy danh sách user thỏa mãn điều kiện
            var users = await _context.Users
                .Where(u => modUserIds.Contains(u.Id)  && u.UserName.ToLower() != "admin")
                .Select(u => new UserResponse()
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    UserProfile = u.UserProfile,
                    Bio = u.Bio,
                    Name = u.Name,
                    Gender = u.Gender,
                    Email = u.Email,
                    Phone = u.Phone,
                    ImageUrl = $"{_PublicUrl}/{u.Id}/{u.ImageUrl}",
                    IsDeleted = u.IsDeleted,
                    CreatedAt = u.CreatedAt,
                })
                .ToListAsync();

            return users;

        }
        public async Task<IList<String>> GetRole(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new Exception("Admin-User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return roles;
        }
        public async Task<bool> SetRole(Guid userId, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new Exception("Admin-User not found");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (roles.Contains("mod-account") || roles.Contains("mod-post"))
            {
                roles.Add("mod");
            }

            // Kiểm tra và tạo role nếu chưa có (Chạy tuần tự để tránh lỗi DbContext)
            foreach (var role in roles.Distinct())
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new Role(role));
                }
            }

            await _userManager.AddToRolesAsync(user, roles.Distinct());
            return true;
        }
        public async Task<bool> BanUser(Guid userId)
        {
            var user = await _context.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user == null) throw new Exception("Admin-User not found");

            user.IsDeleted = true;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> UnBanUser(Guid userId)
        {
            var user = await _context.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (user == null) throw new Exception("Admin-User not found");

            user.IsDeleted = false;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> SetSatusReport(string userId, string reportId, UpdateReportModel request)
        {
            var report = await _context.Reports.Where(r => r.Id.ToString() == reportId).FirstOrDefaultAsync();
            if (report == null) throw new Exception("Admin-Report not exists");
          

            report.Status = Report.ReportStatus.Resolved;
            report.StaffResolveId = new Guid(userId);

            report.Status = request.Status;
            if (request.Status == Report.ReportStatus.Resolved)
            {
                report.ResolvedAt = DateTime.UtcNow;
                report.Details = "Report has been resolve";
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
