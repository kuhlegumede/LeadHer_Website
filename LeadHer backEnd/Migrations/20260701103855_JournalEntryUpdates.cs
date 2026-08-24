using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApp_BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class JournalEntryUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BrainDump",
                table: "JournalEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gratitude",
                table: "JournalEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScripturePrayer",
                table: "JournalEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrainDump",
                table: "JournalEntries");

            migrationBuilder.DropColumn(
                name: "Gratitude",
                table: "JournalEntries");

            migrationBuilder.DropColumn(
                name: "ScripturePrayer",
                table: "JournalEntries");
        }
    }
}
