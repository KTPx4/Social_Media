using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Posts;
using Server.Models.Account;
using Server.Models.Community.Posts;
using Server.Modules;
using Server.Services.SPosts;


namespace Server.Controllers
{
    [Route("api/post")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly APIDbContext _context;
        private readonly PostService _postService;

        public PostsController(APIDbContext context , PostService postService)
        {
            _context = context;
            this._postService = postService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadFiles([FromForm] CreatePostModel createPostModel)
        {
            // Check valid file
            if (createPostModel.files == null || createPostModel.files.Count == 0)
            {
                return BadRequest(new {message ="Please chose at least 1 media file"});
            }

            if (createPostModel.files.Count > 5)
            {
                return BadRequest(new { message = "The limit is 5 media file" });
            }

            try
            {
                FileValidationHelper.IsValidListMedia(createPostModel.files);
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
                if(mess.StartsWith("File-"))
                {
                    var rmess = mess.Split("File-")[1];
                    return BadRequest(new { message = rmess });
                }

                Console.WriteLine(mess);
                return StatusCode(500, new {message = "Server error. Try again!"});
            }
           
            try
            {
                var listFileInfo = FileValidationHelper.GetFilesInfo(createPostModel.files);

                var userId = User.FindFirstValue("UserId");

                var rs = await _postService.CreatePost(userId, createPostModel, listFileInfo);
                
                return Ok(new
                {
                    message = "Create post success",
                    data = rs
                });
            }
            catch (Exception ex) 
            {
                var mess = ex.Message;
                if(mess.StartsWith("Create-"))
                {
                    return BadRequest(new { message = mess.Split("-")[1] });
                }
                Console.WriteLine( "Create Posts:"+ mess);
                return StatusCode(500, new { message = "Server Error. Try Again" });
            }
          

           
        }

    }
}
