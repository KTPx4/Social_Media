using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using static Server.Models.Account.UserNotify;

namespace Server.DTOs.Notify
{
    public class NotifyResponse
    {
         

        [Key]
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public TypeNotify Type { get; set; }
        public Guid TargetId { get; set; }
        public Guid DestinationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsSeen { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public string InteractProfile { get; set; }
        
        public NotifyResponse(UserNotify userNotify, string host) 
        {
            Id = userNotify.Id;
            UserId = userNotify.UserId;
            Type = userNotify.Type;
            TargetId = userNotify.TargetId;
            this.DestinationId = userNotify.DestinationId;
            CreatedAt = userNotify.CreatedAt;
            IsSeen = userNotify.IsSeen;
            Content = userNotify.Content;
            ImageUrl = $"{host}/{userNotify.Interact?.Id}/{userNotify.Interact?.ImageUrl}";
            InteractProfile = userNotify.Interact?.UserProfile;
        }
    }
}
