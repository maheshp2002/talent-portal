using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace talent_portal.Service.Migrations
{
    public partial class AddedResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_examResults_AspNetUsers_ApplicationUserId",
                table: "examResults");

            migrationBuilder.DropForeignKey(
                name: "FK_examResults_Jobs_JobId",
                table: "examResults");

            migrationBuilder.DropPrimaryKey(
                name: "PK_examResults",
                table: "examResults");

            migrationBuilder.RenameTable(
                name: "examResults",
                newName: "Results");

            migrationBuilder.RenameIndex(
                name: "IX_examResults_JobId",
                table: "Results",
                newName: "IX_Results_JobId");

            migrationBuilder.RenameIndex(
                name: "IX_examResults_ApplicationUserId",
                table: "Results",
                newName: "IX_Results_ApplicationUserId");

            migrationBuilder.AddColumn<string>(
                name: "ExamDate",
                table: "Results",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Results",
                table: "Results",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_AspNetUsers_ApplicationUserId",
                table: "Results",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Jobs_JobId",
                table: "Results",
                column: "JobId",
                principalTable: "Jobs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_AspNetUsers_ApplicationUserId",
                table: "Results");

            migrationBuilder.DropForeignKey(
                name: "FK_Results_Jobs_JobId",
                table: "Results");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Results",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "ExamDate",
                table: "Results");

            migrationBuilder.RenameTable(
                name: "Results",
                newName: "examResults");

            migrationBuilder.RenameIndex(
                name: "IX_Results_JobId",
                table: "examResults",
                newName: "IX_examResults_JobId");

            migrationBuilder.RenameIndex(
                name: "IX_Results_ApplicationUserId",
                table: "examResults",
                newName: "IX_examResults_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_examResults",
                table: "examResults",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_examResults_AspNetUsers_ApplicationUserId",
                table: "examResults",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_examResults_Jobs_JobId",
                table: "examResults",
                column: "JobId",
                principalTable: "Jobs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
