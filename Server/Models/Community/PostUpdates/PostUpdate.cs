using Server.Models.Account;
 
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Server.Models.Community.Posts;
using Server.Models.Community.PostUpdates;

namespace Server.Models.Community.PostsUpdates
{
    
    [Table("PostUpdate")]
    public class PostUpdate
    {
        public enum PostStatus
        {
            Public = 0, Private = 1, Friend = 2
        }

        public enum PostType
        {
            Posts = 0, Share = 1
        }
        [Key]
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public int Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string Content { get; set; }
        public Guid? PostShareId { get; set; }
        public bool IsHide { get; set; }
        public PostStatus Satus { get; set; }
        public PostType Type { get; set; }

        public Post OriginPost { get; set; }
        public User Author { get; set; }
        public Post? PostShare { get; set; }
        public ICollection<PostUserTag> UserTags { get; set; }
        public ICollection<PostMediaUpdate> Medias { get; set; }
 

    }
}
