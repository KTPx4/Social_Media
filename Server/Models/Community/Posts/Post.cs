using Server.Models.Account;
using Server.Models.Community.PostsUpdates;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Posts
{
    [Table("Posts")]
    public class Post
    {
        public enum PostStatus
        {
            Public  =0 , Private = 1, Friend = 2
        }

        public enum PostType
        {
            Post = 0, Share = 1
        }
        [Key]
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string Content { get; set; }
        public Guid? PostShareId { get; set; }
        public bool IsHide { get; set; }
        public PostStatus Satus { get; set; }
        public PostType Type { get; set; }

        public User Author { get; set; }
        public Post? PostShare { get; set; }
        public ICollection<PostUserTag> UserTags { get; set; }
        public ICollection<PostMedia> Medias { get; set; }
        public ICollection<PostLike> Likes { get; set; }
        public ICollection<PostComment> Comments { get; set; }

        public ICollection<PostUpdate> Updates {  get; set; }

    }
}
