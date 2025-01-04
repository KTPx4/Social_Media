using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.RelationShip
{
    [Table("FriendShips")]

    public class FriendShip
    {
        public enum FriendStatus
        {
            Normal = 0, Prevented = 1, Obstructed = 2
        }

        public enum FriendType
        {
            None = 0, Waiting = 1, Response = 2
        }

        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }

        public FriendStatus Status { get; set; }
        public FriendType Type { get; set; }

        public bool IsFriend { get; set; }

        public User User { get; set; }
        public User Friend { get; set; }

    }
}
