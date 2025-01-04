using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Posts
{
    [Table("PostMedias")]
    public class PostMedia
    {
        public enum MediaType
        {
            Image = 0, Video = 1
        }

        [Key]
        public Guid Id { get; set; }
        public Guid PostId  { get; set; }
        public MediaType Type { get; set; }
        public string MediaUrl { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; }

        public Post Post { get; set; }

    }
}
