using Server.Models.Account;
 
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Server.Models.Community.Posts;
using Server.Models.Community.PostUpdates;

namespace Server.Models.Community.PostsUpdates
{
    
    [Table("PostUpdates")]
    public class PostUpdate
    {
      

        
        [Key]
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public int Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string Content { get; set; }
        public Guid? PostShareId { get; set; }
        public bool IsHide { get; set; }
        public Post.PostStatus Status { get; set; }
        public Post.PostType Type { get; set; }

        //
        public Post OriginPost { get; set; }
        public User Author { get; set; }
        public Post? PostShare { get; set; }
        public ICollection<PostUserTag> UserTags { get; set; }
        public ICollection<PostMediaUpdate> Medias { get; set; }
 

    }
}
