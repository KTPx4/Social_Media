using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Account
{
    [Table("UserNotifys")]

    public class UserNotify
    {
        public enum TypeNotify
        {
            Post = 0, Comment = 1, Message = 2, Report = 3, System = 4
        }

        [Key]
        public Guid Id { get; set; }
        
        public Guid UserId { get; set; }
        public TypeNotify Type {  get; set; }
        public Guid TargetId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsSeen { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public User User { get; set; }
    }
}
