using Microsoft.EntityFrameworkCore;
using StaffService.Models;

namespace StaffService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        public DbSet<Staff> Staffs { get; set; }
    }
}