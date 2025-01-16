using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using static Server.Models.Community.Posts.Post;

namespace Server.DTOs.Posts
{
    public class UpdatePostModel
    {
        [AllowNull]
        public List<string> Medias { get; set; }

        [AllowNull]
        public string Content { get; set; }
        
        [AllowNull]
        public List<string> tags { get; set; }

        [DefaultValue(0)]
        public PostType Type { get; set; }
        
        [AllowNull]
        public List<IFormFile> files { get; set; }

        [Required]
        public PostStatus Status { get; set; }
    }
}
