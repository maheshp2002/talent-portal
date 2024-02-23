using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace talent_portal.Service.Migrations
{
    public partial class UpdatedExamQuestionTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDescriptiveQuestion",
                table: "Questions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDescriptiveQuestion",
                table: "Questions");
        }
    }
}
