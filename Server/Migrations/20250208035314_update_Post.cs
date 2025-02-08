using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class update_Post : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts",
                column: "PostShareId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Posts_PostShareId",
                table: "Posts",
                column: "PostShareId",
                principalTable: "Posts",
                principalColumn: "Id");
        }
    }
}
