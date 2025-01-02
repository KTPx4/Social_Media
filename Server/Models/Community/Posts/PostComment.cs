using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Posts
{
    [Table("PostComment")]
    public class PostComment
    {
        public enum MediaType
        {
            Image = 0, Video = 1
        }
        [Key]
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ReplyCommentId {  get; set; }
        public Guid? RootCommentId { get; set; }
        public string Content { get; set; }
        public string MediaUrl { get; set; }
        public MediaType MType { get; set; }
        public DateTime CreatedAt { get; set; }

        public Post Post { get; set; }
        public User User { get; set; }
        public PostComment? ReplyComment { get; set; }
        
        public ICollection<CommentReaction> Reactions { get; set; }
    }
}
