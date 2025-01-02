using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models.Account;

namespace Server.Services
{
    public class UserService
    {
        private readonly APIDbContext context;
        public UserService(APIDbContext context)
        {
            this.context = context;
        }

        // Thêm Users mới với hash password bằng BCrypt
            public async Task<User> AddUserAsync(User user)
            {
                // Hash mật khẩu trước khi lưu
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                context.Users.Add(user);
                await context.SaveChangesAsync();
                return user;
            }

            // Kiểm tra đăng nhập (username và password)
            public async Task<User?> ValidateLoginAsync(string username, string password)
            {
                // Tìm user theo username
                var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            
                if (user == null) return null;

                // Xác minh mật khẩu với BCrypt
                if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
                {
                    return null; // Sai mật khẩu
                }

                return user; // Đăng nhập thành công
            }
        }
}
