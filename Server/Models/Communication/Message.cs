using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Communication
{
    [Table("Messages")]
    public class Message
    {
        public enum MessageType
        {
            Text = 0, Image = 1, Video = 2, File = 3
        }
        [Key]
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid? SenderId { get; set; }
        public Guid? ReplyMessageId { get; set; }
        public bool IsSystem { get; set; }
        public MessageType Type { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public Conversation Conversation { get; set; }
        public User? Sender { get; set; }
        public Message? ReplyMessage { get; set; }
        public ICollection<MessageSeen> Seens { get; set; }
        public ICollection<MessageReaction> Reacts { get; set; }

    }
}
