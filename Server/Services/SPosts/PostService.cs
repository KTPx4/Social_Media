using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Server.Data;
using Server.DTOs.Account;
using Server.DTOs.Admin;
using Server.DTOs.Posts;
using Server.DTOs.ReportDTO;
using Server.Models.Account;
using Server.Models.Community.Posts;
using Server.Models.Community.PostsUpdates;
using Server.Models.Community.PostUpdates;
using Server.Models.Reports;
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
        private readonly RoleManager<Role> _roleManager;
        private readonly string _AccessImgAccount;


        private readonly string _RootImgPost;
        private readonly string _AccessImgPost;
        private readonly string _ServerHost;
        private readonly int LIMIT_SIZE = 10;

        private readonly int LIMIT_COMMENT_SIZE = 10;
        private readonly int _PAGE_SIZE_SUGGEST_POST = 15;
        public PostService(APIDbContext context, IConfiguration configuration, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            this._context = context;
            _configuration = configuration;
            _userManager = userManager;
            this._roleManager = roleManager;

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

            var rs = new PostResponse(newPost, _ServerHost);
            rs.AuthorProfile = userModel.UserProfile;
            rs.AuthorImg = $"{_ServerHost}/{_AccessImgAccount}/{userModel.Id.ToString()}/{userModel.ImageUrl}";

            return rs;
        }
        public async Task<bool> ReportPost(string userId, string postId, ReportModel report)
        {
            // Kiểm tra xem bài viết có tồn tại không (chỉ khi report là Post)
  
            var postExists = await _context.Posts.AnyAsync(p => p.Id == report.TargetId);
            if (!postExists) throw new Exception("Post-Post not exists");
            Report newRp = new Report()
            {
                Reason = report.Reason,
                ReportType = report.ReportType,
                TargetId = report.TargetId,
                Status = Report.ReportStatus.Pending,
                TargetType = Report.TargetTypes.Post
            };
            await _context.Reports.AddAsync(newRp);
            await _context.SaveChangesAsync();

            UserNotify userNotify = new UserNotify()
            {
                UserId = new Guid(userId),
                TargetId = newRp.Id,
                Type = TypeNotify.Report,
                DestinationId = new Guid(postId),
                Content = "You have reported a post. Please update your report status regularly for more information!",
                InteractId = new Guid(userId)
            };
            await _context.UserNotifies.AddAsync(userNotify);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ReportResponse> GetReportPost(string userId, string reportId)
        {
            var rp = await _context.Reports.Where(r => r.Id.ToString() == reportId).FirstOrDefaultAsync();
            if (rp == null) throw new Exception("Post-Report not exists");
            return new ReportResponse(rp);
        }

        public async Task<PostResponse> SharePost(string userID, string postId, SharePostModel sharePostModel)
        {
            var post = await _context.Posts.Where(p => p.Id.ToString() == postId).FirstOrDefaultAsync();
            if (post == null) throw new Exception("Post-Post not exists");

            if(post.Status == Post.PostStatus.Private && post.AuthorId.ToString() != userID) throw new Exception("Post-You not allow to share this post");
            else if(post.Status == Post.PostStatus.Friend)
            {
                var relation = await _context.FriendShips
                    .Where(f => f.UserId.ToString() == userID && f.FriendId == post.AuthorId)
                    .FirstOrDefaultAsync();
                if(relation != null && (!relation.IsFriend || relation.Status != FriendStatus.Normal)) throw new Exception("Post-You not allow to share this post");
            }

            var sharePost = new Post()
            {
                AuthorId = new Guid(userID),
                Content = sharePostModel.Content,
                Status = sharePostModel.Status,
                PostShareId = post.Id,
                Type = Post.PostType.Share,
            };
            await _context.Posts.AddAsync(sharePost);
            await _context.SaveChangesAsync();
            return new PostResponse(sharePost, _ServerHost);

        }

        public async Task<PostResponse> DeletePost(string userId, string postId)
        {
            var post = await _context.Posts
                .Where(p => p.Id.ToString() == postId)
                .Include(p=>p.Medias)
                .FirstOrDefaultAsync();

            if (post == null) throw new Exception("Post-Post not exists");

            var user = await _userManager.FindByIdAsync(userId);
            var roles = await _userManager.GetRolesAsync(user);
            var canEdit = false;
            if (roles != null && (roles.Contains("admin") || roles.Contains("mod-post"))) canEdit = true;
            if (post.AuthorId.ToString() != userId && !canEdit) throw new Exception("Post-You not allow to delete");
            
            var listShare = await _context.Posts.Where(p => p.PostShareId == post.Id).ToListAsync();

            foreach (var p in listShare)
            {
                post.PostShareId = null;
            }

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

        public async Task<PostResponse> UpdatePost(string userId, string postId, UpdatePostModel updateModel, List<FileInfoDto> fileInfos)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) throw new Exception("Post-Your account not exists");
                var post = await _context.Posts
                    .Where(p => p.Id.ToString().Equals(postId))
                     .Include(p => p.Author)
                    .Include(p => p.Updates)
                    .Include(p => p.Medias)
                    .FirstOrDefaultAsync();

                if (post == null) throw new Exception("Post-Post not exists");
                if (post.AuthorId.ToString() != userId) throw new Exception("Post-You not allow to access");


                var uploadsFolder = Path.Combine(_RootImgPost, postId.ToString());
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var postUpdate = new PostUpdate()
                {
                    PostId = post.Id,
                    AuthorId = post.AuthorId,
                    Content = post.Content,
                    PostShareId = post.PostShareId,
                    IsHide = post.IsHide,
                    Status = post.Status,
                    Type = post.Type,
                };
                await _context.PostUpdates.AddAsync(postUpdate);
                await _context.SaveChangesAsync();

                post.Content = updateModel.Content;
                post.Status = updateModel.Status;

                // if share only update content
                if(post.Type == Post.PostType.Share)
                {
                    _context.Posts.Update(post);
                    await _context.SaveChangesAsync();
                    return new PostResponse(post, _ServerHost);
                }

                // create history for old version
                var rootPath = $"{_RootImgPost}/{postId}";
                var listMediaOld = new List<PostMediaUpdate>();

                //foreach(var m in updateModel.Medias)
                //{
                //    Console.WriteLine("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[id: " + m);

                //}

                foreach (var m in post.Medias)
                {
                    //Console.WriteLine("----------------------------- mediaid:" + m.Id.ToString() +"-isContain: " + updateModel.Medias.Contains(m.Id.ToString()));
                    var updateMedia = new PostMediaUpdate()
                    {
                        MediaId = m.Id,
                        PostUpdateId = postUpdate.Id,
                        Type = m.Type,
                        MediaUrl = m.MediaUrl,
                        Content = m.Content,
                        ContentType = m.ContentType,
                        IsDeleted = m.IsDeleted,
                    };
                    //delete media not has in list
                    if (!updateModel.Medias.Contains(m.Id.ToString()))
                    {
                        m.IsDeleted = true;
                        updateMedia.IsDeleted = true;
                        var filePath = $"{rootPath}/{m.MediaUrl}";

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }

                        post.Medias.Remove(m);
                    }

                    listMediaOld.Add(updateMedia);

                }
                await _context.PostMediaUpdates.AddRangeAsync(listMediaOld);
                await _context.SaveChangesAsync();


                // add new media
                var listMediaModel = new List<PostMedia>();

                for (int i = 0; i < fileInfos.Count; i++)
                {
                    var fileInfo = fileInfos[i];
                    var newMedia = new PostMedia()
                    {
                        PostId = post.Id,
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
                        Console.WriteLine($"Copy media to folder post id '{postId.ToString()}': {ex.ToString()}");
                    }
                }

                await _context.AddRangeAsync(listMediaModel);
                _context.Posts.Update(post);
                await _context.SaveChangesAsync();
            

                return new PostResponse(post, _ServerHost);
            }
            catch (Exception e)
            {
                throw e;
            }
            
        }

        public async Task<List<PostUpdateResponse>> GetHistory(string userId, string postId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("Post-User not exists");

            var post = await _context.Posts
                .Where(p => p.Id.ToString() == postId)
                .FirstOrDefaultAsync();

            if (post == null) throw new Exception("Post-Post not exists");

            if (post.Status != Post.PostStatus.Public && post.AuthorId.ToString() != userId)
            {
                if (post.Status == Post.PostStatus.Private) throw new Exception("Post-Can not access this post");
                else
                {
                    var relation = await _context.FriendShips.FirstOrDefaultAsync(r => r.UserId.ToString() == userId);
                    if (relation == null || !relation.IsFriend || relation.Status != FriendStatus.Normal) throw new Exception("Post-Can not access this post");
                }
            }


            var postUpdates = await _context.PostUpdates
               .Where(p => p.PostId.ToString() == postId)
               .OrderBy(p => p.CreatedAt)
               .Include(p => p.Author)
               .Include(p => p.Medias)
               .Include(p => p.OriginPost)
               .Select(p => new PostUpdateResponse(p, _ServerHost))
               .ToListAsync();


            return postUpdates;
        }

        public async Task<List<PostResponse>> SearchPost(string userId, string search)
        {
            var post = await _context.Posts
                .Where(p => p.Content.Contains(search))
                  .Include(p => p.Medias)
                .Include(p => p.Author)
                .Select(post => new PostResponse()
                {
                    Id = post.Id,
                    CreatedAt = post.CreatedAt,
                    AuthorId = post.AuthorId,
                    Content = post.Content,
                    PostShareId = post.PostShareId,
                    IsHide = post.IsHide,
                    Status = post.Status,
                    Type = post.Type,
                    AuthorImg = $"{_ServerHost}/public/account/{post.Author.Id.ToString()}/{post.Author.ImageUrl}",
                    AuthorProfile = post.Author.UserProfile,
                    SumComment = post.Comments.Count,
                    SumLike = post.Likes.Count,
                    ListMedia = post.Medias
                                .Select(m => new MediaResponse()
                                {
                                    Id = m.Id,
                                    Content = m.Content,
                                    ContentType = m.ContentType,
                                    IsDeleted = m.IsDeleted,
                                    MediaUrl = $"{_ServerHost}/api/file/src?id={m.Id.ToString()}&token=",
                                    PostId = m.PostId,
                                    Type = m.Type
                                })
                                .ToList(),
                    //PostShare = new PostResponse(post.PostShare, _ServerHost)
                })
                .ToListAsync();

            return post;
        }
        public async Task<List<PostResponse>> GetSuggestPost(string userId, int page)
        {
            if (page < 1) page = 1;
            var guidId = new Guid(userId);
            // Danh sách user mà userId đang follow
            var followingIds = _context.Follows
                                      .Where(f => f.FollowerId == guidId)
                                      .Select(f => f.UserId)
                                      .ToList();

            // Danh sách bạn bè
            var friendIds = await _context.FriendShips
                                   .Where(f => f.UserId == guidId && f.IsFriend && f.Status == FriendStatus.Normal)
                                   .Select(f =>  f.FriendId)
                                   .ToListAsync();

            // Truy vấn danh sách bài viết
            var listPost = await _context.Posts
                .Where(p =>
                    p.Status == Post.PostStatus.Public || // Bài viết công khai
                    (p.Status == Post.PostStatus.Friend && friendIds.Contains(p.AuthorId)) || // Bài viết từ bạn bè
                    (followingIds.Contains(p.AuthorId) && p.Status == Post.PostStatus.Public)// Bài viết từ người đang follow
                )
                .OrderByDescending(p => p.CreatedAt) // Sắp xếp theo ngày mới nhất
                .Skip((page - 1) * _PAGE_SIZE_SUGGEST_POST) // Bỏ qua các bài đã lấy ở trang trước
                .Take(_PAGE_SIZE_SUGGEST_POST) // Lấy số lượng bài viết theo trang
                .Include(p=> p.Medias)
                .Include(p=>p.Author)
                .Select(post => new PostResponse()
                {
                    Id = post.Id,
                    CreatedAt = post.CreatedAt,
                    AuthorId = post.AuthorId,
                    Content = post.Content,
                    PostShareId = post.PostShareId,
                    IsHide = post.IsHide,
                    Status = post.Status,
                    Type = post.Type,
                    AuthorImg = $"{_ServerHost}/public/account/{post.Author.Id.ToString()}/{post.Author.ImageUrl}",
                    AuthorProfile = post.Author.UserProfile,
                    SumComment = post.Comments.Count,
                    SumLike = post.Likes.Count,
                    ListMedia = post.Medias
                                .Select(m => new MediaResponse()
                                {
                                    Id = m.Id,
                                    Content = m.Content,
                                    ContentType = m.ContentType,
                                    IsDeleted = m.IsDeleted,
                                    MediaUrl = $"{_ServerHost}/api/file/src?id={m.Id.ToString()}&token=",
                                    PostId = m.PostId,
                                    Type = m.Type
                                })
                                .ToList(),
                    //PostShare = new PostResponse(post.PostShare, _ServerHost)
                })
                .ToListAsync();

            // Lấy danh sách ID các bài viết
            var postIds = listPost.Select(p => p.Id).ToList();

            // Lấy thông tin Like và Save một lần
            var postLikes = await _context.PostLikes
                .Where(l => postIds.Contains(l.PostId) && l.UserId.ToString() == userId)
                .ToListAsync();

            var postSaves = await _context.PostSaves
                .Where(s => postIds.Contains(s.PostId) && s.UserId.ToString() == userId)
                .ToListAsync();

            // Gán thông tin Like và Save
            foreach (var post in listPost)
            {
                post.isLike = postLikes.Any(l => l.PostId == post.Id);
                post.isSave = postSaves.Any(s => s.PostId == post.Id);
            }

            return listPost;

           
        }


        public async Task<PostResponse> GetById(string userId, string postId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user == null) throw new Exception("Post-User not exists");

            var post = await _context.Posts
                .Where(p => p.Id.ToString() == postId)
                .Include (p=>p.Author)
                .Include(p => p.Updates)
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

            var Save = await _context.PostSaves
                .Where(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId)
                .FirstOrDefaultAsync();

            var isLike = Like != null;
            var isSave = Save != null;
            post.isLike = isLike;
            post.isSave = isSave;
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
        public async Task<bool> SavePost(string userId, string postId)
        {
            var post = await GetById(userId, postId);

            var postSave = await _context.PostSaves.FirstOrDefaultAsync(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId);
            if (postSave == null)
            {
                postSave = new PostSave()
                {
                    PostId = post.Id,
                    UserId = new Guid(userId),
                };
                await _context.PostSaves.AddAsync(postSave);
                await _context.SaveChangesAsync();
            }
            return true;
        }
        public async Task<bool> UnSavePost(string userId, string postId)
        {
            var post = await GetById(userId, postId);

            var postSave = await _context.PostSaves.FirstOrDefaultAsync(l => l.PostId.ToString() == postId && l.UserId.ToString() == userId);

            if (postSave != null)
            {

                _context.PostSaves.Remove(postSave);
                await _context.SaveChangesAsync();
            }
            return true;
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
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                var post = await GetById(userId, postId);
                string replyid = commentModel.ReplyCommentId;

                var newComment = new PostComment()
                {
                    PostId = post.Id,
                    UserId = new Guid(userId),
                    Content = commentModel.Content
                };

                var notify = new UserNotify()
                {
                    Type = TypeNotify.Comment,
                    InteractId = new Guid(userId),
                    DestinationId = post.Id,
                };

                PostComment replyComment = null;

                if (!string.IsNullOrEmpty(replyid))
                {
                    replyComment = await _context.PostComments
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id.ToString() == replyid);

                    if (replyComment == null) throw new Exception("Post-Comment not exists");

                    newComment.ReplyCommentId = replyComment.Id;

                    if (replyComment.RootCommentId != null) // if this comment has root -> this comment in reply comment
                    {
                        newComment.RootCommentId = replyComment.RootCommentId;
                    }
                    else newComment.RootCommentId = replyComment.Id; // if this comment not have root -> this comment is root

                    //newComment.Content = $"@{replyComment.User.UserProfile} {newComment.Content}";
                    newComment.Content = $"{newComment.Content}";

                    // create notify to user has get reply
                    notify.UserId = replyComment.UserId; // notify for person has get reply
                    notify.Content = "reply your comment";

                    //........
                    // send socket refresh notify
                    // .......

                }
                else // new comment in post
                {
                    notify.UserId = post.AuthorId; // notify for author of post
                    notify.Content = "comment your post";
                }
               

                

                await _context.PostComments.AddAsync(newComment);
                await _context.SaveChangesAsync();
                
                notify.TargetId = newComment.Id;
                if (post.AuthorId.ToString() != userId || (replyComment != null && replyComment.UserId.ToString() != userId))
                {
                    await _context.UserNotifies.AddAsync(notify);
                }
                await _context.SaveChangesAsync();

                var rs = new CommentResponse(newComment);
                rs.UserProfile = user.UserProfile;
                rs.ImageUrl = $"{_ServerHost}/{_AccessImgAccount}/{user.Id.ToString()}/{user.ImageUrl}";
                rs.ReplyUserProfile = !string.IsNullOrEmpty(replyid)?  replyComment.User.UserProfile : "";
                return rs;
            }
            catch(Exception e)
            {
                throw e;
            }
          
        }

        public async Task<List<CommentResponse>> GetCommentPost(string userId, string postId, int page)
        {
            var post = await GetById(userId, postId);

            if (post == null) return new List<CommentResponse>();

            // Lấy các comment gốc
            var rootComments = await _context.PostComments
                .Where(c => c.PostId.ToString() == postId && c.RootCommentId == null)
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * LIMIT_COMMENT_SIZE)
                .Take(LIMIT_COMMENT_SIZE)
                .Include(c => c.User)
                .ToListAsync();

            var rootIds = rootComments.Select(c => c.Id).ToList();

            // Truy vấn dữ liệu cần thiết trước
            var replyCounts = await _context.PostComments
                .Where(c => rootIds.Contains(c.RootCommentId.Value))
                .GroupBy(c => c.RootCommentId)
                .Select(g => new { RootCommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.RootCommentId, g => g.Count);

            var likeCounts = await _context.CommentReactions
                .Where(cr => rootIds.Contains(cr.CommentId))
                .GroupBy(cr => cr.CommentId)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.CommentId, g => g.Count);

            var userLikes = await _context.CommentReactions
                .Where(cr => rootIds.Contains(cr.CommentId) && cr.UserId.ToString() == userId)
                .ToListAsync();

            // Tạo danh sách phản hồi
            var commentResponses = rootComments.Select(c => new CommentResponse
            {
                Id = c.Id,
                PostId = c.PostId,
                UserId = c.UserId,
                UserProfile = c.User.UserProfile,
                ImageUrl = $"{_ServerHost}/{_AccessImgAccount}/{c.UserId}/{c.User.ImageUrl}",
                ReplyCommentId = c.ReplyCommentId,
                RootCommentId = c.RootCommentId,
                ReplyUserProfile = "",
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                IsLike = userLikes.Any(l => l.CommentId == c.Id),
                CountReply = replyCounts.ContainsKey(c.Id) ? replyCounts[c.Id] : 0,
                CountLike = likeCounts.ContainsKey(c.Id) ? likeCounts[c.Id] : 0
            }).ToList();

            return commentResponses;
        }



        public async Task<List<CommentResponse>> GetReplyCommentPost(string userId, string postId, string replyId, int page)
        {
            var post = await GetById(userId, postId);

            if (post == null) return new List<CommentResponse>();

            // Lấy các comment trả lời
            var listComment = await _context.PostComments
                .Where(c => c.PostId.ToString() == postId && c.RootCommentId.ToString() == replyId)
                .OrderBy(c => c.CreatedAt)
                .Skip((page - 1) * LIMIT_COMMENT_SIZE)
                .Take(LIMIT_COMMENT_SIZE)
                .Include(c => c.User)
                .Include(c => c.ReplyComment)
                .ToListAsync();

            var commentIds = listComment.Select(c => c.Id).ToList();

            // Truy vấn dữ liệu cần thiết
            var likeCounts = await _context.CommentReactions
                .Where(cr => commentIds.Contains(cr.CommentId))
                .GroupBy(cr => cr.CommentId)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.CommentId, g => g.Count);

            var userLikes = await _context.CommentReactions
                .Where(cr => commentIds.Contains(cr.CommentId) && cr.UserId.ToString() == userId)
                .ToListAsync();

            // Tạo danh sách phản hồi
            var commentResponses = listComment.Select(c => new CommentResponse
            {
                Id = c.Id,
                PostId = c.PostId,
                UserId = c.UserId,
                UserProfile = c.User.UserProfile,
                ImageUrl = $"{_ServerHost}/{_AccessImgAccount}/{c.UserId}/{c.User.ImageUrl}",
                ReplyCommentId = c.ReplyCommentId,
                RootCommentId = c.RootCommentId,
                ReplyUserProfile = c.ReplyComment?.User?.UserProfile,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                IsLike = userLikes.Any(l => l.CommentId == c.Id),
                CountReply = 0, // Nếu cần tính số lượng trả lời, bổ sung logic
                CountLike = likeCounts.ContainsKey(c.Id) ? likeCounts[c.Id] : 0
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
           
            var react = await _context.CommentReactions.Where(r => r.CommentId.ToString() == commentId && r.UserId.ToString() == userId).FirstOrDefaultAsync();
            if (react != null) return true;

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
