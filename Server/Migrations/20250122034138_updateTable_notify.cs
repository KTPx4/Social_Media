using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class updateTable_notify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "UserNotifys");

            migrationBuilder.AddColumn<Guid>(
                name: "InteractId",
                table: "UserNotifys",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifys_InteractId",
                table: "UserNotifys",
                column: "InteractId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifys_AspNetUsers_InteractId",
                table: "UserNotifys",
                column: "InteractId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifys_AspNetUsers_InteractId",
                table: "UserNotifys");

            migrationBuilder.DropIndex(
                name: "IX_UserNotifys_InteractId",
                table: "UserNotifys");

            migrationBuilder.DropColumn(
                name: "InteractId",
                table: "UserNotifys");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "UserNotifys",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
