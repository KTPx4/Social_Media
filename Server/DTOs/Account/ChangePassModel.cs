using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Account
{
    public class ChangePassModel
    {
        [Required]
        public string OldPass { get; set; }
        [Required]
        [Length(6, 30)]
        public string NewPass { get; set; }

    }
}
