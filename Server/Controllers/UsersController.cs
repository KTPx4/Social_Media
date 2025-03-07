﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Account;
using Server.Models.Account;
using Server.Modules;
using Server.Services;
using Server.Services.SPosts;

namespace Server.Controllers
{
    [Route("api/user")]
    [ApiController]
     public class UsersController : ControllerBase
    {
     
        private readonly UserService _userService;
        private readonly TokenService _tokenService;
        private readonly GmailSenderService _gmailSenderService;

        private readonly string _ClientHost;
        private readonly string _ClientResetUrl;
        
        private readonly string _ServerHost;
        private readonly string _RootImgAccount;
        private readonly string _AccessImgHost;
        private readonly string _ServerIMGHost;

        public UsersController(  UserService userService, TokenService tokenService, GmailSenderService gmailSenderService, IConfiguration configuration)
        {
           
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

        [HttpGet("notifies")]
        [Authorize]
        public async Task<IActionResult> GetNotifies([FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.GetNotifies(userId, page);

                return Ok(new { message = "Get success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get notifies: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpGet("friends")]
        [Authorize]
        public async Task<IActionResult> GetFriends([FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.GetFriends(userId, page);

                return Ok(new { message = "Get friend success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get notifies: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        [HttpGet("search/{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.FindById(userId, id);

                if (rs == null) return NotFound(new { message = "Account not exists or user profile has been changed" });

                return Ok(new { message = "Get success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpGet("profile/{profile}")]
        [Authorize]
        public async Task<IActionResult> GetByProfile(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.FindByUserProfile(userId, profile);
                
                if(rs == null) return NotFound(new {message = "Account not exists or user profile has been changed" });

                return Ok(new { message = "Get success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpPost("profile/{profile}/follow")]
        [Authorize]
        public async Task<IActionResult> FollowUser(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if(userId == profile) return BadRequest(new {message = "Cant follow or unfollow  your selft" });
                var rs = await _userService.FollowUser(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpDelete("profile/{profile}/follow")]
        [Authorize]
        public async Task<IActionResult> UnFollowUser(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if (userId == profile) return BadRequest(new { message = "Cant follow or unfollow your selft" });
                
                var rs = await _userService.UnFollowUser(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        [HttpPost("profile/{profile}/friend")]
        [Authorize]
        public async Task<IActionResult> AddFriend(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if (userId == profile) return BadRequest(new { message = "Cant follow or unfollow your selft" });

                var rs = await _userService.AddFriend(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpDelete("profile/{profile}/friend")]
        [Authorize]
        public async Task<IActionResult> UnFriend(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if (userId == profile) return BadRequest(new { message = "Cant follow or unfollow your selft" });

                var rs = await _userService.UnFriend(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpPost("profile/{profile}/ban")]
        [Authorize]
        public async Task<IActionResult> BlockUser(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if (userId == profile) return BadRequest(new { message = "Cant follow or unfollow your selft" });

                var rs = await _userService.BlockUser(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpDelete("profile/{profile}/ban")]
        [Authorize]
        public async Task<IActionResult> UnBanUser(string profile)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                if (userId == profile) return BadRequest(new { message = "Cant follow or unfollow your selft" });

                var rs = await _userService.UnBlockUser(userId, profile);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpGet("profile/{profile}/saves")]
        [Authorize]
        public async Task<IActionResult> GetSaveByProfile(string profile, [FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.GetSavesByProfile(userId, profile, page);

                return Ok(new { message = "Get success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        [HttpGet("profile/{profile}/posts")]
        [Authorize]
        public async Task<IActionResult> GetByProfile(string profile, [FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _userService.GetPostsByProfile(userId, profile, page);

                return Ok(new { message = "Get success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Account-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get by profile: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel userLogin)
        {
            try
            {
                String token = "";                

                var user = await _userService.ValidateLoginAsyncV2(userLogin.UserName, userLogin.Password);
               
                if (user == null)
                {
                    return BadRequest(new {message = "Invalid username or password" });
                }

                token =  _tokenService.GenerateUserToken(user);
                
                var rs = new 
                { 
                    data = user,
                    token = token, 
                    message = "Login success" 
                };
               
                await CheckAvt(user.Id.ToString(), user.ImageUrl);

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

                var user = await _userService.RegisterV2(userRegister.UserName, userRegister.Password, userRegister.Email);

                if(user == null)
                {
                    return BadRequest(new { message = "Username is exists" });
                }

                String token = _tokenService.GenerateUserToken(user);
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
       
        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin( )
        {
            try
            {
                //[FromBody] RegisterAdminModel userRegister
                var user = await _userService.CreateAdmin();

                if (user == null)
                {
                    return BadRequest(new { message = "Admin is exists" });
                }

                String token = _tokenService.GenerateUserToken(user);
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


        [HttpGet("validate")]
        [Authorize]
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
               
                
                await CheckAvt(user.Id.ToString(), user.ImageUrl);

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

                var token = await _userService.SendResetPassword(resetModel.UserName, newPass);

                var placeholders = new Dictionary<string, string>
                {
                    { "UserName", user.UserName } ,
                    { "ResetLink", $"{_ClientResetUrl}?username={resetModel.UserName}&token={token}" }
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
        public async Task<IActionResult> ValidReset([FromQuery] string token, [FromQuery] string username, [FromQuery] string NewPass)
        {
            try
            {
                Console.WriteLine(token);
                if (String.IsNullOrEmpty(token) || String.IsNullOrEmpty(username)) return BadRequest(new { message = "Token or username is null" });
                token = token.Replace(" ", "+");
                var user = await _userService.ValidResetPassword(username, token, NewPass); // reset password

                if (user == null) return BadRequest(new { message = "Token invalid or user not exists" });
                
                var loginToken = _tokenService.GenerateUserToken(user); // new token login

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
        

        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateAccount([FromBody] UpdateModel updateModel)
        {
            try
            {
                updateModel.UserProfile.Trim();
                if(updateModel.UserProfile.Contains(" "))
                {
                    return BadRequest(new { message = "UserProfile invalid" });
                }
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
        [Authorize]
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

        [HttpPut("password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassModel model)
        {
        
            try
            {
                string userId = User.FindFirstValue("UserId");
                var user = await _userService.ChangePass(userId, model);
                //string token = 
                if (user == null) return NotFound(new {message="User not exists or deleted"});

                return Ok(new { message = "Change password success", data = user });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Changepass - Controller: " + ex.Message);
                return StatusCode(400, new { message = ex.Message });
            }
        }


        private async Task CheckAvt(string Id, string ImageUrl)
        {
            try
            {
                var destinationFolder = Path.Combine(_RootImgAccount, Id);

                var destinationPath = Path.Combine(destinationFolder, ImageUrl);

                // Kiểm tra file nguồn tồn tại
                if (!System.IO.File.Exists(destinationPath))
                {
                    await CopyDefaultImage(Id);
                }
                 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Err when CheckAvt: {ex.Message}");
                // Ném lại lỗi nếu cần xử lý ở mức cao hơn
            }
        }

        private async Task CopyDefaultImage(string userId)
        {

            try
            {
                // Đường dẫn nguồn (ảnh mặc định)
                var sourcePath = Path.Combine( _RootImgAccount, "default.jpg");

                // Đường dẫn đích (thư mục của user)
                var destinationFolder = Path.Combine(_RootImgAccount, $"{userId}");
                var destinationPath = Path.Combine(destinationFolder, "default.jpg");

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
