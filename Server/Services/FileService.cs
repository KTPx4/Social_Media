using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models.Account;
using static Server.Models.Community.Posts.Post;
using static Server.Models.RelationShip.FriendShip;

namespace Server.Services
{
    public class FileService
    {
        private readonly APIDbContext _context;
  
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly string _RootImgAccount;
        private readonly string _AccessAccImgHost;

        private readonly string _RootImgPost;
        private readonly string _AccessImgPost;
        private readonly string _ServerHost;

        public FileService(APIDbContext context, IConfiguration configuration, UserManager<User> userManager)
        {
            _context = context;
            _configuration = configuration;

            var serverSettings = _configuration.GetSection("ServerSettings");
            _RootImgAccount = serverSettings["RootImgAccount"];
            _AccessAccImgHost = serverSettings["AccessImgHost"];

            _RootImgPost = serverSettings["RootImgPost"];
            _AccessImgPost = serverSettings["AccesImgPost"];
            _ServerHost = serverSettings["HostName"];
            _userManager = userManager;
        }

        public async Task<Dictionary<string, string>> GetPathMedia(string userId, string mediaId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("File-User not exists");
           
            var media = 
                await _context.PostMedias
                .Include(m => m.Post)
                .Include(p => p.Post.Author)
                .FirstOrDefaultAsync(m => m.Id.ToString() == mediaId);

            if (media == null) throw new Exception("File-Media not exists");
            
            var post = media.Post;
            
            if (post == null) throw new Exception("File-Can not load media");
            
            var author = post.Author;
            // check relation ship author and userid - if block or blocked by => not access
            var relationship = await _context.FriendShips.FirstOrDefaultAsync(f => f.UserId  == author.Id && f.FriendId.ToString() == userId);
            
            if(relationship != null && relationship.Status != FriendStatus.Normal) throw new Exception("File-Can not access this media");
           
            // check post status
            if (post.Status == PostStatus.Private && post.AuthorId.ToString() != userId) throw new Exception("File-Can not access this media");
            else if
            (
                post.Status == PostStatus.Friend && 
                post.AuthorId.ToString() != userId && 
                (relationship == null || !relationship.IsFriend) // not friend or not has relationship
            ) throw new Exception("File-Can not access this media");
            
            else
            {
                string path = $"post/{post.Id.ToString()}/{media.MediaUrl}";
                var rs = new Dictionary<string, string>()
                {
                    {"path" , path },
                    {"contentType", media.ContentType }
                };
                return rs;
            }


        }

        public async Task<Dictionary<string, string>> GetPathMediaConversation(string userId, string mediaId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("File-User not exists");

            var conversation = await _context.Conversations
                .Where(c => c.Id.ToString() == mediaId)
                .Include(c => c.Members)
                .FirstOrDefaultAsync();


            if (conversation == null) throw new Exception("File-Conversation not exists");

            var Members = conversation.Members;
            
             
             
            // check post status
            if (!Members.Select(m => m.UserId.ToString()).Contains(userId)) throw new Exception("File-Can not access this media");
            else
            {
                string path = $"group/{conversation.Id.ToString()}/{conversation.ImageUrl}";
                var rs = new Dictionary<string, string>()
                {
                    {"path" , path },
                    {"contentType", "image/jpeg" }
                };
                return rs;
            }


        }
        public async Task<Dictionary<string, string>> GetPathMediaMessage(string userId, string mediaId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("File-User not exists");

            var message = await _context.Messages
                .Where(c => c.Id.ToString() == mediaId)
                .Include(c => c.Conversation)
                .ThenInclude(c =>c.Members)
                .FirstOrDefaultAsync();


            if (message == null) throw new Exception("File-Media or file not exists");
            var conv = message.Conversation;
            var Members = conv.Members;
            var type = message.Type switch
            {
                Models.Communication.Message.MessageType.Image => "image/jpeg",
                Models.Communication.Message.MessageType.Video => "video/mp4",
                Models.Communication.Message.MessageType.File => GetContentType(message.Content),
                _ => "application/octet-stream"
            };

            // check post status
            if (!Members.Select(m => m.UserId.ToString()).Contains(userId)) throw new Exception("File-Can not access this media");
            else
            {
                string path = $"group/{conv.Id.ToString()}/{message.Id.ToString()}/{message.Content}";
                var rs = new Dictionary<string, string>()
                {
                    {"path" , path },
                    {"contentType", type}
                };
                return rs;
            }


        }
        private string GetContentType(string fileName)
        {
            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (provider.TryGetContentType(fileName, out var contentType))
            {
                return contentType;
            }
            return "application/octet-stream"; // Nếu không xác định được, trả về default binary file
        }
    }
}
