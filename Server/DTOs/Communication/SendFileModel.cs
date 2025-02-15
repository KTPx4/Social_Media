using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Communication
{
    public class SendFileModel
    {
        [Required]
        public IFormFile file { get; set; }
    }
}
