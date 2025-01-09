using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Server.Data;
using Server.DTOs.Account;
using Server.Models.Account;
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
        public UserService(APIDbContext context, RoleManager<Role> roleManager, UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            this.context = context;
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._configuration = configuration;
            this._roleManager = roleManager;
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

        public async Task<User> GetMyInfo(string userId)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        }
    }
}
