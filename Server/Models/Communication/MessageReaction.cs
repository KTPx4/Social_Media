using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;
 
namespace Server.Models.Communication
{
    [Table("MessageReactions")]
    public class MessageReaction
    {

        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public string React {  get; set; }
        public DateTime CreatedAt { get; set; }

        public Message Message { get; set; }
        public User User { get; set; }
    }
}
