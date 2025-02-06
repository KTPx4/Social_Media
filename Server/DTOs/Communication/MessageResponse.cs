using Server.Models.Communication;
using static Server.Models.Communication.Message;

namespace Server.DTOs.Communication
{
    public class MessageResponse
    {
        public Guid Id { get; set; }
        public Guid? SenderId { get; set; }

        public Guid ConversationId { get; set; }

        public Guid? ReplyMessageId { get; set; }

        public MessageType Type { get; set; } = MessageType.Text;

        public string Content { get; set; }
        public bool IsSystem { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; }

        public MessageResponse MessageReply { get; set; }

        public List<MessageReactResponse> Reacts { get; set; }
        public List<string> SeenIds { get; set; }


        public MessageResponse() { }

        public  MessageResponse(Message message)
        {
            if(message != null)
            {

                this.Id = message.Id;
                this.SenderId = message.SenderId;
                this.ConversationId = message.ConversationId;
                this.ReplyMessageId = message.ReplyMessageId;
                this.Type = message.Type;
                this.Content = message.Content;
                this.IsSystem = message.IsSystem;
                this.IsDeleted = message.IsDeleted;
                this.CreatedAt = message.CreatedAt;
            }
        }
    }
}
