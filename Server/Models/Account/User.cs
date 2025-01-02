using Server.Models.Communication;
using Server.Models.Community.Posts;
using Server.Models.Community.Story;
using Server.Models.RelationShip;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Account
{

    [Table("User")]
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserProfile { get; set; }
        public string Bio {  get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email!")]
        public string Email { get; set; }
        public string Phone {  get; set; }
        public string ImageUrl { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }

        //Setting
        public UserSetting Setting { get; set; }


        // Navigation Properties
        public ICollection<Follow> Followers { get; set; } // Những người follow user này
        public ICollection<Follow> Following { get; set; } // Những người mà user này follow
              
        // Navigation property đến UserNotify
        public ICollection<UserNotify> UserNotifies { get; set; }

        public ICollection<FriendShip> FriendShips { get; set; }

        public ICollection<ConvMember> ConversationMembers { get; set; }

        public ICollection<Story> MyStories { get; set; }

        public ICollection<Post> MyPosts { get; set; }
        public ICollection<PostSave> PostSaveds { get; set; }


    }
}
