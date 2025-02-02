using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace WindowsFormApp.Pages
{
    public class InstructorsModel : PageModel
    {
        public List<Dictionary<string, string>> InstructorList { get; set; } = new();
        private string connectionString = "Data Source=app.db";

        public void OnGet()
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                connection.Open();
                var createCmd = connection.CreateCommand();
                createCmd.CommandText = @"
                    CREATE TABLE IF NOT EXISTS tblInstructors (
                        InstructorID INTEGER PRIMARY KEY AUTOINCREMENT,
                        InstructorName TEXT NOT NULL,
                        DepartmentID INTEGER NOT NULL
                    )";
                createCmd.ExecuteNonQuery();

                var cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT InstructorID, InstructorName, DepartmentID FROM tblInstructors";
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        InstructorList.Add(new Dictionary<string, string> {
                            { "InstructorID", reader["InstructorID"].ToString() },
                            { "InstructorName", reader["InstructorName"].ToString() },
                            { "DepartmentID", reader["DepartmentID"].ToString() }
                        });
                    }
                }
            }
        }

        public IActionResult OnPostAdd(string InstructorName, int DepartmentID)
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                connection.Open();
                var cmd = connection.CreateCommand();
                cmd.CommandText = "INSERT INTO tblInstructors (InstructorName, DepartmentID) VALUES ($Name, $DeptID)";
                cmd.Parameters.AddWithValue("$Name", InstructorName);
                cmd.Parameters.AddWithValue("$DeptID", DepartmentID);
                cmd.ExecuteNonQuery();
            }
            return RedirectToPage();
        }

        public IActionResult OnPostDelete(int InstructorID)
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                connection.Open();
                var cmd = connection.CreateCommand();
                cmd.CommandText = "DELETE FROM tblInstructors WHERE InstructorID = $ID";
                cmd.Parameters.AddWithValue("$ID", InstructorID);
                cmd.ExecuteNonQuery();
            }
            return RedirectToPage();
        }
    }
}