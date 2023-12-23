using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace talent_portal.Service.Migrations
{
    public partial class UpdatedExamResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalScore",
                table: "Results",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalScore",
                table: "Results");
        }
    }
}
