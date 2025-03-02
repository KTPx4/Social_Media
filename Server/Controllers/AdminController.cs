using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Account;
using Server.DTOs.ReportDTO;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Authorize(Roles = "admin,mod")]
        public async Task<IActionResult> GetReport()
        {
            try
            {
                var rs = await _adminService.GetInfoSystem();
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if(message.StartsWith("Admin-"))
                {
                    return BadRequest(new {message = message.Substring(6)});
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new {message = "Server error. Try again!"});
            }
        }

        [HttpGet("account")]
        [Authorize(Roles = "admin,mod")]
        public async Task<IActionResult> ReportAccount([FromQuery] int year = 2025)
        {
            try
            {
                var rs = await _adminService.ReportAccount(year);
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpGet("account/info")]
        [Authorize(Roles = "admin,mod")]
        public async Task<IActionResult> GetInfoAccount([FromQuery] string type = "Mod")
        {
            try
            {
                var rs = new List<UserResponse>();
                if(type.Equals("mod"))
                {
                    rs = await _adminService.GetInfoMod();
                    
                }
                else
                {
                    rs = await _adminService.GetInfoUser();
                }

                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpGet("account/{userId}/roles")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUserRoles(Guid userId)
        {
            try
            {
                var rs = await _adminService.GetRole(userId);
                return Ok(new { message = "Get role success", data= rs });

            }
            catch (Exception e)
            {
                var message = e.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + e.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpPost("account/{userId}/roles")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUserRoles(Guid userId, [FromBody] List<string> roles)
        {
            try
            {
                var rs = await _adminService.SetRole(userId, roles);
                return Ok(new { message = "Roles updated successfully", roles });

            }
            catch (Exception e)
            {
                var message = e.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + e.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpPost("account/{userId}/ban")]
        [Authorize(Roles = "admin,mod-account")]
        public async Task<IActionResult> BanUser(Guid userId)
        {
            try
            {
                var rs = await _adminService.BanUser(userId);
                return Ok(new { message = "Updated successfully" });

            }
            catch (Exception e)
            {
                var message = e.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + e.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpDelete("account/{userId}/ban")]
        [Authorize(Roles = "admin,mod-account")]
        public async Task<IActionResult> UnBanUser(Guid userId)
        {
            try
            {
                var rs = await _adminService.UnBanUser(userId);
                return Ok(new { message = "Updated successfully" });

            }
            catch (Exception e)
            {
                var message = e.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + e.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }


        // post
        [HttpGet("post")]
        [Authorize(Roles = "admin,mod")]
        public async Task<IActionResult> ReportPost([FromQuery] int year = 2025)
        {
            try
            {
                var rs = await _adminService.ReportPost(year);
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }


        //report
       
        [HttpGet("report")]
        [Authorize(Roles = "admin,mod")]
        public async Task<IActionResult> ReportReport([FromQuery] int year = 2025)
        {
            try
            {
                var rs = await _adminService.ReportReport(year);
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpGet("report/post")]
        [Authorize(Roles = "admin,mod-post")]
        public async Task<IActionResult> GetReportPost()
        {
            try
            {
                var rs = await _adminService.GetReportPosts();
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }

        [HttpPost("report/post/{id}")]
        [Authorize(Roles = "admin,mod-post")]
        public async Task<IActionResult> SetSatusReport(string id , [FromBody] UpdateReportModel updateModel)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _adminService.SetSatusReport(userId, id, updateModel);
                return Ok(new
                {
                    message = "Get data success",
                    Data = rs
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (message.StartsWith("Admin-"))
                {
                    return BadRequest(new { message = message.Substring(6) });
                }
                Console.WriteLine("++++++++++++++++++++++++++++++++++++" + ex.Message);
                return BadRequest(new { message = "Server error. Try again!" });
            }
        }
    }
}
