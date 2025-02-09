using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Server.Data;
using Server.DTOs.Account;
using Server.DTOs.Notify;
using Server.DTOs.Posts;
using Server.Models.Account;
using Server.Models.Community.Posts;
using Server.Models.RelationShip;
using System.Linq;
using System.Security.Claims;

namespace Server.Services
{
    public class UserService
    {
        private readonly APIDbContext context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;

        private readonly string _AccessImgAccount;
        private readonly string _ServerHost;
        private readonly string _PublicUrl;
        private readonly int LIMIT_PAGE_POST = 5;


        public UserService(APIDbContext context, RoleManager<Role> roleManager, UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            this.context = context;
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._configuration = configuration;
            this._roleManager = roleManager;

            var serverSettings = _configuration.GetSection("ServerSettings");
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];
            _PublicUrl = $"{_ServerHost}/{_AccessImgAccount}";
        }

        public async Task<List<PostResponse>> GetPostsByProfile(string userId, string userProfile, int page)
        {
            if (page < 1) page = 1;

            var myAccount = _userManager.FindByIdAsync(userId);
            if (myAccount == null) throw new Exception("Account-Your account not exists");
            
            var profile = await context.Users
             .Where(u => u.UserProfile.ToLower().Trim() == userProfile.ToLower().Trim())
             .FirstOrDefaultAsync();
           
            if(profile == null) throw new Exception("Account-Account not exists or user profile has been changed");
            
            var relation = await context.FriendShips
               .Where(f => f.UserId.ToString() == userId && f.FriendId == profile.Id)
               .FirstOrDefaultAsync();

            if (relation != null && relation.Status != FriendShip.FriendStatus.Normal)
            {
                throw new Exception("Account-You not allow to view this profile");
            }

            var listPost = await context.Posts
                .Where(p => p.AuthorId == profile.Id)
                .OrderByDescending(p => p.CreatedAt) // Sắp xếp bài viết theo ngày đăng mới nhất
                .Skip((page - 1) * LIMIT_PAGE_POST)
                .Take(LIMIT_PAGE_POST)
                .Include(p => p.Medias)
                //.Include(p => p.PostShare)
                //.ThenInclude(s => s.Medias)
                .Select(post => new PostResponse
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
            var postLikes = await context.PostLikes
                .Where(l => postIds.Contains(l.PostId) && l.UserId.ToString() == userId)
                .ToListAsync();

            var postSaves = await context.PostSaves
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
        public async Task<List<PostResponse>> GetSavesByProfile(string userId, string userProfile, int page)
        {
            if (page < 1) page = 1;

            var myAccount = _userManager.FindByIdAsync(userId);
            if (myAccount == null) throw new Exception("Account-Your account not exists");

            var profile = await context.Users
             .Where(u => u.UserProfile.ToLower().Trim() == userProfile.ToLower().Trim())
             .FirstOrDefaultAsync();

            if (profile == null) throw new Exception("Account-Account not exists or user profile has been changed");

            var relation = await context.FriendShips
               .Where(f => f.UserId.ToString() == userId && f.FriendId == profile.Id)
               .FirstOrDefaultAsync();

            if (relation != null && relation.Status != FriendShip.FriendStatus.Normal)
            {
                throw new Exception("Account-You not allow to view this profile");
            }
            var listPost = await context.PostSaves
                .Where(p => p.UserId == profile.Id)
                .Include(p => p.Post)
                //.ThenInclude(p => p.PostShare)
                //.ThenInclude(s => s.Medias)
                .OrderByDescending(p => p.Post.CreatedAt) // Sắp xếp bài viết theo ngày đăng mới nhất
                .Skip((page - 1) * LIMIT_PAGE_POST)
                .Take(LIMIT_PAGE_POST)
                .Include(p => p.Post.Medias)
                .Include(p => p.Post.Author)
                .Select(post => new PostResponse
                {
                    Id = post.Post.Id,
                    CreatedAt = post.Post.CreatedAt,
                    AuthorId = post.Post.AuthorId,
                    Content = post.Post.Content,
                    PostShareId = post.Post.PostShareId,
                    IsHide = post.Post.IsHide,
                    Status = post.Post.Status,
                    Type = post.Post.Type,
                    AuthorImg = $"{_ServerHost}/public/account/{post.Post.Author.Id.ToString()}/{post.Post.Author.ImageUrl}",
                    AuthorProfile = post.Post.Author.UserProfile,
                    SumComment = post.Post.Comments.Count,
                    SumLike = post.Post.Likes.Count,
                    ListMedia = post.Post.Medias
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
                    //PostShare = new PostResponse(post.Post.PostShare, _ServerHost)

                })
                .ToListAsync();

                // Lấy danh sách ID các bài viết
                var postIds = listPost.Select(p => p.Id).ToList();

                // Lấy thông tin Like và Save một lần
                var postLikes = await context.PostLikes
                    .Where(l => postIds.Contains(l.PostId) && l.UserId.ToString() == userId)
                    .ToListAsync();

                var postSaves = await context.PostSaves
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

        public async Task<UserResponse> FindByUserProfile(string userId, string userProfile)
        {
            var myAccount = _userManager.FindByIdAsync(userId);
            if (myAccount == null) throw new Exception("Account-Your account not exists");

            var profile = await context.Users
             .Where(u => u.UserProfile.ToLower().Trim() == userProfile.ToLower().Trim())
             .Include(u => u.Followers)
             .Select(u => new UserResponse
             {
                 Id = u.Id,
                 UserName = u.UserName,
                 UserProfile = u.UserProfile,
                 Bio = u.Bio,
                 Name = u.Name,
                 Gender = u.Gender,
                 Email = u.Email,
                 Phone = u.Phone,
                 ImageUrl = $"{_PublicUrl}/{u.Id}/{u.ImageUrl}",
                 IsDeleted = u.IsDeleted,
                 CreatedAt = u.CreatedAt ,  
                 isFollow = u.Followers.Any(f => f.FollowerId.ToString() == userId),
                 // Đếm Followers, Followings và Posts
                 CountFollowers = u.Followers.Count(),
                 CountFollowings = u.Following.Count(),
                 CountPosts = u.MyPosts.Count(),

                 // Lấy 5 bài viết mới nhất
                 Posts = u.MyPosts
                     .OrderByDescending(p => p.CreatedAt) // Sắp xếp bài viết theo ngày đăng mới nhất
                     .Take(LIMIT_PAGE_POST)
                     .Select(p => new PostResponse(p , _ServerHost))
                     .ToList()
             })
             .FirstOrDefaultAsync();


            if (profile == null) return null;

            var relation = await context.FriendShips
                .Where(f => f.UserId.ToString() == userId && f.FriendId == profile.Id)
                .FirstOrDefaultAsync();

            if(relation != null && relation.Status != FriendShip.FriendStatus.Normal)
            {
                throw new Exception("Account-You not allow to view this profile");
            }

            profile.isFriend = relation?.IsFriend ?? false;
            profile.FriendStatus = relation?.Status ?? FriendShip.FriendStatus.Normal;
            profile.FriendType = relation?.Type ?? FriendShip.FriendType.None;


            var postIds = profile.Posts.Select(p => p.Id).ToList();

            // Lấy thông tin Like, Save, và tổng Like/Comment cho tất cả bài viết
            var postLikes = await context.PostLikes
                .Where(l => postIds.Contains(l.PostId) && l.UserId.ToString() == userId)
                .ToListAsync();

            var postSaves = await context.PostSaves
                .Where(s => postIds.Contains(s.PostId) && s.UserId.ToString() == userId)
                .ToListAsync();

            var likeCounts = await context.PostLikes
                .Where(l => postIds.Contains(l.PostId))
                .GroupBy(l => l.PostId)
                .Select(g => new { PostId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.PostId, g => g.Count);

            var commentCounts = await context.PostComments
                .Where(c => postIds.Contains(c.PostId))
                .GroupBy(c => c.PostId)
                .Select(g => new { PostId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.PostId, g => g.Count);

            // Gán giá trị vào từng bài viết
            foreach (var post in profile.Posts)
            {
                post.isLike = postLikes.Any(l => l.PostId == post.Id);
                post.isSave = postSaves.Any(s => s.PostId == post.Id);

                // Gán số lượng Like và Comment (nếu không có, mặc định là 0)
                post.SumLike = likeCounts.ContainsKey(post.Id) ? likeCounts[post.Id] : 0;
                post.SumComment = commentCounts.ContainsKey(post.Id) ? commentCounts[post.Id] : 0;
            }


            return profile;
        }
        public async Task<User?> ResetPassword(string userName, string token, string newPPassword)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(newPPassword) || string.IsNullOrEmpty(token)) return null;

            var user = await _userManager.FindByNameAsync(userName);
            
            if (user == null) return null;

            var result  = await _userManager.ResetPasswordAsync(user, token, newPPassword);
           
            if(result.Succeeded)
            {
                return user;
            }
            else
            {
                foreach (IdentityError i in result.Errors)
                {
                    Console.WriteLine("ChangePassword: " + i.Description);
                }
                throw new Exception("Error");
            }

        }


        // Kiểm tra đăng nhập (username và password)
        public async Task<UserResponse?> ValidateLoginAsync(string username, string password)
        {
            // Tìm user theo username
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return null;

            // Xác minh mật khẩu với BCrypt
            //if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            //{
            //    return null; // Sai mật khẩu
            //}

            return new UserResponse(user); // Đăng nhập thành công
        }

        public async Task<UserResponse?> ValidateLoginAsyncV2(string username, string password)
        {
            // Tìm user theo username
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return null;

            if (await _userManager.CheckPasswordAsync(user, password))
            {
                var roles = await _userManager.GetRolesAsync(user);
                var ruser = new UserResponse(user);
                ruser.UserRoles = roles;
                return ruser;
            }

           
            return null;
           
 
        }

        public async Task<UserResponse?> RegisterAsync(String username, String password, String email)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (existsUser != null) return null;

            var passHash = BCrypt.Net.BCrypt.HashPassword(password);
            Models.Account.User user = new Models.Account.User()
            {
                UserName = username ,
                UserProfile = username,
                Name = username,
                Email = email,
                ImageUrl = "default.jpg"
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            UserResponse response = new UserResponse(user);
            return response;

        }

        public async Task<UserResponse?> RegisterV2(String username, String password, String email)
        {
            var existsUser = await _userManager.FindByNameAsync(username);
            if (existsUser != null) return null;

         
            Models.Account.User user = new Models.Account.User()
            {
                UserName = username,               
                UserProfile = username,
                Name = username,
                Email = email,
                ImageUrl = "default.jpg"
            };

            var rs = await _userManager.CreateAsync(user, password);
            if (!rs.Succeeded)
            {
                // Ghi log lỗi để dễ dàng debug
                foreach (var error in rs.Errors)
                {
                    Console.WriteLine($"ERR UserManager: {error.Code} - {error.Description}");
                }
                throw new Exception(rs.Errors.ToString());
            }

            user = await _userManager.FindByNameAsync(username);
            var roles = await _userManager.GetRolesAsync(user);
            
            UserResponse ruser = new UserResponse(user);
            ruser.UserRoles = roles;
 
            return ruser;
        }
        public async Task<UserResponse?> CreateAdmin(String username, String password, String email, string role)
        {
            var existsUser = await _userManager.FindByNameAsync(username);
            if (existsUser != null) return null;


            Models.Account.User user = new Models.Account.User()
            {
                UserName = username,
                UserProfile = username,
                Name = username,
                Email = email,
                ImageUrl = "default.jpg"
            };

            var rs = await _userManager.CreateAsync(user, password);
            if (!rs.Succeeded)
            {
                // Ghi log lỗi để dễ dàng debug
                foreach (var error in rs.Errors)
                {
                    Console.WriteLine($"ERR UserManager: {error.Code} - {error.Description}");
                }
                throw new Exception(rs.Errors.ToString());
            }

            user = await _userManager.FindByNameAsync(username);
            
            // create role
            if(!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new Role(role));
            }
           
            // add role
            await _userManager.AddToRoleAsync(user, role);

            
            var roles = await _userManager.GetRolesAsync(user);


            UserResponse ruser = new UserResponse(user);
            ruser.UserRoles = roles;

            return ruser;
        }

        public async Task<UserResponse?> FindByUserName(String username)
        {
            var existsUser = await _userManager.FindByNameAsync(username);
            return existsUser == null ? null : new UserResponse(existsUser);
        }

        public async Task<UserResponse?> FindById(String id)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString().Equals(id));
            return existsUser == null ? null : new UserResponse(existsUser);
        }

        public async Task<string?> SendResetPassword(string username, string newPass)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return ""; 

            string token = await _userManager.GeneratePasswordResetTokenAsync(user);

            Console.WriteLine(token);
            return token;
        }

        public async Task<UserResponse?> ValidResetPassword(string username, string token, string newPass)
        {

 
            try
            {
                var user = await ResetPassword(username, token, newPass);
                UserResponse rs = new UserResponse(user);
                var roles = await _userManager.GetRolesAsync(user);
                rs.UserRoles = roles;
                
                
                return rs;

            }
            catch (Exception ex) {
                var err = ex;
                Console.WriteLine(ex.Message);
                return null;
            }
            // Tạo token đặt lại mật khẩu
           
        }


        public async Task<UserResponse?> ValidToken(ClaimsPrincipal principal)
        {
            if (principal == null) return null;

            // Token hợp lệ, lấy thông tin từ claims
            var userId = principal.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(userId)) return null;

            return await FindById(userId);

        }

        public async Task<UserResponse?> UpdateAsync(string userId, UpdateModel updateModel)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u =>
                u.Id.ToString() != userId && (
                u.UserName.ToLower() == updateModel.UserName.ToLower() || u.UserProfile.ToLower() == updateModel.UserProfile.ToLower()
            ));

            if (existsUser != null)
            {
                var mess = $"Exists-Exists:" +
                    $"{(existsUser.UserName.ToLower() == updateModel.UserName.ToLower() ? "'UserName'" : "")}" +
                    $"{(existsUser.UserProfile.ToLower() == updateModel.UserProfile.ToLower() ? " 'UserProfile'" : "")}";
                throw new Exception(mess);
            }

            var userModel = await _userManager.FindByIdAsync(userId);
            userModel.UserName = updateModel.UserName;
            userModel.UserProfile = updateModel.UserProfile;
            userModel.Bio = updateModel.Bio;
            userModel.Phone = updateModel.Phone;
            userModel.Email = updateModel.Email;
            userModel.Gender = updateModel.Gender;
            userModel.Name = updateModel.Name;

            await _userManager.UpdateAsync(userModel);

            return new UserResponse(userModel);
        }

        public async Task<UserResponse?> UpdateAvatarAsync(string userId, string pathUser, string newfileName)
        {
            var userModel = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (userModel == null) return null;

            var oldImg = Path.Combine(pathUser, userModel.ImageUrl);

            if (System.IO.File.Exists(oldImg))
            {
                System.IO.File.Delete(oldImg);
            }
            userModel.ImageUrl = newfileName;
            await context.SaveChangesAsync();
            return new UserResponse(userModel);

        }
   
        public async Task<UserResponse?> ChangePass(string userId, ChangePassModel changePassModel)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var rs = await _userManager.ChangePasswordAsync(user, changePassModel.OldPass, changePassModel.NewPass);
            
            if (rs.Succeeded) 
            {
                return new UserResponse(user);
            }
            else
            {
                foreach (IdentityError i in rs.Errors)
                {
                    Console.WriteLine("ChangePassword: " + i.Description);
                    throw new Exception(i.Description);
                }
                return null;
            }
        }

        public async Task<UserResponse> GetMyInfo(string userId)
        {
            var rs = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            
            if (rs != null)
            {
                var res = new UserResponse(rs, _ServerHost, $"{_ServerHost}/{_AccessImgAccount}");
                var notifies = await context.UserNotifies.Where(n => n.UserId == rs.Id && n.IsSeen == false).CountAsync();
                res.CountNotifies = notifies;
                return res;
            }
            return null;
        }


        public async Task<List<NotifyResponse>> GetNotifies(string userId, int page = 1)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) throw new Exception("Account-Your account not exists");

            var notifies = await context.UserNotifies
                .Where(n => n.UserId.ToString() == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Include(n => n.Interact)
                .Select(n => new NotifyResponse(n, _PublicUrl))
                .ToListAsync();

             
            
            return notifies;

        }

        public async Task<bool> FollowUser(string userId, string profileId)
        {
            var profile = await _userManager.FindByIdAsync(profileId);
            if (profile == null) throw new Exception("Account-Profile not exists to follow");

            var follow = await context.Follows.Where(f => f.UserId.ToString() == profileId && f.FollowerId.ToString() == userId).FirstOrDefaultAsync();
            if(follow == null)
            {
                follow = new Follow()
                {
                    FollowerId = new Guid(userId),
                    UserId = new Guid(profileId),
                };
                await context.Follows.AddAsync(follow);
                await context.SaveChangesAsync();
            }

            return true;
        }
        public async Task<bool> UnFollowUser(string userId, string profileId)
        {
            var profile = await _userManager.FindByIdAsync(profileId);
            if (profile == null) throw new Exception("Account-Profile not exists to follow");

            var follow = await context.Follows.Where(f => f.UserId.ToString() == profileId && f.FollowerId.ToString() == userId).FirstOrDefaultAsync();
            if (follow != null)
            {
                
                context.Follows.Remove(follow);
                await context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> AddFriend(string userId, string profileId)
        {
            var myShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == userId && f.FriendId.ToString() == profileId)
                .FirstOrDefaultAsync();

            var friendShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == profileId && f.FriendId.ToString() == userId)
                .FirstOrDefaultAsync();

            if (myShip != null)
            {
                if(myShip.Status == FriendShip.FriendStatus.Obstructed) throw new Exception("Account-You have been blocked by this user");

                else if(myShip.Status == FriendShip.FriendStatus.Prevented) throw new Exception("Account-You have blocked this user");

                if (myShip.Type == FriendShip.FriendType.Response)
                {
                    myShip.IsFriend = true;
                    myShip.Type = FriendShip.FriendType.None;

                    friendShip.IsFriend = true;
                    friendShip.Type = FriendShip.FriendType.None;
                }
                else if (myShip.Type == FriendShip.FriendType.Waiting) return true;
                else
                {
                    myShip.Type = FriendShip.FriendType.Waiting;
                    friendShip.Type = FriendShip.FriendType.Response;
                }
                await context.SaveChangesAsync();
            }
            else
            {
                myShip = new FriendShip()
                {
                    UserId = new Guid(userId),
                    FriendId = new Guid(profileId),
                    Status= FriendShip.FriendStatus.Normal,
                    Type = FriendShip.FriendType.Waiting,
                    IsFriend = false,
                };
                friendShip = new FriendShip()
                {
                    UserId = new Guid(profileId),
                    FriendId = new Guid(userId),
                    Status= FriendShip.FriendStatus.Normal,
                    Type = FriendShip.FriendType.Response,
                    IsFriend = false,
                };
                

                await context.FriendShips.AddRangeAsync(new List<FriendShip>() { myShip, friendShip });
                await context.SaveChangesAsync();
            }

            return true;
        }
        public async Task<bool> UnFriend(string userId, string profileId)
        {
            var myShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == userId && f.FriendId.ToString() == profileId)
                .FirstOrDefaultAsync();

            var friendShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == profileId && f.FriendId.ToString() == userId)
                .FirstOrDefaultAsync();

            if (myShip != null)
            {
                if (myShip.Status == FriendShip.FriendStatus.Obstructed) throw new Exception("Account-You have been blocked by this user");

                else if (myShip.Status == FriendShip.FriendStatus.Prevented) throw new Exception("Account-You have blocked this user");

                if (myShip.Type == FriendShip.FriendType.Response || myShip.Type == FriendShip.FriendType.Waiting || myShip.IsFriend)
                {
                    myShip.IsFriend = false;
                    myShip.Type = FriendShip.FriendType.None;

                    friendShip.IsFriend = false;
                    friendShip.Type = FriendShip.FriendType.None;
                }
               
                await context.SaveChangesAsync();
            }
             
            return true;
        }

        public async Task<bool> BlockUser(string userId, string profileId)
        {
            var myShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == userId && f.FriendId.ToString() == profileId)
                .FirstOrDefaultAsync();

            var friendShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == profileId && f.FriendId.ToString() == userId)
                .FirstOrDefaultAsync();

            if (myShip != null)
            {
                if (myShip.Status == FriendShip.FriendStatus.Obstructed) throw new Exception("Account-You have been blocked by this user");

                myShip.Status = FriendShip.FriendStatus.Prevented;
                friendShip.Status = FriendShip.FriendStatus.Obstructed;

               await context.SaveChangesAsync();
            }
            else
            {
                myShip = new FriendShip()
                {
                    UserId = new Guid(userId),
                    FriendId = new Guid(profileId),
                    Type = FriendShip.FriendType.None,
                    Status = FriendShip.FriendStatus.Prevented,
                    IsFriend = false,
                };

                friendShip = new FriendShip()
                {
                    UserId = new Guid(profileId),
                    FriendId = new Guid(userId),
                    Type = FriendShip.FriendType.None,
                    Status = FriendShip.FriendStatus.Obstructed,
                    IsFriend = false,
                };


                await context.FriendShips.AddRangeAsync(new List<FriendShip>() { myShip, friendShip });
                await context.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> UnBlockUser(string userId, string profileId)
        {
            var myShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == userId && f.FriendId.ToString() == profileId)
                .FirstOrDefaultAsync();

            var friendShip = await context.FriendShips
                .Where(f => f.UserId.ToString() == profileId && f.FriendId.ToString() == userId)
                .FirstOrDefaultAsync();

            if (myShip != null)
            {
                if (myShip.Status == FriendShip.FriendStatus.Obstructed) throw new Exception("Account-You have been blocked by this user");

                myShip.Status = FriendShip.FriendStatus.Normal;
                friendShip.Status = FriendShip.FriendStatus.Normal;

                await context.SaveChangesAsync();
            }
             
            return true;
        }
    }
}
