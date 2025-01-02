using Server.Models.Community.PostsUpdates;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.PostUpdates
{
    [Table("PostMediaUpdate")]
    public class PostMediaUpdate
    {
        public enum MediaType
        {
            Image = 0, Video = 1
        }

        [Key]
        public Guid Id { get; set; }
        public Guid PostUpdateId { get; set; }
        public MediaType Type { get; set; }
        public string MediaUrl { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; }

        public PostUpdate PostUpdate { get; set; }
    }
}
