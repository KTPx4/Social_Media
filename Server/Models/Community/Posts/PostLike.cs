﻿using Server.Models.Account;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.Community.Posts
{
    [Table("PostLikes")]
    public class PostLike
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public DateTime CreatedAt { get; set; }

        public Post Post { get; set; }
        public User User { get; set; }


    }
}
