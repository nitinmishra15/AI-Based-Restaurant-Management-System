using System.Collections.Generic;
using System.Threading.Tasks;
using AuthManagementService.DTOs;

namespace AuthManagementService.Services
{
    public interface IAuthService
    {
        // Authentication methods
        Task<CustomerLoginResponse> CustomerLoginAsync(CustomerLoginRequest request);
        Task<LoginResponse?> StaffLoginAsync(StaffLoginRequest request);
        Task<UserDto?> CreateChefAsync(ChefRegisterRequest request);

        // Staff CRUD operations
        Task<IEnumerable<UserDto>> GetAllStaffAsync();
        Task<UserDto?> GetStaffByIdAsync(int id);
        Task<bool> UpdateStaffAsync(int id, ChefRegisterRequest request);
        Task<bool> DeleteStaffAsync(int id);

        // Customer CRUD operations
        Task<IEnumerable<UserDto>> GetAllCustomersAsync();
        Task<UserDto?> GetCustomerByIdAsync(int id);
        Task<bool> UpdateCustomerAsync(int id, CustomerLoginRequest request);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
