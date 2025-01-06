using static Server.Models.Community.Posts.PostMedia;

namespace Server.DTOs.Posts
{
    public class MediaResponse
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public MediaType Type { get; set; }
        public string MediaUrl { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; }
        public string ContentType { get; set; }

    }
}
