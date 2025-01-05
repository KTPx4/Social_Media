using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Server.Models.Account;
using System.Security.Claims;

namespace Server.Configs
{
    public class CheckUserIsDeletedMiddleware
    {
        private readonly RequestDelegate _next;

        public CheckUserIsDeletedMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, UserManager<User> userManager)
        {
            // Kiểm tra xem user đã đăng nhập chưa
            if (context.User.Identity?.IsAuthenticated == true)
            {
                // Lấy UserId từ Claims
                var userId = context.User.FindFirstValue("UserId");
                if (!string.IsNullOrEmpty(userId))
                {
                    // Tìm user trong database
                    var user = await userManager.FindByIdAsync(userId);
                    if (user != null && user.IsDeleted)
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsJsonAsync(new {message = "User account is deactivated!" });
                        return;
                    }
                }
            }

            // Chuyển tiếp đến Middleware tiếp theo
            await _next(context);
        }
    }
}
