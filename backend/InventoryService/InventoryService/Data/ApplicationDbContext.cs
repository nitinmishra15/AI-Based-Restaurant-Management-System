using Microsoft.EntityFrameworkCore;
using InventoryService.Models;

namespace InventoryService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Inventory> Inventories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Entity constraints
            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.InventoryName).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Category).HasMaxLength(100);
            });

            // Seed initial data for Inventory
            modelBuilder.Entity<Inventory>().HasData(
                new Inventory { Id = 1, InventoryName = "Chicken", Price = 220m, Qty = 25, Status = "In Stock", Category = "Meat", LowStockThreshold = 10 },
                new Inventory { Id = 2, InventoryName = "Paneer", Price = 350m, Qty = 5, Status = "Low Stock", Category = "Dairy", LowStockThreshold = 8 },
                new Inventory { Id = 3, InventoryName = "Rice", Price = 80m, Qty = 50, Status = "In Stock", Category = "Grains", LowStockThreshold = 20 },
                new Inventory { Id = 4, InventoryName = "Tomato", Price = 40m, Qty = 0, Status = "Out of Stock", Category = "Vegetables", LowStockThreshold = 5 },
                new Inventory { Id = 5, InventoryName = "Cooking Oil", Price = 150m, Qty = 15, Status = "In Stock", Category = "Grocery", LowStockThreshold = 5 }
            );
        }
    }
}
