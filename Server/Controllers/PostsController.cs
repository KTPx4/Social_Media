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
        ////// post
        // create post
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostModel createPostModel)
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
        // get all my post
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllMyPost([FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var listRs = await _postService.GetAllMyPost(userId, page);

                return Ok(new { message = "Get success", data = listRs });
            }
            catch (Exception ex) {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }

        }
       
        // get post by id
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var rsPost = await _postService.GetById(userId, id);

                return Ok(new { message = "Get success", data = rsPost });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Get post by id: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(string id)
        {
            var userId = User.FindFirstValue("UserId");
            try
            {
                var rs = await _postService.DeletePost(userId, id);
                return Ok(new { message = "Delete post success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Delete post: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }

        // get like post
        [HttpGet("{id}/like")]
        [Authorize]
        public async Task<IActionResult> GetLike(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _postService.GetLike(userId, id);
                return Ok(new {message ="Get success", data = rs});
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Like post: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        
        // like post
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> LikePost(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var rsPost = await _postService.LikePost(userId, id);

                return NoContent();

            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Like post: " + ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        
        // unlike post
        [HttpPost("{id}/unlike")]
        [Authorize]
        public async Task<IActionResult> UnLikePost(string id)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var rsPost = await _postService.UnLikePost(userId, id);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }
                Console.WriteLine("Unlike post: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }



        /////////// comment /////////////
        // post comment - reply comment
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> CommentPost(string id, [FromBody] CommentModel commentModel)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _postService.CommentPost(userId, id, commentModel);
                return Ok(new { message = "Comment success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Comment post: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        
        //like comment 
        [HttpPost("{id}/comment/{idComment}/like")]
        public async Task<IActionResult> LikeComment(string id, string idComment)
        {
            try
            {
                var userid = User.FindFirstValue("UserId");
                var rs = await _postService.LikeComment(userid, idComment);
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Like comment: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }

            return NoContent();
        }
        
        // unlike comment
        [HttpPost("{id}/comment/{idComment}/unlike")]
        public async Task<IActionResult> UnLikeComment(string id, string idComment)
        {
            try
            {
                var userid = User.FindFirstValue("UserId");
                var rs = await _postService.UnLikeComment(userid, idComment);
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Like comment: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }

            return NoContent();
        }

       // get comment of post
        [HttpGet("{id}/comment")]
        public async Task<IActionResult> GetCommentPost(string id, [FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _postService.GetCommentPost(userId, id, page);
                return Ok(new { message = "Get comment success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Comment post: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
        
        // get child of comment
        [HttpGet("{id}/comment/{idComment}")]
        public async Task<IActionResult> GetReplyCommentPost(string id, string idComment, [FromQuery] int page = 1)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");
                var rs = await _postService.GetReplyCommentPost(userId, id, idComment, page);
                return Ok(new { message = "Get comment success", data = rs });
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Comment post: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }
       
       // delete comment
        [HttpDelete("{id}/comment/{idComment}")]
        public async Task<IActionResult> DeleteComment(string id, string idComment)
        {
            try
            {
                var userId = User.FindFirstValue("UserId");

                var rs = await _postService.DeleteComment(userId, idComment);

                return NoContent();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (message.StartsWith("Post-"))
                {
                    return BadRequest(new { message = message.Split("-")[1] });
                }

                Console.WriteLine("Comment post: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Server error. Try again" });
            }
        }


    }
}
