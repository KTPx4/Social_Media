using Server.Services;

namespace Server.Configs
{
    public static class ServiceConfiguration
    {
        public static void AddUserService(this IServiceCollection services)
        {
            // Đăng ký TokenService 
            services.AddScoped<TokenService>();

            // Đăng ký UserService vào DI container
            services.AddScoped<UserService>();

            services.AddScoped<GmailSenderService>();
        }
    }
}
