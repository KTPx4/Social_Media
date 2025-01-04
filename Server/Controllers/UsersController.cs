using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Account;
using Server.Models.Account;
using Server.Modules;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/user")]
    [ApiController]
     public class UsersController : ControllerBase
    {
        private readonly APIDbContext _context;
        private readonly UserService _userService;
        private readonly TokenService _tokenService;
        private readonly GmailSenderService _gmailSenderService;
        private readonly string _ClientHost;
        private readonly string _ClientResetUrl;
        
        private readonly string _ServerHost;
        private readonly string _RootImgAccount;
        private readonly string _AccessImgHost;
        private readonly string _ServerIMGHost;

        public UsersController(APIDbContext context, UserService userService, TokenService tokenService, GmailSenderService gmailSenderService, IConfiguration configuration)
        {
            _context = context;
            _userService = userService;
            _tokenService = tokenService;
            _gmailSenderService = gmailSenderService;

            var clientSettings = configuration.GetSection("ClientSettings");
            _ClientHost = clientSettings["HostName"];
            _ClientResetUrl = clientSettings["ResetUrl"];

            var serverSetting = configuration.GetSection("ServerSettings");
            _ServerHost = serverSetting["HostName"];
            _RootImgAccount = serverSetting["RootImgAccount"];
            _AccessImgHost = serverSetting["AccessImgHost"];

            _ServerIMGHost = Path.Combine(_ServerHost, _AccessImgHost);

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel userLogin)
        {
            try
            {
                String token = "";                

                var user = await _userService.ValidateLoginAsync(userLogin.UserName, userLogin.Password);
               
                if (user == null)
                {
                    return BadRequest(new {message = "Invalid username or password" });
                }

                token =  _tokenService.GenerateUserToken(user.Id, userLogin.UserName);
                
                var rs = new 
                { 
                    data = token, 
                    message = "Login success" 
                };
               
                return Ok(rs);
            }
            catch (Exception ex) 
            {
                Console.WriteLine( "ERR UserController - login: "+ ex.Message);
                return StatusCode(500, new {message = "Server error. Try again!"});
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel userRegister)
        {
            try
            {
                
                var user = await _userService.RegisterAsync(userRegister.UserName, userRegister.Password, userRegister.Email);

                if(user == null)
                {
                    return BadRequest(new { message = "Username is exists" });
                }

                String token = _tokenService.GenerateUserToken(user.Id, user.UserName);
                var rs = new
                {
                    message = "Create account success",
                    data = user,
                    token = token
                };

                await CopyDefaultImage(user.Id.ToString()); // copy default img

                return Ok(rs);

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - Register: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }

        [HttpGet("me")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetInfo()
        {
            try
            {
                // Lấy username , id từ claims
                var userId = User.FindFirstValue("UserId");
               
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not found in token" });
                }
                var user = await _userService.GetMyInfo(userId);
                
                if (user == null) return NotFound(new { message = "Your account not found or was deleted" });
                
                return Ok(new {message = "Get info success", data = user, imghost= _ServerIMGHost });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - GetInfo: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }


        [HttpPost("reset")]     
        public async Task<IActionResult> SendResetPass([FromBody] ResetModel resetModel)
        {
            try
            {
                var user = await _userService.FindByUserName(resetModel.UserName);
                if(user == null)
                {
                    return BadRequest(new { message = "Username not exists" });
                }

                var newPass = Generator.RandomString(8);
                var token = _tokenService.GenerateResetToken(user.Id.ToString(), newPass);

               
                var placeholders = new Dictionary<string, string>
                {
                    { "UserName", user.UserName },
                    { "NewPassword", newPass },
                    { "ResetLink", $"{_ClientResetUrl}?token={token}" }
                };
                string email = user.Email;
                await _gmailSenderService.SendEmail(email, "Internal - Reset Password", "PasswordResetTemplate.html", placeholders);

                string emailHide = email.ToLower().Split("@gmail.com")[0];


                return Ok( new {message = "An email reset password was sent. Please check email register account"});

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - SendResetPass: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }

        [HttpGet("reset")]
        public async Task<IActionResult> ValidReset([FromQuery] string token)
        {
            try
            {
                if (String.IsNullOrEmpty(token)) return BadRequest(new { message = "Token reset password is null" });

                var pricipal = _tokenService.ValidateToken(token); // check token
                if (pricipal == null) return BadRequest(new { message = "Token invalid or expired" });
                
                var user = await _userService.ResetPassword(pricipal); // reset password

                if (user == null) return BadRequest(new { message = "Token data is invalid" });
                
                var loginToken = _tokenService.GenerateUserToken(user.Id, user.UserName); // new token login

                return Ok(new {
                    message ="Reset password success", 
                    data = user,
                    token = loginToken
                });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - ValidReset: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }

      
        [HttpGet("validate")]
        public async Task<IActionResult> ValidLogin([FromQuery] string token)
        {
            try
            {
                if (String.IsNullOrEmpty(token)) return BadRequest(new { message = "Token is null" });

                var pricipal = _tokenService.ValidateToken(token); // check token
                if (pricipal == null) return BadRequest(new { message = "Token invalid or expired" });

                var user = await _userService.ValidToken(pricipal); // reset password

                if (user == null) return BadRequest(new { message = "Token data is invalid" });

                
                return Ok(new
                {
                    message = "Token is valid",
                    data = user
                });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - ValidReset: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }


        [HttpPut("update")]
        [Authorize(Roles ="User")]

        public async Task<IActionResult> UpdateAccount([FromBody] UpdateModel updateModel)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var user = await _userService.UpdateAsync(userId, updateModel);
                return Ok(new { message = "Update info success",data = user});

            }
            catch (Exception ex)
            {
                string mess = ex.Message;
                Console.WriteLine("ERR UserController - UpdateAccount: " + ex.Message);
                if(mess.StartsWith("Exists-"))
                {
                    var rmess = mess.Split("-")[1];
                    return BadRequest(new {message = rmess});
                }

                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }

        [HttpPut("upload")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not found in token" });
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest(new {message = "File is invalid" });
                }

                // Kiểm tra dung lượng file (< 10MB)
                const long maxFileSize = 10 * 1024 * 1024; // 10MB
                if (file.Length > maxFileSize)
                {
                    return BadRequest(new { message = "Image must less than 10mb" });
                }

                // Kiểm tra định dạng file (chỉ cho phép ảnh)
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Only allow image has type: (.jpg, .jpeg, .png, .gif)." });
                }

                // Lưu file vào thư mục đích
                var uploadsFolder = Path.Combine(_RootImgAccount, userId);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, file.FileName);

                // Lưu file tạm
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Xóa file tạm (nếu cần)
                var tempFilePath = file.FileName; // File tạm của hệ thống.
                if (System.IO.File.Exists(tempFilePath))
                {
                    System.IO.File.Delete(tempFilePath);
                }

                var publicUrl = Path.Combine(_ServerIMGHost, userId, file.FileName);
                var userModel = await _userService.UpdateAvatarAsync(userId, uploadsFolder, file.FileName);

                return Ok(new { message  = "Upload avatar success", data = userModel, url = publicUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERR UserController - UpdateAccount: " + ex.Message);
                
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
           
        }


        private async Task CopyDefaultImage(string userId)
        {
            // Đường dẫn nguồn (ảnh mặc định)
            var sourcePath = Path.Combine( _RootImgAccount, "default.jpg");

            // Đường dẫn đích (thư mục của user)
            var destinationFolder = Path.Combine(_RootImgAccount, $"{userId}");
            var destinationPath = Path.Combine(destinationFolder, "default.jpg");

            try
            {
                // Kiểm tra file nguồn tồn tại
                if (!System.IO.File.Exists(sourcePath))
                {
                    throw new FileNotFoundException("Not exists default image: 'default.jpg'", sourcePath);
                }

                // Tạo thư mục đích nếu chưa tồn tại
                if (!Directory.Exists(destinationFolder))
                {
                    Directory.CreateDirectory(destinationFolder);
                }

                // Copy file vào thư mục đích
                using (var sourceStream = new FileStream(sourcePath, FileMode.Open, FileAccess.Read))
                using (var destinationStream = new FileStream(destinationPath, FileMode.Create, FileAccess.Write))
                {
                    await sourceStream.CopyToAsync(destinationStream);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Err when copy default image: {ex.Message}");
                 // Ném lại lỗi nếu cần xử lý ở mức cao hơn
            }
        }

        
    }
}
