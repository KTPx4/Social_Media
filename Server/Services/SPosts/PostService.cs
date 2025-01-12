using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Account;
using Server.DTOs.Posts;
using Server.Models.Account;
using Server.Models.Community.Posts;
using System.Drawing.Printing;
using static Server.Models.Account.UserNotify;
using static Server.Models.RelationShip.FriendShip;

namespace Server.Services.SPosts
{
    public class PostService
    {

        private readonly APIDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        private readonly string _AccessImgAccount;


        private readonly string _RootImgPost;
        private readonly string _AccessImgPost;
        private readonly string _ServerHost;
        private readonly int LIMIT_SIZE = 10;

        private readonly int LIMIT_COMMENT_SIZE = 20;

        public PostService(APIDbContext context, IConfiguration configuration, UserManager<User> userManager)
        {
            this._context = context;
            _configuration = configuration;
            _userManager = userManager;

            var serverSettings = _configuration.GetSection("ServerSettings");
            _RootImgPost = serverSettings["RootImgPost"];
            _AccessImgPost = serverSettings["AccesImgPost"];
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];
        }
        private static async Task DeleteDirectoryAsync(string path)
        {
            if (Directory.Exists(path))
            {
                await Task.Run(() =>
                {
                    Directory.Delete(path, true);
                });
                Console.WriteLine($"Delete post: '{path}'");
            }
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
           

            return new PostResponse(newPost, _ServerHost);
        }

        public async Task<PostResponse> DeletePost(string userId, string postId)
        {
            var post = await _context.Posts
                .Where(p => p.Id.ToString() == postId)
                .Include(p=>p.Medias)
                .FirstOrDefaultAsync();

            if (post == null) throw new Exception("Post-Post not exists");
            if (post.AuthorId.ToString() != userId) throw new Exception("Post-You not allow to delete");

            //var listMedia = await _context.PostMedias.Where(m => m.PostId.ToString() == postId).ToListAsync();
            var rootPath = $"{_RootImgPost}/{postId}";
            // delete img
            //foreach (var media in listMedia)
            //{
            //    var filePath = $"{rootPath}/{media.MediaUrl}";
            //    if (System.IO.File.Exists(filePath)) 
            //    {
            //        System.IO.File.Delete(filePath);
            //    }
            //}

            await DeleteDirectoryAsync(rootPath);
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return new PostResponse(post, _ServerHost);
        }

        public async Task<List<PostResponse>> GetAllMyPost(string userId, int page)
        {
            var user= await _userManager.FindByIdAsync(userId);

            if (user == null) return null;
            try
            {
                var listPost = await _context.Posts
                    .Where(p => p.AuthorId.ToString() == userId)
                    .Include(p=>p.Medias)
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip( (page-1)*LIMIT_SIZE )
                    .Take(LIMIT_SIZE)
                    .Select(p => new PostResponse(p, _ServerHost))            
                    .ToListAsync();
                
                foreach (var post in listPost) 
                {
                    post.SumLike = await _context.PostLikes.CountAsync(l => l.PostId == post.Id);
                    post.SumComment = await _context.PostComments.CountAsync(c => c.PostId == post.Id);
                }
                return listPost;

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return null;
        }

        public async Task<PostResponse> GetById(string userId, string postId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user == null) throw new Exception("Post-User not exists");

            var post = await _context.Posts
                .Where(p => p.Id.ToString() == postId)
                .Include (p=>p.Author)
                .Include(p => p.Medias)
                 .Select(p => new PostResponse(p, _ServerHost))
                 .FirstOrDefaultAsync();                                                                            
            
            if (post == null) throw new Exception("Post-Post not exists");
            if(post.Status != Post.PostStatus.Public && post.AuthorId.ToString() != userId)
            {
                if (post.Status == Post.PostStatus.Private) throw new Exception("Post-Can not access this post");
                else
                {
                    var relation = await _context.FriendShips.FirstOrDefaultAsync(r => r.UserId.ToString() == userId);
                    if (relation == null || !relation.IsFriend || relation.Status != FriendStatus.Normal) throw new Exception("Post-Can not access this post");
                }
            }
            var Like = await _context.PostLikes
                .Where(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId)
                .FirstOrDefaultAsync();
            var isLike = Like != null;
            post.isLike = isLike;
            post.SumLike = await _context.PostLikes.CountAsync(l => l.PostId.ToString() == postId);
            post.SumComment = await _context.PostComments.CountAsync(c => c.PostId.ToString() == postId);
        
            return post;
        }

        public async Task<List<UserResponse>> GetLike(string userId, string postId)
        {
            var post = await GetById(userId, postId);

            var lusers = await _context.PostLikes
                .Where(l => l.PostId.ToString() == postId)
                .OrderBy(l => l.CreatedAt)
                .Include(l => l.User)
                .ToListAsync();

            var rs = lusers.Select(like => new UserResponse()
            {
                Id = like.User.Id,
                UserProfile = like.User.UserProfile,
                Name = like.User.Name,
                ImageUrl = $"{_ServerHost}/{_AccessImgAccount}/{like.User.Id.ToString()}/{like.User.ImageUrl}"
            }).ToList();

            
            return rs;
        }

        public async Task<bool> LikePost(string userId, string postId)
        {
            var post = await GetById(userId, postId);

            var postLike = await _context.PostLikes.FirstOrDefaultAsync(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId);
            if(postLike == null)
            {
                postLike = new PostLike()
                {
                    PostId = post.Id,
                    UserId = new Guid(userId),
                };
                await _context.PostLikes.AddAsync(postLike);
                await _context.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> UnLikePost(string userId, string postId)
        {
            var post = await GetById(userId, postId);

            var postLike = await _context.PostLikes.FirstOrDefaultAsync(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId);
            if (postLike != null)
            {
                
                _context.PostLikes.Remove(postLike);
                await _context.SaveChangesAsync();
            }
            return true;
        }

        public async Task<CommentResponse> CommentPost(string userId, string postId, CommentModel commentModel)
        {
            var post = await GetById(userId, postId);
            string replyid = commentModel.ReplyCommentId;
            
            var newComment = new PostComment()
            {
                PostId = post.Id,
                UserId = new Guid(userId),
                Content = commentModel.Content
            };
            
            if(!string.IsNullOrEmpty(replyid))
            {
                var replyComment = await _context.PostComments.FirstOrDefaultAsync(c => c.Id.ToString() == replyid);
                
                if (replyComment == null) throw new Exception("Post-Comment not exists");
                
                newComment.ReplyCommentId = replyComment.Id;
                
                if(replyComment.RootCommentId != null) // if this comment has root -> this comment in reply comment
                {
                    newComment.RootCommentId = replyComment.RootCommentId;
                }
                else newComment.RootCommentId = replyComment.Id; // if this comment not have root -> this comment is root

                newComment.Content = $"@{replyComment.User.UserProfile} {newComment.Content}";

                // create notify to user 
                var user = await _userManager.FindByIdAsync(userId);
                var notify = new UserNotify()
                {
                    TargetId = newComment.Id,
                    UserId = user.Id,
                    Type = TypeNotify.Comment,
                    ImageUrl = user.ImageUrl
                };

                await _context.UserNotifies.AddAsync(notify);

                //........
                // send socket refresh notify
                // .......

            }
            else // new comment in post
            {}

            await _context.PostComments.AddAsync(newComment);
            await _context.SaveChangesAsync();
            var rs = new CommentResponse(newComment);

            return rs;
        }
          
        public async Task<List<CommentResponse>> GetCommentPost(string userId, string postId, int page)
        {
            var post = await GetById(userId, postId);

            // get comment desc without root comment
            var rootComments = await _context.PostComments
                .Where(c => c.PostId.ToString() == postId && c.RootCommentId == null)
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * LIMIT_COMMENT_SIZE)
                .Take(LIMIT_COMMENT_SIZE)
                .ToListAsync();

            var rootIds = rootComments.Select(c => c.Id).ToList();
            
            // get reply comment in root comment
            var replyCounts = await _context.PostComments
                .Where(c => rootIds.Contains(c.RootCommentId.Value))
                .GroupBy(c => c.RootCommentId)
                .Select(g => new { RootCommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.RootCommentId, g => g.Count);

            // get like of each comment
            var likeCounts = await _context.CommentReactions
                .Where(cr => rootIds.Contains(cr.CommentId) )
                .GroupBy(cr => cr.CommentId)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.CommentId, g => g.Count);


     
            var commentResponses = rootComments.Select(c => new CommentResponse
            {
                Id = c.Id,
                PostId = c.PostId,
                UserId = c.UserId,
                ReplyCommentId = c.ReplyCommentId,
                RootCommentId = c.RootCommentId,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                CountReply = replyCounts.ContainsKey(c.Id) ? replyCounts[c.Id] : 0, // Số lượng trả lời
                CountLike = likeCounts.ContainsKey(c.Id) ? likeCounts[c.Id] : 0 // Số lượng like
            }).ToList();

            return commentResponses;
        }

        public async Task<List<CommentResponse>> GetReplyCommentPost(string userId, string postId, string replyId,  int page)
        {
            var post = await GetById(userId, postId);

            // get comment desc without root comment
            var listComment = await _context.PostComments
                .Where(c => c.PostId.ToString() == postId && c.RootCommentId.ToString() == replyId)
                .OrderBy(c => c.CreatedAt)
                .Skip((page - 1) * LIMIT_COMMENT_SIZE)
                .Take(LIMIT_COMMENT_SIZE)
                .ToListAsync();

            var rootIds = listComment.Select(c => c.Id).ToList();

            // get like of each comment
            var likeCounts = await _context.CommentReactions
                .Where(cr => rootIds.Contains(cr.CommentId))
                .GroupBy(cr => cr.CommentId)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.CommentId, g => g.Count);


            var commentResponses = listComment.Select(c => new CommentResponse
            {
                Id = c.Id,
                PostId = c.PostId,
                UserId = c.UserId,
                ReplyCommentId = c.ReplyCommentId,
                RootCommentId = c.RootCommentId,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                CountReply =   0, // count reply comment
                CountLike = likeCounts.ContainsKey(c.Id) ? likeCounts[c.Id] : 0 // Số lượng like

            }).ToList();

            return commentResponses;
        }

        public async Task<bool> DeleteComment(string userId, string commentId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var comment = await _context.PostComments
                .Where(c => c.Id.ToString() == commentId)
                .FirstOrDefaultAsync();

            if (comment == null) throw new Exception("Post-Comment not exists");
            
            if (comment.UserId.ToString() != userId) throw new Exception("Post-You not allow to delete");

            // delete sub comment in comment
            var listSubComment = await _context.PostComments
                .Where(c => c.RootCommentId.ToString() == commentId)
                .ToListAsync();

            if (listSubComment != null && listSubComment.Count > 0) 
            {
                // foreach (var subComment in listSubComment)
                //{
                //    var react = await _context.CommentReactions.Where(c => c.CommentId == subComment.Id).FirstOrDefaultAsync();
                //    if(react != null)
                //       _context.CommentReactions.Remove(react);
                //}
                _context.PostComments.RemoveRange(listSubComment);
            }

            _context.PostComments.Remove(comment);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LikeComment(string userId, string commentId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("Post-User not exists");
            var comment = await _context.PostComments.Where(c => c.Id.ToString().Equals(commentId)).FirstOrDefaultAsync();
            if (comment == null) throw new Exception("Post-Comment is not exists");
            var newReact = new CommentReaction()
            {
                CommentId = comment.Id,
                UserId = new Guid(userId),
                React = "Like"
            };
            await _context.CommentReactions.AddAsync(newReact);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UnLikeComment(string userId, string commentId)
        {
            var user = await _userManager.FindByIdAsync(userId);            
            if (user == null) throw new Exception("Post-User not exists");
            
            var react = await _context.CommentReactions.Where(r => r.CommentId.ToString() == commentId && r.UserId.ToString() == userId).FirstOrDefaultAsync();
            if(react != null)
            {
                _context.CommentReactions.Remove(react);
                await _context.SaveChangesAsync();
            }

            return true;
        }
    }
}
