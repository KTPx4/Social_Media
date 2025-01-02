using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Account
{
    public class UserLogin
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
