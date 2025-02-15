using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.DTOs.Communication;
using Server.DTOs.Posts;
using Server.Hubs;
using Server.Models.Account;
using Server.Models.Communication;
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
        private readonly ConnectionManager _connectionManager;

        public ChatController(ICommunicationService communicationService,  IHubContext<ChatHub> hubContext, ConnectionManager connectionManager)
        {
            _hubContext = hubContext;
            _communicationService = communicationService;
            _connectionManager = connectionManager;
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
        public async Task<IActionResult> GetConversationById(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _communicationService.GetConversationById(userId, id);
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

        [HttpGet("conversation/{id}/chat")]
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

        [HttpPut("conversation/{id}/members")]
        [Authorize]
        public async Task<IActionResult> EditMembers(string id, EditGroupModel editGroupModel)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                if (editGroupModel.Members == null || editGroupModel.Members.Count < 1)
                {
                    return BadRequest(new { message = "List members group must not null and > 0" });
                }

                var rs = await _communicationService.EditMembers(userId, id, editGroupModel.Members);
                var members = rs.Members;
                
                var memberIds = members.Select(m => m.UserId).ToList();

                //foreach(var memId in memberIds)
                //{
                //    await _hubContext.Clients.User(memId).SendAsync("UpdateGroup", new Guid(), rs.ListNewMessage);
                //}

                var connectionIds = _connectionManager.GetConnections(memberIds);
                await _hubContext.Clients.Clients(connectionIds).SendAsync("UpdateGroup", new Guid(), rs.ListNewMessage);

    //            var tasks = memberIds
    //.               Select(memId => _hubContext.Clients.User(memId).SendAsync("UpdateGroup", new Guid(), rs.ListNewMessage));

    //            await Task.WhenAll(tasks);

                return Ok(new
                {
                    message = "Edit group success",
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
        [HttpPost("conversation/{id}/leave")]
        [Authorize]
        public async Task<IActionResult> LeaveGroup(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId"); 

                var rs = await _communicationService.LeaveGroup(userId, id);

                return NoContent();
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


        [HttpPut("conversation/{id}/info")]
        [Authorize]
        public async Task<IActionResult> EditInfo(string id, EditGroupModel editGroupModel)
        {
            var userId = User.FindFirstValue("UserId");
            if(editGroupModel.Name == null || string.IsNullOrEmpty(editGroupModel.Name))
            {
                return BadRequest(new { message = "Name group cant null" });
            }
            if (editGroupModel.Image != null)
            {
                try
                {
                    FileValidationHelper.IsValidAvatar(editGroupModel.Image);
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
            }

            try
            {
                FileInfoDto fileInfo = null;
                if (editGroupModel.Image != null)
                {
                    fileInfo = FileValidationHelper.GetFileInfo(editGroupModel.Image);

                }

                var rs = await _communicationService.EditGroup(userId, id, fileInfo, editGroupModel.Name);

                return Ok(new
                {
                    message = "Edit group success",
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


        [HttpGet("conversation/{id}/media")]
        [Authorize]
        public async Task<IActionResult> GetMedia(string id, [FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _communicationService.GetMedia(userId, id, page);
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

        [HttpPost("conversation/{id}/file")]
        [Authorize]
        public async Task<IActionResult> SendFile(string id, [FromForm] SendFileModel sendFileModel)        
        {
            try
            {
                var file = sendFileModel.file;
                // Kiểm tra file
                if (file == null )
                {
                    return BadRequest(new { message = "File is required" });
                }

                // Chuyển conversationId sang Guid
                if (!Guid.TryParse(id, out Guid convId))
                {
                    return BadRequest(new { message = "Invalid conversation id" });
                }
                // Lấy userId từ claims và chuyển sang Guid
                var userIdString = User.FindFirstValue("UserId");
                if (!Guid.TryParse(userIdString, out Guid userId))
                {
                    return Unauthorized(new { message = "Invalid user id" });
                }

                var rs = await _communicationService.SendFile(userIdString, id, file);
                var listMembers = rs.ListMember;
                var mess = rs.MessageRs;

                var members = rs.ListMember;

                var memberIds = members.Select(m => m.UserId).ToList();

                var connectionIds = _connectionManager.GetConnections(memberIds);
                await _hubContext.Clients.Clients(connectionIds).SendAsync("SendFile", new Guid(), mess);


                return Ok(new
                {
                    message = "Send file success",
                    data = mess
                });

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if (mess.StartsWith("Chat-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine("----------------------------------------Get conversation:" + mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
        }

        [HttpPost("conversation/{id}/seen")]
        [Authorize]
        public async Task<IActionResult> SetSeenMessage(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
               
                var rs = await _communicationService.SetSeen(userId, id);

                //await _hubContext.Clients.User(receiverUserId).SendAsync("ReceiveMessage", messageModel.SenderId, messageModel.Content);

                return NoContent();

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
