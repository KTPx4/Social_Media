using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Server.DTOs.Account
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }

        public string UserProfile { get; set; }
        public string Bio { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email!")]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ImageUrl { get; set; }

        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; }

        public UserResponse() { }
            
        public UserResponse(User user)
        {
            this.Id = user.Id;
            this.UserName = user.UserName;
            this.UserProfile = user.UserProfile;
            this.Bio = user.Bio;
            this.Name = user.Name;
            this.Gender = user.Gender;
            this.Email = user.Email;
            this.Phone = user.Phone;
            this.ImageUrl = user.ImageUrl;
            this.IsDeleted = user.IsDeleted;
            this.CreatedAt = user.CreatedAt;
        }
    }
}
