﻿using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Account;
using Server.Models.Account;
using System.Security.Claims;

namespace Server.Services
{
    public class UserService
    {
        private readonly APIDbContext context;
        public UserService(APIDbContext context)
        {
            this.context = context;
        }
        public async Task<User?> ChangePassword(string id, string newPPassword)
        {
            if(string.IsNullOrEmpty(id) || string.IsNullOrEmpty(newPPassword)) return null;
           
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString().Equals(id));
            if (user == null) return null;

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPPassword);

            // Lưu các thay đổi vào cơ sở dữ liệu
            await context.SaveChangesAsync();

            // Trả về người dùng với mật khẩu mới đã được cập nhật
            return user;

        }


        // Kiểm tra đăng nhập (username và password)
        public async Task<UserResponse?> ValidateLoginAsync(string username, string password)
        {
            // Tìm user theo username
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            
            if (user == null) return null;

            // Xác minh mật khẩu với BCrypt
            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null; // Sai mật khẩu
            }

            return new UserResponse(user); // Đăng nhập thành công
        }

        public async Task<UserResponse?> RegisterAsync(String username, String password, String email)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (existsUser != null) return null;
            
            var passHash = BCrypt.Net.BCrypt.HashPassword(username);
            Models.Account.User user = new Models.Account.User()
            {
                UserName = username,
                Password= passHash,
                UserProfile = username,
                Name = username,
                Email = email
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            UserResponse response = new UserResponse(user);
            return response;

        }

        public async Task<UserResponse?> FindByUserName(String username)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u => u.UserName.Equals(username));
            return existsUser == null ? null : new UserResponse(existsUser);
        }

        public async Task<UserResponse?> FindById(String id)
        {
            var existsUser = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString().Equals(id));
            return existsUser == null ? null : new UserResponse(existsUser);
        }

        public async Task<UserResponse?> ResetPassword(ClaimsPrincipal principal)
        {
            if (principal == null) return null;

            // Token hợp lệ, lấy thông tin từ claims
            var userId = principal.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var password = principal.Claims.FirstOrDefault(c => c.Type == "Password")?.Value;
                               

            var userModel = await ChangePassword(userId, password);
                
            return userModel == null ? null : new UserResponse(userModel);
        }
    }
}