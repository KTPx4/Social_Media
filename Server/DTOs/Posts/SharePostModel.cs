using static Server.Models.Community.Posts.Post;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Posts
{
    public class SharePostModel
    {
        [AllowNull]
        public string Content { get; set; }
        [DefaultValue(0)]
        public PostStatus Status { get; set; }

    }
}
