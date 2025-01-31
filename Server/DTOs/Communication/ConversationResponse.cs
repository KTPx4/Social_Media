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

        // setting
        public ConvPermission CanSend { get; set; }
        public ConvPermission CanEdit { get; set; }

        //member
        public  List<MemberResponse> Members { get; set; }
       
        public ConversationResponse() { }
        public ConversationResponse(Conversation conversation, ConvSetting convSetting, string host)
        {
            Id = conversation.Id;
            Type = conversation.Type;
            Name = conversation.Name;
            ImageUrl = conversation.ImageUrl;
            CreatedAt = conversation.CreatedAt;

            CanSend = convSetting.CanSend;
            CanEdit = convSetting.CanEdit;

            // Ánh xạ danh sách thành viên
            if (conversation.Members != null)
            {
                Members = conversation.Members.Select(member => new MemberResponse
                {
                    ConversationId = conversation.Id,
                    UserId = member.UserId,
                    NickName = member.NickName,
                    Role = member.Role,
                    Notify = member.Notify,
                    ImageUrl = $"{host}/{member.UserId}/{member.User?.ImageUrl}",
                    Name = member.User?.Name,
                    UserProfile = member.User?.UserProfile,
                }).ToList();
            }
        }


    }
}
