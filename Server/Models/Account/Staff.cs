using Server.Models.Reports;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Server.Models.Account
{
    [Table("Staffs")]
    public class Staff
    {
        public enum StaffRole
        {
            Admin = 0, Mod = 1
        }
        public enum RolePosition
        {
            All = 0, User = 1, Post = 2, Story = 3
        }

        [Key]
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        [AllowNull]
        public string UserProfile { get; set; }
        [AllowNull]
        public string Bio { get; set; }
        [AllowNull]
        public string Name { get; set; }
        [AllowNull]
        public string Gender { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email!")]
        [AllowNull]
        public string Email { get; set; }
        [AllowNull]
        public string Phone { get; set; }
        [AllowNull]
        public string ImageUrl { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }

        public StaffRole Role { get; set; } = StaffRole.Admin;
        public RolePosition Position { get; set; } = RolePosition.All;

        public ICollection<Report> Reports { get; set; }

    }
}
