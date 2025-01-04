
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Server.Configs;
using Server.Data;
using Server.Services;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
          
            // config CORS
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.WithOrigins("*");
                                      
                                  });
            });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // add context
            builder.Services.AddDbContext<APIDbContext>(opt =>
                opt.UseSqlServer(builder.Configuration.GetConnectionString("MSSQL"))
            );

            // Sử dụng lớp cấu hình để đăng ký dịch vụ
            builder.Services.AddUserService();


            // register middware jwt
            builder.Services.AddJwtAuthentication(builder.Configuration);

            // config authorization
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModAllOnly", policy => policy.RequireRole("Mod-All"));
                options.AddPolicy("ModAccountOnly", policy => policy.RequireRole("Mod-Account"));
                options.AddPolicy("ModPostOnly", policy => policy.RequireRole("Mod-Post"));
                options.AddPolicy("ModStoryOnly", policy => policy.RequireRole("Mod-Story"));

                options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
            });

            var app = builder.Build();

            // Enable serving static files
            app.UseStaticFiles();

            // Map the "public/account" folder to be publicly accessible
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/public/account")),
                RequestPath = "/public/account"
            });


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
