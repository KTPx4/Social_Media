using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models.Account;
using Server.Models.Community.Posts;
using Server.Modules;
using Server.Services.SPosts;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly APIDbContext _context;
        private readonly PostService _postService;
        public PostsController(APIDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload-files")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UploadFiles([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(new {message ="Please chose at least 1 media file"});
            }

            if (files.Count > 5)
            {
                return BadRequest(new { message = "The limit is 5 media file" });
            }

            try
            {
                FileValidationHelper.IsValidListMedia(files);
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
           
            var listFileInfo = FileValidationHelper.GetFilesInfo(files);

            //// Lưu file vào thư mục đích
            //var uploadsFolder = Path.Combine(_RootImgAccount, userId);
            //if (!Directory.Exists(uploadsFolder))
            //{
            //    Directory.CreateDirectory(uploadsFolder);
            //}

            //var filePath = Path.Combine(uploadsFolder, file.FileName);

            //// Lưu file tạm
            //using (var stream = new FileStream(filePath, FileMode.Create))
            //{
            //    await file.CopyToAsync(stream);
            //}

            //// Xóa file tạm (nếu cần)
            //var tempFilePath = file.FileName; // File tạm của hệ thống.
            //if (System.IO.File.Exists(tempFilePath))
            //{
            //    System.IO.File.Delete(tempFilePath);
            //}

            return Ok($"Đã upload thành công {files.Count} file.");
        }

    }
}
