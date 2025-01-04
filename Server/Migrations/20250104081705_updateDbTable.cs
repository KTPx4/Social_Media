using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateDbTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentReaction_PostComment_CommentId",
                table: "CommentReaction");

            migrationBuilder.DropForeignKey(
                name: "FK_CommentReaction_User_UserId",
                table: "CommentReaction");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvMember_Conversation_ConversationId",
                table: "ConvMember");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvMember_User_UserId",
                table: "ConvMember");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvSetting_Conversation_ConversationId",
                table: "ConvSetting");

            migrationBuilder.DropForeignKey(
                name: "FK_Follow_User_FollowerId",
                table: "Follow");

            migrationBuilder.DropForeignKey(
                name: "FK_Follow_User_UserId",
                table: "Follow");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendShip_User_FriendId",
                table: "FriendShip");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendShip_User_UserId",
                table: "FriendShip");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Message_ReplyMessageId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_User_SenderId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReaction_Message_MessageId",
                table: "MessageReaction");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReaction_User_UserId",
                table: "MessageReaction");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageSeen_Message_MessageId",
                table: "MessageSeen");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageSeen_User_UserId",
                table: "MessageSeen");

            migrationBuilder.DropForeignKey(
                name: "FK_Post_Post_PostShareId",
                table: "Post");

            migrationBuilder.DropForeignKey(
                name: "FK_Post_User_AuthorId",
                table: "Post");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_PostComment_ReplyCommentId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_Post_PostId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_User_UserId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_Post_PostId",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_User_UserId",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PostMedia_Post_PostId",
                table: "PostMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_PostMediaUpdate_PostUpdate_PostUpdateId",
                table: "PostMediaUpdate");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSave_Post_PostId",
                table: "PostSave");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSave_User_UserId",
                table: "PostSave");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdate_Post_PostId",
                table: "PostUpdate");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdate_Post_PostShareId",
                table: "PostUpdate");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdate_User_AuthorId",
                table: "PostUpdate");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTag_PostUpdate_PostUpdateId",
                table: "PostUserTag");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTag_Post_PostId",
                table: "PostUserTag");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTag_User_UserId",
                table: "PostUserTag");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_Staff_StaffResolveId",
                table: "Report");

            migrationBuilder.DropForeignKey(
                name: "FK_Story_User_AuthorId",
                table: "Story");

            migrationBuilder.DropForeignKey(
                name: "FK_StorySeen_Story_StoryId",
                table: "StorySeen");

            migrationBuilder.DropForeignKey(
                name: "FK_StorySeen_User_UserId",
                table: "StorySeen");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotify_User_UserId",
                table: "UserNotify");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSetting_User_UserId",
                table: "UserSetting");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSetting",
                table: "UserSetting");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotify",
                table: "UserNotify");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StorySeen",
                table: "StorySeen");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Story",
                table: "Story");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Staff",
                table: "Staff");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Report",
                table: "Report");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostUserTag",
                table: "PostUserTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostUpdate",
                table: "PostUpdate");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostSave",
                table: "PostSave");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostMediaUpdate",
                table: "PostMediaUpdate");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostMedia",
                table: "PostMedia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostComment",
                table: "PostComment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Post",
                table: "Post");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageSeen",
                table: "MessageSeen");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReaction",
                table: "MessageReaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Message",
                table: "Message");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendShip",
                table: "FriendShip");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Follow",
                table: "Follow");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConvSetting",
                table: "ConvSetting");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConvMember",
                table: "ConvMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Conversation",
                table: "Conversation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CommentReaction",
                table: "CommentReaction");

            migrationBuilder.RenameTable(
                name: "UserSetting",
                newName: "UserSettings");

            migrationBuilder.RenameTable(
                name: "UserNotify",
                newName: "UserNotifys");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "StorySeen",
                newName: "StorySeens");

            migrationBuilder.RenameTable(
                name: "Story",
                newName: "Storys");

            migrationBuilder.RenameTable(
                name: "Staff",
                newName: "Staffs");

            migrationBuilder.RenameTable(
                name: "Report",
                newName: "Reports");

            migrationBuilder.RenameTable(
                name: "PostUserTag",
                newName: "PostUserTags");

            migrationBuilder.RenameTable(
                name: "PostUpdate",
                newName: "PostUpdates");

            migrationBuilder.RenameTable(
                name: "PostSave",
                newName: "PostSaves");

            migrationBuilder.RenameTable(
                name: "PostMediaUpdate",
                newName: "PostMediaUpdates");

            migrationBuilder.RenameTable(
                name: "PostMedia",
                newName: "PostMedias");

            migrationBuilder.RenameTable(
                name: "PostLike",
                newName: "PostLikes");

            migrationBuilder.RenameTable(
                name: "PostComment",
                newName: "PostComments");

            migrationBuilder.RenameTable(
                name: "Post",
                newName: "Posts");

            migrationBuilder.RenameTable(
                name: "MessageSeen",
                newName: "MessageSeens");

            migrationBuilder.RenameTable(
                name: "MessageReaction",
                newName: "MessageReactions");

            migrationBuilder.RenameTable(
                name: "Message",
                newName: "Messages");

            migrationBuilder.RenameTable(
                name: "FriendShip",
                newName: "FriendShips");

            migrationBuilder.RenameTable(
                name: "Follow",
                newName: "Follows");

            migrationBuilder.RenameTable(
                name: "ConvSetting",
                newName: "ConvSettings");

            migrationBuilder.RenameTable(
                name: "ConvMember",
                newName: "ConvMembers");

            migrationBuilder.RenameTable(
                name: "Conversation",
                newName: "Conversations");

            migrationBuilder.RenameTable(
                name: "CommentReaction",
                newName: "CommentReactions");

            migrationBuilder.RenameIndex(
                name: "IX_UserSetting_UserId",
                table: "UserSettings",
                newName: "IX_UserSettings_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotify_UserId",
                table: "UserNotifys",
                newName: "IX_UserNotifys_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_StorySeen_UserId",
                table: "StorySeens",
                newName: "IX_StorySeens_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Story_AuthorId",
                table: "Storys",
                newName: "IX_Storys_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_Report_StaffResolveId",
                table: "Reports",
                newName: "IX_Reports_StaffResolveId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTag_UserId",
                table: "PostUserTags",
                newName: "IX_PostUserTags_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTag_PostUpdateId",
                table: "PostUserTags",
                newName: "IX_PostUserTags_PostUpdateId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTag_PostId",
                table: "PostUserTags",
                newName: "IX_PostUserTags_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdate_PostShareId",
                table: "PostUpdates",
                newName: "IX_PostUpdates_PostShareId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdate_PostId",
                table: "PostUpdates",
                newName: "IX_PostUpdates_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdate_AuthorId",
                table: "PostUpdates",
                newName: "IX_PostUpdates_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_PostSave_UserId",
                table: "PostSaves",
                newName: "IX_PostSaves_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostSave_PostId",
                table: "PostSaves",
                newName: "IX_PostSaves_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostMediaUpdate_PostUpdateId",
                table: "PostMediaUpdates",
                newName: "IX_PostMediaUpdates_PostUpdateId");

            migrationBuilder.RenameIndex(
                name: "IX_PostMedia_PostId",
                table: "PostMedias",
                newName: "IX_PostMedias_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostLike_UserId",
                table: "PostLikes",
                newName: "IX_PostLikes_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostLike_PostId",
                table: "PostLikes",
                newName: "IX_PostLikes_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_UserId",
                table: "PostComments",
                newName: "IX_PostComments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_ReplyCommentId",
                table: "PostComments",
                newName: "IX_PostComments_ReplyCommentId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComment_PostId",
                table: "PostComments",
                newName: "IX_PostComments_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_Post_PostShareId",
                table: "Posts",
                newName: "IX_Posts_PostShareId");

            migrationBuilder.RenameIndex(
                name: "IX_Post_AuthorId",
                table: "Posts",
                newName: "IX_Posts_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageSeen_UserId",
                table: "MessageSeens",
                newName: "IX_MessageSeens_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReaction_UserId",
                table: "MessageReactions",
                newName: "IX_MessageReactions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Message_SenderId",
                table: "Messages",
                newName: "IX_Messages_SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Message_ReplyMessageId",
                table: "Messages",
                newName: "IX_Messages_ReplyMessageId");

            migrationBuilder.RenameIndex(
                name: "IX_Message_ConversationId",
                table: "Messages",
                newName: "IX_Messages_ConversationId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendShip_FriendId",
                table: "FriendShips",
                newName: "IX_FriendShips_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_Follow_FollowerId",
                table: "Follows",
                newName: "IX_Follows_FollowerId");

            migrationBuilder.RenameIndex(
                name: "IX_ConvMember_UserId",
                table: "ConvMembers",
                newName: "IX_ConvMembers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentReaction_UserId",
                table: "CommentReactions",
                newName: "IX_CommentReactions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentReaction_CommentId",
                table: "CommentReactions",
                newName: "IX_CommentReactions_CommentId");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "StorySeens",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "Storys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Staffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Staffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ReportType",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Reason",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Details",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostUpdates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostMediaUpdates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostMediaUpdates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostMedias",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostMedias",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostComments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostComments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "MessageReactions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "CommentReactions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSettings",
                table: "UserSettings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotifys",
                table: "UserNotifys",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StorySeens",
                table: "StorySeens",
                columns: new[] { "StoryId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Storys",
                table: "Storys",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staffs",
                table: "Staffs",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reports",
                table: "Reports",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostUserTags",
                table: "PostUserTags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostUpdates",
                table: "PostUpdates",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostSaves",
                table: "PostSaves",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostMediaUpdates",
                table: "PostMediaUpdates",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostMedias",
                table: "PostMedias",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostComments",
                table: "PostComments",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Posts",
                table: "Posts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageSeens",
                table: "MessageSeens",
                columns: new[] { "MessageId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReactions",
                table: "MessageReactions",
                columns: new[] { "MessageId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendShips",
                table: "FriendShips",
                columns: new[] { "UserId", "FriendId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Follows",
                table: "Follows",
                columns: new[] { "UserId", "FollowerId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConvSettings",
                table: "ConvSettings",
                column: "ConversationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConvMembers",
                table: "ConvMembers",
                columns: new[] { "ConversationId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Conversations",
                table: "Conversations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CommentReactions",
                table: "CommentReactions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReactions_PostComments_CommentId",
                table: "CommentReactions",
                column: "CommentId",
                principalTable: "PostComments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReactions_Users_UserId",
                table: "CommentReactions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ConvMembers_Conversations_ConversationId",
                table: "ConvMembers",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ConvMembers_Users_UserId",
                table: "ConvMembers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ConvSettings_Conversations_ConversationId",
                table: "ConvSettings",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_FollowerId",
                table: "Follows",
                column: "FollowerId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendShips_Users_FriendId",
                table: "FriendShips",
                column: "FriendId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendShips_Users_UserId",
                table: "FriendShips",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactions_Messages_MessageId",
                table: "MessageReactions",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactions_Users_UserId",
                table: "MessageReactions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_ReplyMessageId",
                table: "Messages",
                column: "ReplyMessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageSeens_Messages_MessageId",
                table: "MessageSeens",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageSeens_Users_UserId",
                table: "MessageSeens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_PostComments_ReplyCommentId",
                table: "PostComments",
                column: "ReplyCommentId",
                principalTable: "PostComments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_Posts_PostId",
                table: "PostComments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComments_Users_UserId",
                table: "PostComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                table: "PostLikes",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLikes_Users_UserId",
                table: "PostLikes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostMedias_Posts_PostId",
                table: "PostMedias",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostMediaUpdates_PostUpdates_PostUpdateId",
                table: "PostMediaUpdates",
                column: "PostUpdateId",
                principalTable: "PostUpdates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts",
                column: "PostShareId",
                principalTable: "Posts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_AuthorId",
                table: "Posts",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSaves_Posts_PostId",
                table: "PostSaves",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSaves_Users_UserId",
                table: "PostSaves",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdates_Posts_PostId",
                table: "PostUpdates",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdates_Posts_PostShareId",
                table: "PostUpdates",
                column: "PostShareId",
                principalTable: "Posts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdates_Users_AuthorId",
                table: "PostUpdates",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTags_PostUpdates_PostUpdateId",
                table: "PostUserTags",
                column: "PostUpdateId",
                principalTable: "PostUpdates",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTags_Posts_PostId",
                table: "PostUserTags",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTags_Users_UserId",
                table: "PostUserTags",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Staffs_StaffResolveId",
                table: "Reports",
                column: "StaffResolveId",
                principalTable: "Staffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Storys_Users_AuthorId",
                table: "Storys",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StorySeens_Storys_StoryId",
                table: "StorySeens",
                column: "StoryId",
                principalTable: "Storys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StorySeens_Users_UserId",
                table: "StorySeens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifys_Users_UserId",
                table: "UserNotifys",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSettings_Users_UserId",
                table: "UserSettings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentReactions_PostComments_CommentId",
                table: "CommentReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CommentReactions_Users_UserId",
                table: "CommentReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvMembers_Conversations_ConversationId",
                table: "ConvMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvMembers_Users_UserId",
                table: "ConvMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ConvSettings_Conversations_ConversationId",
                table: "ConvSettings");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_FollowerId",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendShips_Users_FriendId",
                table: "FriendShips");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendShips_Users_UserId",
                table: "FriendShips");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactions_Messages_MessageId",
                table: "MessageReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactions_Users_UserId",
                table: "MessageReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_ReplyMessageId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageSeens_Messages_MessageId",
                table: "MessageSeens");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageSeens_Users_UserId",
                table: "MessageSeens");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_PostComments_ReplyCommentId",
                table: "PostComments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_Posts_PostId",
                table: "PostComments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostComments_Users_UserId",
                table: "PostComments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                table: "PostLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLikes_Users_UserId",
                table: "PostLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_PostMedias_Posts_PostId",
                table: "PostMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_PostMediaUpdates_PostUpdates_PostUpdateId",
                table: "PostMediaUpdates");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_AuthorId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSaves_Posts_PostId",
                table: "PostSaves");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSaves_Users_UserId",
                table: "PostSaves");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdates_Posts_PostId",
                table: "PostUpdates");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdates_Posts_PostShareId",
                table: "PostUpdates");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUpdates_Users_AuthorId",
                table: "PostUpdates");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTags_PostUpdates_PostUpdateId",
                table: "PostUserTags");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTags_Posts_PostId",
                table: "PostUserTags");

            migrationBuilder.DropForeignKey(
                name: "FK_PostUserTags_Users_UserId",
                table: "PostUserTags");

            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Staffs_StaffResolveId",
                table: "Reports");

            migrationBuilder.DropForeignKey(
                name: "FK_Storys_Users_AuthorId",
                table: "Storys");

            migrationBuilder.DropForeignKey(
                name: "FK_StorySeens_Storys_StoryId",
                table: "StorySeens");

            migrationBuilder.DropForeignKey(
                name: "FK_StorySeens_Users_UserId",
                table: "StorySeens");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifys_Users_UserId",
                table: "UserNotifys");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSettings_Users_UserId",
                table: "UserSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSettings",
                table: "UserSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotifys",
                table: "UserNotifys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StorySeens",
                table: "StorySeens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Storys",
                table: "Storys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Staffs",
                table: "Staffs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reports",
                table: "Reports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostUserTags",
                table: "PostUserTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostUpdates",
                table: "PostUpdates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostSaves",
                table: "PostSaves");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Posts",
                table: "Posts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostMediaUpdates",
                table: "PostMediaUpdates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostMedias",
                table: "PostMedias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostComments",
                table: "PostComments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageSeens",
                table: "MessageSeens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReactions",
                table: "MessageReactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendShips",
                table: "FriendShips");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Follows",
                table: "Follows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConvSettings",
                table: "ConvSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ConvMembers",
                table: "ConvMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Conversations",
                table: "Conversations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CommentReactions",
                table: "CommentReactions");

            migrationBuilder.RenameTable(
                name: "UserSettings",
                newName: "UserSetting");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.RenameTable(
                name: "UserNotifys",
                newName: "UserNotify");

            migrationBuilder.RenameTable(
                name: "StorySeens",
                newName: "StorySeen");

            migrationBuilder.RenameTable(
                name: "Storys",
                newName: "Story");

            migrationBuilder.RenameTable(
                name: "Staffs",
                newName: "Staff");

            migrationBuilder.RenameTable(
                name: "Reports",
                newName: "Report");

            migrationBuilder.RenameTable(
                name: "PostUserTags",
                newName: "PostUserTag");

            migrationBuilder.RenameTable(
                name: "PostUpdates",
                newName: "PostUpdate");

            migrationBuilder.RenameTable(
                name: "PostSaves",
                newName: "PostSave");

            migrationBuilder.RenameTable(
                name: "Posts",
                newName: "Post");

            migrationBuilder.RenameTable(
                name: "PostMediaUpdates",
                newName: "PostMediaUpdate");

            migrationBuilder.RenameTable(
                name: "PostMedias",
                newName: "PostMedia");

            migrationBuilder.RenameTable(
                name: "PostLikes",
                newName: "PostLike");

            migrationBuilder.RenameTable(
                name: "PostComments",
                newName: "PostComment");

            migrationBuilder.RenameTable(
                name: "MessageSeens",
                newName: "MessageSeen");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "Message");

            migrationBuilder.RenameTable(
                name: "MessageReactions",
                newName: "MessageReaction");

            migrationBuilder.RenameTable(
                name: "FriendShips",
                newName: "FriendShip");

            migrationBuilder.RenameTable(
                name: "Follows",
                newName: "Follow");

            migrationBuilder.RenameTable(
                name: "ConvSettings",
                newName: "ConvSetting");

            migrationBuilder.RenameTable(
                name: "ConvMembers",
                newName: "ConvMember");

            migrationBuilder.RenameTable(
                name: "Conversations",
                newName: "Conversation");

            migrationBuilder.RenameTable(
                name: "CommentReactions",
                newName: "CommentReaction");

            migrationBuilder.RenameIndex(
                name: "IX_UserSettings_UserId",
                table: "UserSetting",
                newName: "IX_UserSetting_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifys_UserId",
                table: "UserNotify",
                newName: "IX_UserNotify_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_StorySeens_UserId",
                table: "StorySeen",
                newName: "IX_StorySeen_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Storys_AuthorId",
                table: "Story",
                newName: "IX_Story_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_Reports_StaffResolveId",
                table: "Report",
                newName: "IX_Report_StaffResolveId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTags_UserId",
                table: "PostUserTag",
                newName: "IX_PostUserTag_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTags_PostUpdateId",
                table: "PostUserTag",
                newName: "IX_PostUserTag_PostUpdateId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUserTags_PostId",
                table: "PostUserTag",
                newName: "IX_PostUserTag_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdates_PostShareId",
                table: "PostUpdate",
                newName: "IX_PostUpdate_PostShareId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdates_PostId",
                table: "PostUpdate",
                newName: "IX_PostUpdate_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostUpdates_AuthorId",
                table: "PostUpdate",
                newName: "IX_PostUpdate_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_PostSaves_UserId",
                table: "PostSave",
                newName: "IX_PostSave_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostSaves_PostId",
                table: "PostSave",
                newName: "IX_PostSave_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_PostShareId",
                table: "Post",
                newName: "IX_Post_PostShareId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_AuthorId",
                table: "Post",
                newName: "IX_Post_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_PostMediaUpdates_PostUpdateId",
                table: "PostMediaUpdate",
                newName: "IX_PostMediaUpdate_PostUpdateId");

            migrationBuilder.RenameIndex(
                name: "IX_PostMedias_PostId",
                table: "PostMedia",
                newName: "IX_PostMedia_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostLikes_UserId",
                table: "PostLike",
                newName: "IX_PostLike_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostLikes_PostId",
                table: "PostLike",
                newName: "IX_PostLike_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_UserId",
                table: "PostComment",
                newName: "IX_PostComment_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_ReplyCommentId",
                table: "PostComment",
                newName: "IX_PostComment_ReplyCommentId");

            migrationBuilder.RenameIndex(
                name: "IX_PostComments_PostId",
                table: "PostComment",
                newName: "IX_PostComment_PostId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageSeens_UserId",
                table: "MessageSeen",
                newName: "IX_MessageSeen_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_SenderId",
                table: "Message",
                newName: "IX_Message_SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ReplyMessageId",
                table: "Message",
                newName: "IX_Message_ReplyMessageId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ConversationId",
                table: "Message",
                newName: "IX_Message_ConversationId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReactions_UserId",
                table: "MessageReaction",
                newName: "IX_MessageReaction_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendShips_FriendId",
                table: "FriendShip",
                newName: "IX_FriendShip_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_Follows_FollowerId",
                table: "Follow",
                newName: "IX_Follow_FollowerId");

            migrationBuilder.RenameIndex(
                name: "IX_ConvMembers_UserId",
                table: "ConvMember",
                newName: "IX_ConvMember_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentReactions_UserId",
                table: "CommentReaction",
                newName: "IX_CommentReaction_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentReactions_CommentId",
                table: "CommentReaction",
                newName: "IX_CommentReaction_CommentId");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "StorySeen",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "Story",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReportType",
                table: "Report",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Reason",
                table: "Report",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Details",
                table: "Report",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostUpdate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Post",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostMediaUpdate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostMediaUpdate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostMedia",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostMedia",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MediaUrl",
                table: "PostComment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PostComment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Message",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "MessageReaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "React",
                table: "CommentReaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSetting",
                table: "UserSetting",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotify",
                table: "UserNotify",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StorySeen",
                table: "StorySeen",
                columns: new[] { "StoryId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Story",
                table: "Story",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staff",
                table: "Staff",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Report",
                table: "Report",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostUserTag",
                table: "PostUserTag",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostUpdate",
                table: "PostUpdate",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostSave",
                table: "PostSave",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Post",
                table: "Post",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostMediaUpdate",
                table: "PostMediaUpdate",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostMedia",
                table: "PostMedia",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostComment",
                table: "PostComment",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageSeen",
                table: "MessageSeen",
                columns: new[] { "MessageId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Message",
                table: "Message",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReaction",
                table: "MessageReaction",
                columns: new[] { "MessageId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendShip",
                table: "FriendShip",
                columns: new[] { "UserId", "FriendId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Follow",
                table: "Follow",
                columns: new[] { "UserId", "FollowerId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConvSetting",
                table: "ConvSetting",
                column: "ConversationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConvMember",
                table: "ConvMember",
                columns: new[] { "ConversationId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Conversation",
                table: "Conversation",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CommentReaction",
                table: "CommentReaction",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReaction_PostComment_CommentId",
                table: "CommentReaction",
                column: "CommentId",
                principalTable: "PostComment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReaction_User_UserId",
                table: "CommentReaction",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ConvMember_Conversation_ConversationId",
                table: "ConvMember",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ConvMember_User_UserId",
                table: "ConvMember",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ConvSetting_Conversation_ConversationId",
                table: "ConvSetting",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Follow_User_FollowerId",
                table: "Follow",
                column: "FollowerId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Follow_User_UserId",
                table: "Follow",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendShip_User_FriendId",
                table: "FriendShip",
                column: "FriendId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendShip_User_UserId",
                table: "FriendShip",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Message_ReplyMessageId",
                table: "Message",
                column: "ReplyMessageId",
                principalTable: "Message",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_User_SenderId",
                table: "Message",
                column: "SenderId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReaction_Message_MessageId",
                table: "MessageReaction",
                column: "MessageId",
                principalTable: "Message",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReaction_User_UserId",
                table: "MessageReaction",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageSeen_Message_MessageId",
                table: "MessageSeen",
                column: "MessageId",
                principalTable: "Message",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageSeen_User_UserId",
                table: "MessageSeen",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Post_Post_PostShareId",
                table: "Post",
                column: "PostShareId",
                principalTable: "Post",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Post_User_AuthorId",
                table: "Post",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_PostComment_ReplyCommentId",
                table: "PostComment",
                column: "ReplyCommentId",
                principalTable: "PostComment",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_Post_PostId",
                table: "PostComment",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_User_UserId",
                table: "PostComment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_Post_PostId",
                table: "PostLike",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_User_UserId",
                table: "PostLike",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostMedia_Post_PostId",
                table: "PostMedia",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostMediaUpdate_PostUpdate_PostUpdateId",
                table: "PostMediaUpdate",
                column: "PostUpdateId",
                principalTable: "PostUpdate",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSave_Post_PostId",
                table: "PostSave",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSave_User_UserId",
                table: "PostSave",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdate_Post_PostId",
                table: "PostUpdate",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdate_Post_PostShareId",
                table: "PostUpdate",
                column: "PostShareId",
                principalTable: "Post",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUpdate_User_AuthorId",
                table: "PostUpdate",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTag_PostUpdate_PostUpdateId",
                table: "PostUserTag",
                column: "PostUpdateId",
                principalTable: "PostUpdate",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTag_Post_PostId",
                table: "PostUserTag",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostUserTag_User_UserId",
                table: "PostUserTag",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Staff_StaffResolveId",
                table: "Report",
                column: "StaffResolveId",
                principalTable: "Staff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Story_User_AuthorId",
                table: "Story",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StorySeen_Story_StoryId",
                table: "StorySeen",
                column: "StoryId",
                principalTable: "Story",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StorySeen_User_UserId",
                table: "StorySeen",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotify_User_UserId",
                table: "UserNotify",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSetting_User_UserId",
                table: "UserSetting",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
