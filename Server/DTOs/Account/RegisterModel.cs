﻿using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Account
{
    public class RegisterModel
    {
        [Required]
        public String UserName { get; set; }
        [Required]

        [Length(6, 30)]
        public String Password { get; set; }
        [Required]
        [EmailAddress(ErrorMessage = "Invalid email")]
        public String Email { get; set; }
    }
}
