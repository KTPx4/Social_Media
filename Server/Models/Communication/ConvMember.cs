using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Communication
{
    [Table("ConvMembers")]
    public class ConvMember
    {
        public enum ConversationRole
        {
            None = 0, Member = 1, Leader = 2, Deputy = 3
        }
        public enum SettingNotify
        {
            Normal = 0, Fifteen = 1, Thirty = 2, Hour = 3, TurnOn = 4
        }

        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }
        public ConversationRole Role { get; set; }
        public SettingNotify Notify { get; set; }

        public string? NickName { get; set; }

        public Conversation Conversation { get; set; }
        public User? User { get; set; }

    }
}
