using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Communication
{
    [Table("MessageSeen")]
    public class MessageSeen
    {
        public enum SeenStatus
        {
            Sent = 0, Seen = 1
        }

        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public SeenStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public Message Message { get; set; }
        public User User { get; set; }
    }
}
