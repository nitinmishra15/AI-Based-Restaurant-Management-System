using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Data
{
    // database context class
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
    }
}
