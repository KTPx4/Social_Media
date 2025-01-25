using Server.Services;
using Server.Services.SPosts;

namespace Server.Configs
{
    public static class ServiceConfiguration
    {
        public static void AddUserService(this IServiceCollection services)
        {
            // Đăng ký TokenService 
            services.AddScoped<TokenService>();

            services.AddScoped<GmailSenderService>();

            // Đăng ký UserService vào DI container
            services.AddScoped<UserService>();

            services.AddScoped<PostService>();
            services.AddScoped<FileService>();
            services.AddScoped<NotifyService>();


        }
    }
}
