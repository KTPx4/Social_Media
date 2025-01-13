using Server.DTOs.Posts;
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
        public IList<string> UserRoles { get; set; } = new List<string>();

        public int CountFollowers { get; set; } = 0;
        public int CountFollowings { get; set; } = 0;
        public int CountPosts {  get; set; } = 0;

        public List<PostResponse> Posts { get; set; } = new List<PostResponse> { };

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
            CheckExists(user, "");
        }

        public UserResponse(User user, string host, string publicUrl)
        {
            this.Id = user.Id;
            this.UserName = user.UserName;
            this.UserProfile = user.UserProfile;
            this.Bio = user.Bio;
            this.Name = user.Name;
            this.Gender = user.Gender;
            this.Email = user.Email;
            this.Phone = user.Phone;
            this.ImageUrl = $"{publicUrl}/{user.Id.ToString()}/{user.ImageUrl}";
            this.IsDeleted = user.IsDeleted;
            this.CreatedAt = user.CreatedAt;
            CheckExists(user, host);
        }

        public void CheckExists(User user, string host) 
        {
            var posts = user.MyPosts;
            var followers = user.Followers;
            var followings = user.Following;

            if ( posts != null && posts.Count > 0)
            {
                this.CountPosts = user.MyPosts.Count;
                var listPostRs = PostResponse.GetPostResponses(posts, host);
                this.Posts = listPostRs;
            }

            if( followers != null && followers.Count > 0)
            {
                this.CountFollowers = followers.Count;
            }

            if(followings != null && followings.Count > 0)
            {
                this.CountFollowings = followings.Count;
            }
            
        }
    }
}
