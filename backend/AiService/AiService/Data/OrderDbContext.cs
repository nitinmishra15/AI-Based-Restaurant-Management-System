using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Map to the Orders table
            modelBuilder.Entity<Order>().ToTable("Orders");
        }
    }
}
