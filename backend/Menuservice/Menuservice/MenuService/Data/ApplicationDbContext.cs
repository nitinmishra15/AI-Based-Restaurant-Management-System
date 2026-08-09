using Microsoft.EntityFrameworkCore;
using MenuService.Models;

namespace MenuService.Data
{
    // Database context using Entity Framework Core for SQL Server
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets representing the tables
        public DbSet<Category> Categories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map Entity class names to database table names
            modelBuilder.Entity<Category>().ToTable("Category");
            modelBuilder.Entity<MenuItem>().ToTable("MenuItem");

            // Configure Price column precision (18, 2)
            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Price)
                .HasColumnType("decimal(18,2)");

            // Configure one-to-many relationship
            modelBuilder.Entity<MenuItem>()
                .HasOne(m => m.Category)
                .WithMany(c => c.MenuItems)
                .HasForeignKey(m => m.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
