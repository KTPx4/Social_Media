using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Communication
{
    [Table("ConvSettings")]
    public class ConvSetting
    {
        public enum ConvPermission
        {
            All = 0, Leader = 1
        }

        [Key] // Đánh dấu là khóa chính
        [ForeignKey(nameof(Conversation))] // Đánh dấu là khóa ngoại
        public Guid ConversationId { get; set; }
        public ConvPermission CanSend { get; set; }
        public ConvPermission CanEdit { get; set; }

        public Conversation Conversation { get; set; }

    }
}
