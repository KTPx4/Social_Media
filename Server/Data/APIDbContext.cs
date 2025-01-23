using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models.Account;
using Server.Models.Communication;
using Server.Models.Community.Posts;
using Server.Models.Community.PostsUpdates;
using Server.Models.Community.PostUpdates;
using Server.Models.Community.Story;
using Server.Models.RelationShip;
using Server.Models.Reports;


namespace Server.Data
{
    public class APIDbContext : IdentityDbContext<User, Role, Guid>
    {
        public APIDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users
            modelBuilder.Entity<User>(e =>
            {              
                e.HasKey(u => u.Id);
                e.Property(u => u.CreatedAt).HasDefaultValueSql("getutcdate()");

                e.Property(u => u.UserProfile).IsRequired(false);
                e.Property(u => u.Bio).IsRequired(false);
                e.Property(u => u.Name).IsRequired(false);
                e.Property(u => u.Gender).IsRequired(false);
                e.Property(u => u.Email).IsRequired(false);
                e.Property(u => u.Phone).IsRequired(false);
                e.Property(u => u.ImageUrl).IsRequired(false);

            });

            // Staff
            modelBuilder.Entity<Staff>(e =>
            {                 
                e.Property(u => u.CreatedAt).HasDefaultValueSql("getutcdate()");

                e.Property(u => u.UserProfile).IsRequired(false);
                e.Property(u => u.Bio).IsRequired(false);
                e.Property(u => u.Name).IsRequired(false);
                e.Property(u => u.Gender).IsRequired(false);
                e.Property(u => u.Email).IsRequired(false);
                e.Property(u => u.Phone).IsRequired(false);
                e.Property(u => u.ImageUrl).IsRequired(false);
            });

            // Report
            modelBuilder.Entity<Report>(entity =>
            {
                entity.Property(m => m.CreatedAt).HasDefaultValueSql("getutcdate()");
                entity.Property(m => m.ResolvedAt).HasDefaultValueSql("getutcdate()");

                entity.HasOne(r => r.StaffResolve)
                .WithMany(s => s.Reports)
                .HasForeignKey(r => r.StaffResolveId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            // follow
            modelBuilder.Entity<Follow>()
                .Property(f => f.CreatedAt).HasDefaultValueSql("getutcdate()");

            modelBuilder.Entity<Follow>()
             .HasKey(f => new { f.UserId, f.FollowerId }); // Khóa chính             

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.User)
                .WithMany(u => u.Followers) // Một user có nhiều người follow
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.Following) // Một user có thể follow nhiều người
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.NoAction);


            //notify
            modelBuilder.Entity<UserNotify>(e =>
            {
                e.HasOne(un => un.User)             // Một UserNotify có một Users
                    .WithMany(u => u.UserNotifies)     // Một Users có nhiều UserNotify
                    .HasForeignKey(un => un.UserId)    // Khóa ngoại là UserId
                    .OnDelete(DeleteBehavior.Cascade); // Cascade delete
                
                e.HasOne(un => un.Interact)
                .WithMany()
                .HasForeignKey(un => un.InteractId)
                .OnDelete(DeleteBehavior.NoAction);

                e.Property(un => un.CreatedAt).HasDefaultValueSql("getutcdate()");
                e.Property(un => un.IsSeen).HasDefaultValue(true);
                e.Property(un => un.Content).IsRequired(false);
            });


            // friendship
            modelBuilder.Entity<FriendShip>(entity =>
            {
                entity.HasKey(f => new { f.UserId, f.FriendId });

                entity.HasOne(f => f.User)
                        .WithMany(u => u.FriendShips)
                        .HasForeignKey(f => f.UserId)
                        .OnDelete(DeleteBehavior.NoAction);

                // Thiết lập quan hệ với Users qua FriendId
                entity.HasOne(f => f.Friend)
                      .WithMany() // Không tạo ICollection cho FriendId
                      .HasForeignKey(f => f.FriendId)
                      .OnDelete(DeleteBehavior.NoAction) ;
            });

            //Conversation
            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("getutcdate()");
            });
            // user as member in conv
            modelBuilder.Entity<ConvMember>(entity =>
            {
                entity.HasKey(m => new { m.ConversationId, m.UserId });

                entity.HasOne(m => m.User)
                    .WithMany(u => u.ConversationMembers)
                    .HasForeignKey(m => m.UserId)
                    .OnDelete(DeleteBehavior.Cascade);  // Đảm bảo xóa khi Users bị xóa

                entity.HasOne(m => m.Conversation)
                    .WithMany(c => c.Members)
                    .HasForeignKey(m => m.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);  // Đảm bảo xóa khi Conversation bị xóa
            });

            // Message
            modelBuilder.Entity<Message>(entity =>
            {
                entity.Property(m => m.CreatedAt).HasDefaultValueSql("getutcdate()");
                // relation with Conversation 1-n
                entity.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

                // relation with Users 1-n
                entity.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                 .OnDelete(DeleteBehavior.Cascade);

                // 1-n reply message
                entity.HasOne(m => m.ReplyMessage)
                .WithMany()
                .HasForeignKey(m => m.ReplyMessageId)
                .OnDelete(DeleteBehavior.Restrict);


            });
            // seen message
            modelBuilder.Entity<MessageSeen>(entity =>
            {
                entity.Property(s => s.CreatedAt).HasDefaultValueSql("getutcdate()");
                entity.HasKey(s => new { s.MessageId, s.UserId });

                entity.HasOne(s => s.Message)
                .WithMany(m => m.Seens)
                .HasForeignKey(s => s.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            });
            // react message
            modelBuilder.Entity<MessageReaction>(entity =>
            {
                entity.Property(s => s.CreatedAt).HasDefaultValueSql("getutcdate()");
                entity.HasKey(s => new { s.MessageId, s.UserId });

                entity.HasOne(s => s.Message)
                .WithMany(m => m.Reacts)
                .HasForeignKey(s => s.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            });

            // story
            modelBuilder.Entity<Story>(entity =>
            {
                entity.Property(s => s.CreatedAt).HasDefaultValueSql("getutcdate()");

                entity.HasOne(s => s.Author)
                        .WithMany(u => u.MyStories)
                        .HasForeignKey(s => s.AuthorId)
                         .OnDelete(DeleteBehavior.Cascade);

            });

            modelBuilder.Entity<StorySeen>(entity =>
            {
                entity.HasKey(ss => new { ss.StoryId, ss.UserId });
                entity.Property(ss => ss.CreatedAt).HasDefaultValueSql("getutcdate()");

                // 1-n  story
                entity.HasOne(ss => ss.Story)
                .WithMany(s => s.Seens)
                .HasForeignKey(ss => ss.StoryId)
                .OnDelete(DeleteBehavior.Cascade);

                // 1-n user
                entity.HasOne(ss => ss.User)
                   .WithMany()
                   .HasForeignKey(ss => ss.UserId)
                   .OnDelete(DeleteBehavior.NoAction);

            });


            // Post
            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("getutcdate()");
                // 1-n Post
                entity.HasOne(p => p.PostShare)
                .WithMany()
                .HasForeignKey(p => p.PostShareId)
                .OnDelete(DeleteBehavior.NoAction);

                // 1-n Users
                entity.HasOne(p => p.Author)
                .WithMany(u => u.MyPosts)
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PostUserTag>(entity =>
            {
                // 1-n Post
                entity.HasOne(t => t.Post)
                .WithMany(p => p.UserTags)
                .HasForeignKey(t => t.PostId)
                .OnDelete(DeleteBehavior.Cascade);
                // 1-n Users
                entity.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            });

            modelBuilder.Entity<PostSave>(entity =>
            {
                // 1-n Post
                entity.HasOne(s => s.Post)
                .WithMany()
                .HasForeignKey(s => s.PostId)
                .OnDelete(DeleteBehavior.Cascade);

                // 1-n Users
                entity.HasOne(s => s.User)
                .WithMany(u => u.PostSaveds)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            });

            modelBuilder.Entity<PostMedia>(entity =>
            {
                // 1-n Post
                entity.HasOne(m => m.Post)
                .WithMany(p => p.Medias)
                .HasForeignKey(m => m.PostId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("getutcdate()");

                entity.HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<PostComment>(entity =>
            {
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("getutcdate()");
               // 1-n post
                entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

                // 1-n reply comment
                entity.HasOne(c => c.ReplyComment)
                .WithMany()
                .HasForeignKey(c=> c.ReplyCommentId)
                .OnDelete(DeleteBehavior.NoAction);

                // 1-n user
                entity.HasOne(c => c.User)
               .WithMany()
               .HasForeignKey(l => l.UserId)
               .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<CommentReaction>(entity =>
            {
                // 1-n comment
                entity.HasOne(r => r.Comment)
                .WithMany(c => c.Reactions)
                .HasForeignKey(r => r.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

                // 1-n user
                entity.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);
            });


            // Post update
            modelBuilder.Entity<PostUpdate>(entity =>
            {
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("getutcdate()");
                // 1-n Post
                entity.HasOne(p => p.PostShare)
                .WithMany()
                .HasForeignKey(p => p.PostShareId)
                .OnDelete(DeleteBehavior.NoAction);

                // 1-n Users
                entity.HasOne(p => p.Author)
                .WithMany()
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(u => u.OriginPost)
                .WithMany(p => p.Updates)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PostMediaUpdate>(entity =>
            {
                // 1-n Post
                entity.HasOne(m => m.PostUpdate)
                .WithMany(p => p.Medias)
                .HasForeignKey(m => m.PostUpdateId)
                .OnDelete(DeleteBehavior.Cascade);
            });

        }
        
        public DbSet<User> Users { get; set; }  
        
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<UserNotify> UserNotifies { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }

        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConvMember> ConvMembers { get; set; }
        public DbSet<ConvSetting> ConvSettings { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageReaction> MessagesReactions { get; set; }
        public DbSet<MessageSeen> MessagesSeens { get; set; }

        public DbSet<CommentReaction> CommentReactions { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<PostMedia> PostMedias { get; set; }
        public DbSet<PostSave> PostSaves { get; set; }
        public DbSet<PostUserTag> PostUserTags { get; set; }
        
        public DbSet<PostMediaUpdate> PostMediaUpdates { get; set; }
        public DbSet<PostUpdate> PostUpdates { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<StorySeen> StoriesSeen { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<FriendShip> FriendShips { get; set; }
        public DbSet<Report> Reports { get; set; }
        
    }
}
