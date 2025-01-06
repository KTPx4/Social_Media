using static Server.Models.Community.Posts.PostMedia;

namespace Server.DTOs.Posts
{
    public class FileInfoDto
    {
        public string Name { get; set; }  // Tên file
        public MediaType Type { get; set; }  // MIME type (ContentType)
        public string ContentType { get; set; }  // MIME type (ContentType)
        public IFormFile File { get; set; }

    }
}
