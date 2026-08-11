using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class MenuDbContext : DbContext
    {
        public MenuDbContext(DbContextOptions<MenuDbContext> options) : base(options)
        {
        }

        public DbSet<MenuItem> MenuItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Map to the singular table name 'MenuItem' as specified
            modelBuilder.Entity<MenuItem>().ToTable("MenuItem");
        }
    }
}
