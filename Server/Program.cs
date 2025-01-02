
using Microsoft.EntityFrameworkCore;
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
                options.AddPolicy("ModOnly", policy => policy.RequireRole("Mod"));
                options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
            });

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
