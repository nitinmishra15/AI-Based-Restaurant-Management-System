using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options)
        {
        }

        public DbSet<Inventory> Inventories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Map to Inventories table in QrDiningInventoryDb
            modelBuilder.Entity<Inventory>().ToTable("Inventories");
        }
    }
}
