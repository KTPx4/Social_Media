using static Server.Models.Community.Posts.Post;

namespace Server.DTOs.Post
{
    public class CreatePostModel
    {
        public string Content { get; set; }
        //public Guid? PostShareId { get; set; }
        public PostStatus Satus { get; set; }
        public PostType Type { get; set; }
    }
}
