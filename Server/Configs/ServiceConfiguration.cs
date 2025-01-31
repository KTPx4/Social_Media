using Server.Hubs;
using Server.Services;
using Server.Services.SCommunication;
using Server.Services.SPosts;

namespace Server.Configs
{
    public static class ServiceConfiguration
    {
        public static void AddUserService(this IServiceCollection services)
        {
            // Đăng ký TokenService 
            services.AddScoped<TokenService>();
            services.AddSingleton<TokenService>();
            services.AddScoped<ICommunicationService,CommunicationService>();
            services.AddSingleton<ConnectionManager>();


            services.AddScoped<GmailSenderService>();

            // Đăng ký UserService vào DI container
            services.AddScoped<UserService>();

            services.AddScoped<PostService>();
            services.AddScoped<FileService>();
            services.AddScoped<NotifyService>();


        }
    }
}
