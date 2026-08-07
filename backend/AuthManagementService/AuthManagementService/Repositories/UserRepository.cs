using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AuthManagementService.Data;
using AuthManagementService.Models;

namespace AuthManagementService.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        // Staff CRUD
        public async Task<Staff?> GetStaffByIdAsync(int id)
        {
            return await _context.StaffMembers.FindAsync(id);
        }

        public async Task<Staff?> GetStaffByUsernameAsync(string username)
        {
            return await _context.StaffMembers
                .FirstOrDefaultAsync(s => s.Username.ToLower() == username.ToLower());
        }

        public async Task<Staff?> GetStaffByEmailAsync(string email)
        {
            return await _context.StaffMembers
                .FirstOrDefaultAsync(s => s.Email.ToLower() == email.ToLower());
        }

        public async Task<IEnumerable<Staff>> GetAllStaffAsync()
        {
            return await _context.StaffMembers.ToListAsync();
        }

        public async Task<Staff> AddStaffAsync(Staff staff)
        {
            await _context.StaffMembers.AddAsync(staff);
            return staff;
        }

        public async Task UpdateStaffAsync(Staff staff)
        {
            _context.Entry(staff).State = EntityState.Modified;
            await Task.CompletedTask;
        }

        public async Task DeleteStaffAsync(Staff staff)
        {
            _context.StaffMembers.Remove(staff);
            await Task.CompletedTask;
        }

        public async Task<bool> StaffExistsByUsernameOrEmailAsync(string username, string email)
        {
            return await _context.StaffMembers
                .AnyAsync(s => s.Username.ToLower() == username.ToLower() || s.Email.ToLower() == email.ToLower());
        }

        // Customer CRUD
        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer?> GetCustomerByMobileNumberAsync(string mobileNumber)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.MobileNumber == mobileNumber);
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> AddCustomerAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            return customer;
        }

        public async Task UpdateCustomerAsync(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            await Task.CompletedTask;
        }

        public async Task DeleteCustomerAsync(Customer customer)
        {
            _context.Customers.Remove(customer);
            await Task.CompletedTask;
        }

        public async Task<bool> CustomerExistsByUsernameOrEmailAsync(string name, string email)
        {
            return await _context.Customers
                .AnyAsync(c => c.Name.ToLower() == name.ToLower() || c.Email.ToLower() == email.ToLower());
        }

        // General
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
