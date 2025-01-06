using Microsoft.AspNetCore.Identity;
using Server.Data;
using Server.DTOs.Posts;
using Server.Models.Account;
using Server.Models.Community.Posts;

namespace Server.Services.SPosts
{
    public class PostService
    {

        private readonly APIDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
       
        private readonly string _RootImgPost;
        private readonly string _AccessImgPost;
        private readonly string _ServerHost;


        public PostService(APIDbContext context, IConfiguration configuration, UserManager<User> userManager)
        {
            this._context = context;
            _configuration = configuration;
            _userManager = userManager;

            var serverSettings = _configuration.GetSection("ServerSettings");
            _RootImgPost = serverSettings["RootImgPost"];
            _AccessImgPost = serverSettings["AccesImgPost"];
            _ServerHost = serverSettings["HostName"];
        }

        public async Task<PostResponse> CreatePost(string userId, CreatePostModel createPostModel, List<FileInfoDto> fileInfos)
        {
            var userModel = await _userManager.FindByIdAsync(userId);
            if (userModel == null) throw new Exception("Create-Account not exists");
            
            using var transaction = await _context.Database.BeginTransactionAsync();

            Post newPost = new Post()
            {
                AuthorId = userModel.Id,
                Content = createPostModel.Content,
                Status = createPostModel.Status,
                Type = createPostModel.Type,
            };
            await _context.Posts.AddAsync(newPost);
            await _context.SaveChangesAsync();

            var postId = newPost.Id;
            var listMediaModel = new List<PostMedia>();

            // Check forlder post
            var uploadsFolder = Path.Combine(_RootImgPost, postId.ToString());
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            for (int i = 0; i<fileInfos.Count; i++)
            {
                var fileInfo = fileInfos[i];
                var newMedia = new PostMedia()
                {
                    PostId = postId,
                    Type = fileInfo.Type,
                    MediaUrl = fileInfo.Name,
                    ContentType = fileInfo.ContentType,
                };
                // Add model
                listMediaModel.Add(newMedia);

                // copy file to folder
                try
                {
                    // destination folder
                    var filePath = Path.Combine(uploadsFolder, fileInfo.Name);

                    //// Lưu file tạm
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await fileInfo.File.CopyToAsync(stream);
                    }

                    //// Xóa file tạm (nếu cần)
                    var tempFilePath = fileInfo.File.FileName; // File tạm của hệ thống.
                    if (System.IO.File.Exists(tempFilePath))
                    {
                        System.IO.File.Delete(tempFilePath);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine( $"Copy media to folder post id '{postId.ToString()}': {ex.ToString()}");
                }               
            }

            await _context.AddRangeAsync(listMediaModel);
            await _context.SaveChangesAsync();

            // Commit Transaction
            await transaction.CommitAsync();

            newPost.Medias = listMediaModel;
           

            return new PostResponse(newPost);
        }
        

    }
}
