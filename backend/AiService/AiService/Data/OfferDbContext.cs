using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class OfferDbContext : DbContext
    {
        public OfferDbContext(DbContextOptions<OfferDbContext> options) : base(options)
        {
        }

        public DbSet<Offer> Offers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Map to Offers table in QrOfferDb
            modelBuilder.Entity<Offer>().ToTable("Offers");
        }
    }
}
