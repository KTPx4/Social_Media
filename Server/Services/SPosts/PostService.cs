using Server.Data;
using Server.DTOs.Post;
using Server.Models.Community.Posts;

namespace Server.Services.SPosts
{
    public class PostService
    {

        private readonly APIDbContext context;
        public PostService(APIDbContext context)
        {
            this.context = context;
        }

        public Task<Post> CreatePost(CreatePostModel createPostModel, List<FileInfoDto> fileInfos)
        {
            return null;
        }
    }
}
