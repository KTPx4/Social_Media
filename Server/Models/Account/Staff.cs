using Server.Models.Reports;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Account
{
    [Table("Staff")]
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
        public string UserProfile { get; set; }
        public string Bio { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email!")]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ImageUrl { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }

        public StaffRole Role { get; set; }
        public RolePosition Position { get; set; }

        public ICollection<Report> Reports { get; set; }

    }
}
