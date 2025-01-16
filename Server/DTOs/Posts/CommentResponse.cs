using Server.Models.Community.Posts;

namespace Server.DTOs.Posts
{
    public class CommentResponse
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public string UserProfile { get; set; }
        public string ImageUrl { get; set; }
        public Guid? ReplyCommentId { get; set; }
        public string ReplyUserProfile { get; set; }
        public Guid? RootCommentId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CountReply { get; set; }
        public bool IsLike { get; set; } = false;
        public int CountLike { get; set; } = 0;
        public CommentResponse()
        {
            
        }
        public CommentResponse(PostComment postComment)
        {
            this.Id = postComment.Id;
            this.PostId = postComment.PostId;
            this.UserId = postComment.UserId;
            this.ReplyCommentId = postComment.ReplyCommentId;
            this.RootCommentId = postComment.RootCommentId;
            this.Content = postComment.Content;
            this.CreatedAt = postComment.CreatedAt;
        }
    }
}
