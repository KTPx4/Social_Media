using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Story
{
    [Table("Storys")]
    public class Story
    {
        public enum StoryStatus
        {
            Public = 0, Private = 1, Friend = 2
        }

        [Key]
        public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public StoryStatus Status { get; set; }
        public bool IsHide { get; set; }

        public User Author { get; set; }

        public ICollection<StorySeen> Seens { get; set; }
    }
}
