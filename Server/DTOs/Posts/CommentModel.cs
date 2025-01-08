using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Server.DTOs.Posts
{
    public class CommentModel
    {
        [AllowNull]
        public string? ReplyCommentId { get; set; }
        
        [Required]
        public string Content { get; set; }
    }
}
