using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Server.DTOs.Account
{
    public class UpdateModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string UserProfile { get; set; }

        [AllowNull]
        public string Bio { get; set; }
        [Required]
        public string Name { get; set; }
        [AllowNull]
        public string Gender { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email!")]
        [Required]
        public string Email { get; set; }
        [AllowNull]
        public string Phone { get; set; }

    }
}
