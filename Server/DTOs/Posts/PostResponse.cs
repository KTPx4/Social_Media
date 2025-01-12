using Server.Models.Community.Posts;
using static Server.Models.Community.Posts.Post;


namespace Server.DTOs.Posts
{
    public class PostResponse
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string AuthorProfile { get; set; }
        public string AuthorImg {  get; set; }
        public string Content { get; set; }
        public Guid? PostShareId { get; set; }
        public bool IsHide { get; set; }
        public PostStatus Status { get; set; }
        public PostType Type { get; set; }
        public int SumLike { get; set; }
        public int SumComment { get; set; }
        public bool isLike { get; set; } = false;
        public bool isSave { get; set; } = false;

        public List<MediaResponse> ListMedia { get; set; } = new List<MediaResponse>();

        public PostResponse()
        {
            
        }
        public PostResponse(Post post, string host)
        {
            this.Id = post.Id;
            this.CreatedAt = post.CreatedAt;
            this.AuthorId = post.AuthorId;
            this.Content = post.Content;
            this.PostShareId = post.PostShareId;
            this.IsHide = post.IsHide;
            this.Status = post.Status;
            this.Type = post.Type;
            
            if(post.Author != null)
            {
                this.AuthorImg = $"{host}/public/account/{post.Author.Id.ToString()}/{post.Author.ImageUrl}";
                this.AuthorProfile = post.Author.UserProfile;
            }

            if(post.Medias != null)
            {

                foreach (var m in post.Medias)
                {
                    ListMedia.Add(new MediaResponse()
                    {
                        Id = m.Id,
                        Content = m.Content,
                        ContentType = m.ContentType, 
                        IsDeleted = m.IsDeleted,
                        MediaUrl = $"{host}/api/file/src?id={m.Id.ToString()}&token=",
                        PostId = m.PostId,
                        Type = m.Type
                    });
                }
            }    
        }
    }
}
