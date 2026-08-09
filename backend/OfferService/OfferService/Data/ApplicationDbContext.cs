using Microsoft.EntityFrameworkCore;
using OfferService.Models;

namespace OfferService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Offer> Offers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Entity constraints
            modelBuilder.Entity<Offer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
                entity.Property(e => e.DiscountType).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CouponCode).HasMaxLength(50);
                entity.Property(e => e.ApplicableCategory).HasMaxLength(100);
            });

            // Seed initial data for Offer
            modelBuilder.Entity<Offer>().HasData(
                new Offer 
                { 
                    Id = 1, 
                    Title = "Flat 20% OFF on Starters", 
                    Description = "Get 20% discount on all starters above ₹299", 
                    DiscountType = "Percentage", 
                    DiscountValue = 20m, 
                    MinOrderAmount = 299m, 
                    StartDate = new DateTime(2026, 1, 1), 
                    EndDate = new DateTime(2026, 12, 31), 
                    CouponCode = "WELCOME20", 
                    ApplicableCategory = "Starters", 
                    IsActive = true 
                },
                new Offer 
                { 
                    Id = 2, 
                    Title = "Weekend Feast ₹100 OFF", 
                    Description = "Flat ₹100 discount on orders above ₹500", 
                    DiscountType = "Fixed", 
                    DiscountValue = 100m, 
                    MinOrderAmount = 500m, 
                    StartDate = new DateTime(2026, 1, 1), 
                    EndDate = new DateTime(2026, 12, 31), 
                    CouponCode = "FEAST100", 
                    ApplicableCategory = "All", 
                    IsActive = true 
                }
            );
        }
    }
}
