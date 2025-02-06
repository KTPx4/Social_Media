using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.DTOs.Communication;
using Server.DTOs.Posts;
using Server.Hubs;
using Server.Models.Account;
using Server.Modules;
using Server.Services.SCommunication;
using Server.Services.SPosts;
using System.IO;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ICommunicationService _communicationService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(ICommunicationService communicationService,  IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
            _communicationService = communicationService;
        } 

        [HttpGet("group")]
        [Authorize]
        public async Task<IActionResult> GetGroup()
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var rs = await _communicationService.GetGroups(userId) ;

                return Ok(new
                {
                    message = "Get groups chat success",
                    data = rs
                });
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("Chat-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine("Create Posts:" + mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
        }

        [HttpPost("group")]
        [Authorize]
        public async Task<IActionResult> CreateGroup([FromForm] CreateGroupModel createGroupModel)
        {
            var userId = User.FindFirstValue("UserId");
            createGroupModel.Members = createGroupModel.Members.Where(m => m != userId).ToList();
            if(createGroupModel.Members == null || createGroupModel.Members.Count < 1)
            {
                return BadRequest(new { message = "Members must at more than 1" });
            }
            //var rs = await _communicationService.CreateConversation(createGroupModel)    

            try
            {
                FileValidationHelper.IsValidAvatar(createGroupModel.Image);
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("File-"))
                {
                    var rmess = mess.Split("File-")[1];
                    return BadRequest(new { message = rmess });
                }

                Console.WriteLine(mess);
                return StatusCode(500, new { message = "Server error. Try again!" });
            }

            try
            {
                var fileInfo = FileValidationHelper.GetFileInfo(createGroupModel.Image);
                                       

                var rs = await _communicationService.CreateConversation(userId, createGroupModel, fileInfo);

                return Ok(new
                {
                    message = "Create group success",
                    data = rs
                });
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("Chat-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine("Create Posts:" + mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
             
        }

        [HttpGet("conversation")]
        [Authorize]
        public async Task<IActionResult> GetConversation([FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _communicationService.GetConversation(userId, page);
                return Ok(new
                {
                    message = "Get groups chat success",
                    data = rs
                });
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("Chat-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine("Get conversation:" + mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
        }

        [HttpGet("conversation/{id}")]
        [Authorize]
        public async Task<IActionResult> GetChat(string id,[FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _communicationService.GetMessage(userId, id, page);
                return Ok(new
                {
                    message = "Get groups chat success",
                    data = rs
                });
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("Chat-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine("Get conversation:" + mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
        }
    }
}
