using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/notify")]
    [ApiController]
    public class NotifyController : ControllerBase
    {
        private readonly NotifyService _notifyService;
        
        public NotifyController(NotifyService notifyService)
        {
            _notifyService = notifyService;
        }

        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> SetSeen(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var r = await _notifyService.ReadNotify(userId, id);
                return NoContent();
            }
            catch(Exception e)
            {
                var m = e.Message;
                if (m.StartsWith("Notify-")) return BadRequest(new { message = m.Split("-")[1]});
                Console.WriteLine( "Error Set seen notify: "+ m);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
    }
}
