using Server.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Story
{
    [Table("StorySeens")]
    public class StorySeen
    {
        public Guid StoryId { get; set; }
        public Guid UserId { get; set; }
        public string React {  get; set; }

        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public Story Story { get; set; }

    }
}
