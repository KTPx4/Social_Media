using static Server.Models.Communication.ConvMember;

namespace Server.DTOs.Communication
{
    public class MemberResponse
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }
        public ConversationRole Role { get; set; }
        public SettingNotify Notify { get; set; }

        public string? NickName { get; set; }

        public string Name { get; set; }

        public string UserProfile { get; set; }
        public string ImageUrl { get; set; }

    }
}
