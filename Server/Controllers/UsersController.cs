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

        public UsersController(APIDbContext context, UserService userService, TokenService tokenService, GmailSenderService gmailSenderService, IConfiguration configuration)
        {
            _context = context;
            _userService = userService;
            _tokenService = tokenService;
            _gmailSenderService = gmailSenderService;

            var clientSettings = configuration.GetSection("ClientSettings");
            _ClientHost = clientSettings["HostName"];
            _ClientResetUrl = clientSettings["ResetUrl"];

        }

        [HttpPost("login")]
        [Consumes("application/json", "multipart/form-data", "application/x-www-form-urlencoded")]
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

                return Ok(userId);

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
                Console.WriteLine("ERR UserController - TestMail: " + ex.Message);
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
                Console.WriteLine("ERR UserController - TestMail: " + ex.Message);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }
        }

        // GET: api/Users

    }
}
