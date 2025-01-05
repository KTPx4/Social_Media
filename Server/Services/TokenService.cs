using Microsoft.IdentityModel.Tokens;
using Server.DTOs.Account;
using Server.Models.Account;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Services
{
    public class TokenService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;


        public TokenService(IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            _secretKey = jwtSettings["SecretKey"];
            _issuer = jwtSettings["Issuer"];
            _audience = jwtSettings["Audience"];
        }

        public enum ModPosition
        {
            All = 0, Account = 1, Post = 2, Story = 3
        }

        public string GenerateUserToken(UserResponse user)    
        {
            return GenerateToken(user.Id, user.UserName, user.UserRoles);
        }
  

        private string GenerateToken(Guid userId, string userName, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(ClaimTypes.Name, userName),
                new Claim("UserId", userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach(var i in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, i));
            }

            var keyBytes = Encoding.UTF8.GetBytes(_secretKey.PadRight(32));
            var key = new SymmetricSecurityKey(keyBytes);
            
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public string GenerateResetToken(string userId, string password)
        {
            return GenerateToken(userId, password);
        }

        private string GenerateToken(string userId, string password)
        {
            var claims = new[]
            {
                new Claim("Password", password),
                new Claim("UserId", userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var keyBytes = Encoding.UTF8.GetBytes(_secretKey.PadRight(32));
            var key = new SymmetricSecurityKey(keyBytes);

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var keyBytes = Encoding.UTF8.GetBytes(_secretKey.PadRight(32));
                var key = new SymmetricSecurityKey(keyBytes);

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true, // Kiểm tra thời hạn token
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key
                };

                // Giải mã và xác thực token
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

                return principal; // Token hợp lệ
            }
            catch (SecurityTokenException)
            {
                return null; // Token không hợp lệ
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần
                Console.WriteLine($"Lỗi kiểm tra token: {ex.Message}");
                return null;
            }
        }

    }
}
