using Microsoft.EntityFrameworkCore;

namespace DAL;

public class SchoolDbContext : DbContext
{
    public DbSet<Student> Students { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Using SQLite so it works easily on your Mac
        optionsBuilder.UseSqlite("Data Source=SchoolDatabase.db");
    }
}