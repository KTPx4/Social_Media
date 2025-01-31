using static Server.Models.Communication.Message;

namespace Server.DTOs.Communication
{
    public class MessageModel
    {
        public string SenderId { get; set; }
        public Guid ConversationId { get; set; }
        public Guid? ReplyMessageId { get; set; }
        
        public MessageType Type { get; set; } = MessageType.Text;

        public string Content { get; set; }
       
    }
}
