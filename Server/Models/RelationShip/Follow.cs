using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Server.Models.Account;

namespace Server.Models.RelationShip
{
    [Table("Follows")]

    public class Follow
    {
        [Key, Column(Order = 0)]
        public Guid UserId { get; set; } // Người được follow

        [Key, Column(Order = 1)]
        public Guid FollowerId { get; set; } // Người follow

        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public User User { get; set; } // Người được follow
        public User Follower { get; set; } // Người follow
    }
}
