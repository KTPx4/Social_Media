using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Communication
{
    public class CreateGroupModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]        
        public List<string> Members { get; set; }
    }
}
