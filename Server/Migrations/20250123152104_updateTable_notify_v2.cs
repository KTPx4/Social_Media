using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateTable_notify_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifys_AspNetUsers_InteractId",
                table: "UserNotifys");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifys_AspNetUsers_UserId",
                table: "UserNotifys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotifys",
                table: "UserNotifys");

            migrationBuilder.RenameTable(
                name: "UserNotifys",
                newName: "UserNotifies");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifys_UserId",
                table: "UserNotifies",
                newName: "IX_UserNotifies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifys_InteractId",
                table: "UserNotifies",
                newName: "IX_UserNotifies_InteractId");

            migrationBuilder.AddColumn<Guid>(
                name: "DestinationId",
                table: "UserNotifies",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotifies",
                table: "UserNotifies",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifies_AspNetUsers_InteractId",
                table: "UserNotifies",
                column: "InteractId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifies_AspNetUsers_UserId",
                table: "UserNotifies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifies_AspNetUsers_InteractId",
                table: "UserNotifies");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifies_AspNetUsers_UserId",
                table: "UserNotifies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotifies",
                table: "UserNotifies");

            migrationBuilder.DropColumn(
                name: "DestinationId",
                table: "UserNotifies");

            migrationBuilder.RenameTable(
                name: "UserNotifies",
                newName: "UserNotifys");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifies_UserId",
                table: "UserNotifys",
                newName: "IX_UserNotifys_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifies_InteractId",
                table: "UserNotifys",
                newName: "IX_UserNotifys_InteractId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotifys",
                table: "UserNotifys",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifys_AspNetUsers_InteractId",
                table: "UserNotifys",
                column: "InteractId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifys_AspNetUsers_UserId",
                table: "UserNotifys",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
