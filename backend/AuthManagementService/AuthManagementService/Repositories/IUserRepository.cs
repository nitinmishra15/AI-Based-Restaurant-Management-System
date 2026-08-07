using System.Collections.Generic;
using System.Threading.Tasks;
using AuthManagementService.Models;

namespace AuthManagementService.Repositories
{
    public interface IUserRepository
    {
        // Staff operations
        Task<Staff?> GetStaffByIdAsync(int id);
        Task<Staff?> GetStaffByUsernameAsync(string username);
        Task<Staff?> GetStaffByEmailAsync(string email);
        Task<IEnumerable<Staff>> GetAllStaffAsync();
        Task<Staff> AddStaffAsync(Staff staff);
        Task UpdateStaffAsync(Staff staff);
        Task DeleteStaffAsync(Staff staff);
        Task<bool> StaffExistsByUsernameOrEmailAsync(string username, string email);

        // Customer operations
        Task<Customer?> GetCustomerByIdAsync(int id);
        Task<Customer?> GetCustomerByMobileNumberAsync(string mobileNumber);
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer> AddCustomerAsync(Customer customer);
        Task UpdateCustomerAsync(Customer customer);
        Task DeleteCustomerAsync(Customer customer);
        Task<bool> CustomerExistsByUsernameOrEmailAsync(string name, string email);

        // General
        Task<bool> SaveChangesAsync();
    }
}
