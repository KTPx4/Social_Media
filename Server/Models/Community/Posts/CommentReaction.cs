using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Posts
{
    [Table("CommentReactions")]
    public class CommentReaction
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CommentId { get; set; }
        public string React {  get; set; }
 
        public User User { get; set; }
        public PostComment Comment { get; set; }
    }
}
