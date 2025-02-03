using Server.Models.Communication;
using static Server.Models.Communication.Conversation;
using static Server.Models.Communication.ConvSetting;

namespace Server.DTOs.Communication
{
    public class ConversationResponse
    {
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public MessageResponse LastMessage { get; set; }
        public int UnRead { get; set; } = 0;

        // setting
        public ConvPermission CanSend { get; set; }
        public ConvPermission CanEdit { get; set; }

        //member
        public  List<MemberResponse> Members { get; set; }
       
        public ConversationResponse() { }
     
        public ConversationResponse(Conversation conversation, string serverHost, string accessImg)
        {
            initValue(conversation, serverHost, accessImg);
        }

        public ConversationResponse(Conversation conversation, Message lastMessage, int unRead,  string serverHost, string accessImg)
        {
            initValue(conversation, serverHost, accessImg);
            this.LastMessage = new MessageResponse(lastMessage);
            this.UnRead = unRead;
        }

        private void initValue(Conversation conversation, string serverHost, string accessImg)
        {
            this.Id = conversation.Id;
            this.Type = conversation.Type;
            this.Name = conversation.Name;
            this.CreatedAt = conversation.CreatedAt;
            
            if(conversation.Type == ConversationType.Group)
            {
                this.ImageUrl = $"{serverHost}/api/file/src?t=conversation&id={conversation.Id}&token=";
            }

            if(conversation.ConvSetting != null)
            {
                this.CanSend = conversation.ConvSetting.CanSend;
                this.CanEdit = conversation.ConvSetting.CanEdit;
            }    

            // Ánh xạ danh sách thành viên
            if (conversation.Members != null)
            {
                this.Members = conversation.Members.Select(member => new MemberResponse
                {
                    ConversationId = conversation.Id,
                    UserId = member.UserId,
                    NickName = member.NickName,
                    Role = member.Role,
                    Notify = member.Notify,
                    ImageUrl = $"{serverHost}/{accessImg}/{member.UserId}/{member.User?.ImageUrl}",
                    Name = member.User?.Name,
                    UserProfile = member.User?.UserProfile,
                }).ToList();
            }
        }
    }
}
