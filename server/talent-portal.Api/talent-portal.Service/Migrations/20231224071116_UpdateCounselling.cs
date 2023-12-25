using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace talent_portal.Service.Migrations
{
    public partial class UpdateCounselling : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Counsellings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Counsellings");
        }
    }
}
