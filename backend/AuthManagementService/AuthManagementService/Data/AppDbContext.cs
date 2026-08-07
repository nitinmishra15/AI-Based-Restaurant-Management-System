using Microsoft.EntityFrameworkCore;
using AuthManagementService.Models;
using AuthManagementService.Helpers;
using System;

namespace AuthManagementService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Staff> StaffMembers { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Staff entity
            modelBuilder.Entity<Staff>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.MobileNumber).IsRequired().HasMaxLength(15);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
            });

            // Configure Customer entity
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.MobileNumber).IsRequired().HasMaxLength(15);
            });

            // Seed Staff members
            modelBuilder.Entity<Staff>().HasData(
                new Staff
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@restaurant.com",
                    MobileNumber = "1112223333",
                    PasswordHash = PasswordHelper.HashPassword("AdminPassword@123"),
                    Role = "Admin"
                },
                new Staff
                {
                    Id = 2,
                    Username = "chef_maria",
                    Email = "chef.maria@restaurant.com",
                    MobileNumber = "4445556666",
                    PasswordHash = PasswordHelper.HashPassword("ChefPassword@123"),
                    Role = "Chef"
                }
            );

            // Seed Customer
            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    Id = 1,
                    Name = "John Doe",
                    Email = "john.doe@gmail.com",
                    MobileNumber = "9876543210",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
