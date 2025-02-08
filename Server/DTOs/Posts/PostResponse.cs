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
        public int SumEdit { get; set; } = 0;
        public List<MediaResponse> ListMedia { get; set; } = new List<MediaResponse>();
        public PostResponse? PostShare { get; set; }
        public PostResponse()
        {
            
        }
        public PostResponse(Post? post, string host)
        {
            if (post == null) return;
            this.Id = post.Id;
            this.CreatedAt = post.CreatedAt;
            this.AuthorId = post.AuthorId;
            this.Content = post.Content;
            this.PostShareId = post.PostShareId;
            this.IsHide = post.IsHide;
            this.Status = post.Status;
            this.Type = post.Type;

            var medias = post.Medias;
            var author = post.Author;
            
            this.SumLike = post.Likes?.Count ?? 0;
            this.SumComment = post.Comments?.Count ?? 0;
            if(post.PostShare != null)
            {
                this.PostShare = new PostResponse(post.PostShare, host);
            }
            if (post.Updates?.Count > 0) 
            {
                this.SumEdit = post.Updates?.Count ?? 0;
            }

            if(author != null)
            {
                this.AuthorImg = $"{host}/public/account/{author.Id.ToString()}/{author.ImageUrl}";
                this.AuthorProfile = post.Author.UserProfile;
            }

            if(medias != null)
            {

                foreach (var m in medias)
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

        public static List<PostResponse> GetPostResponses(ICollection<Post> posts, string host) 
        {
            var list = new List<PostResponse>();
            foreach (var post in posts) 
            {
                list.Add(new PostResponse(post, host));
            }
            return list;
        }
    }
}
