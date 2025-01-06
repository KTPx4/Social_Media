using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/file")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private List<String> typeGet = new List<string> { "media", "message" };
        private readonly FileService _fileService;
        private readonly TokenService _tokenService;
        private readonly IWebHostEnvironment _environment;

        public FileController( FileService fileService, TokenService tokenService, IWebHostEnvironment environment)
        {
            this._fileService = fileService;
            _tokenService = tokenService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetMedia([FromQuery] string token, [FromQuery] string t, [FromQuery] string id)
        {
            if(string.IsNullOrEmpty(token))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new {message = "Please login and provide token login"});
            }
            if (string.IsNullOrEmpty(id)) 
            {
                return NotFound(new { message = "File notfound" });
            }

            if (string.IsNullOrEmpty(t) || !typeGet.Contains(t)) 
            {
                t = "media";
            }
            string userId = "";
            //check token
            try
            {
                var principal = _tokenService.ValidateToken(token);

                if (principal == null) throw new Exception("Auth-Invalid Token");

                // Token hợp lệ, lấy thông tin từ claims
                userId = principal.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

                if (string.IsNullOrEmpty(userId)) throw new Exception("Auth-Token data has been lost");

            }
            catch(Exception e)
            {
                string mess = e.Message;
                if (mess.StartsWith("Auth-"))
                {
                    var rmess = mess.Split("-")[1];
                    return BadRequest(new { message = rmess });
                }
                Console.WriteLine("Get media controller: " + mess);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again!" });
            }

            // Check media
            try
            {
                var result = new Dictionary<string, string>();
                if(t == "media")
                {
                    result = await _fileService.GetPathMedia(userId, id);
                }
                else
                {

                }
                var path = result.GetValueOrDefault("path");
                var contentType = result.GetValueOrDefault("contentType");

                var filePath = Path.Combine(_environment.WebRootPath, path);
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new {message = "File not found"});
                }

                var fileStream = System.IO.File.OpenRead(filePath);

                return File(fileStream, contentType);
            }
            catch (Exception ex) 
            {
                string mess = ex.Message;
                if(mess.StartsWith("File-"))
                {
                    var rmess = mess.Split("-")[1];
                    return BadRequest(new {message= rmess });
                }
                Console.WriteLine("Get media controller: " + mess);
                return StatusCode(StatusCodes.Status500InternalServerError, new {message = "Server error. Try again!"});
            }

            return Ok(new { t, id });
        }
    }
}
