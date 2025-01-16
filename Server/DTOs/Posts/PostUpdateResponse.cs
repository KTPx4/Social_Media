using Server.Models.Community.Posts;
using Server.Models.Community.PostsUpdates;
using static Server.Models.Community.Posts.Post;

namespace Server.DTOs.Posts
{
    public class PostUpdateResponse
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string AuthorProfile { get; set; }
        public string AuthorImg { get; set; }
        public string Content { get; set; }
        public Guid? PostShareId { get; set; }
        public bool IsHide { get; set; }
        public PostStatus Status { get; set; }
        public PostType Type { get; set; }
        public  Guid PostId { get; set; }
        public List<MediaResponse> ListMedia { get; set; } = new List<MediaResponse>();
       
        public PostUpdateResponse(PostUpdate post, string host)
        {
            this.Id = post.Id;
            this.CreatedAt = post.CreatedAt;
            this.AuthorId = post.AuthorId;
            this.Content = post.Content;
            this.PostShareId = post.PostShareId;
            this.IsHide = post.IsHide;
            this.Status = post.Status;
            this.Type = post.Type;
            this.PostId = post.PostId;

            var medias = post.Medias;
            var author = post.Author;

             

            if (author != null)
            {
                this.AuthorImg = $"{host}/public/account/{author.Id.ToString()}/{author.ImageUrl}";
                this.AuthorProfile = post.Author.UserProfile;
            }

            if (medias != null)
            {

                foreach (var m in medias)
                {
                    ListMedia.Add(new MediaResponse()
                    {
                        Id = m.Id,
                        Content = m.Content,
                        ContentType = m.ContentType,
                        IsDeleted = m.IsDeleted,
                        MediaUrl = $"{host}/api/file/src?id={m.MediaId.ToString()}&token=",
                        Type = m.Type,
                    });
                }
            }
        }
    }
}
