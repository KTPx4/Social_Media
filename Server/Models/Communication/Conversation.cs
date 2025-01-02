using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Communication
{
    [Table("Conversation")]
    public class Conversation
    {
        public enum ConversationType
        {
            Direct = 0, Group = 1
        }

        [Key]
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        // Khai báo mối quan hệ ngược lại
        public ConvSetting ConvSetting { get; set; }

        public ICollection<ConvMember> Members { get; set; }

        public ICollection<Message> Messages { get; set; }

    }
}
