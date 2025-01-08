using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using static Server.Models.Community.Posts.Post;
 
namespace Server.DTOs.Posts
{
    public class CreatePostModel
    {
        [AllowNull]
        public string Content { get; set; }
        //public Guid? PostShareId { get; set; }
      
        [DefaultValue(0)]
        public PostStatus Status { get; set; }
        
        [DefaultValue(0)]
        public PostType Type { get; set; }
        
        [Required]
        public List<IFormFile> files { get; set; }

        [AllowNull]
        public List<string> tags { get; set; }

    }
}
