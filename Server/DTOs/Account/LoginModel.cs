﻿using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Account
{
    public class LoginModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}