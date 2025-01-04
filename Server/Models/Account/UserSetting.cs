using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Account
{
    [Table("UserSettings")]

    public class UserSetting
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }

        public User User { get; set; }
    }
}
