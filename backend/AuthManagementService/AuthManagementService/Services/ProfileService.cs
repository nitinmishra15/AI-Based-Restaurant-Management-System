using System;
using System.Threading.Tasks;
using AuthManagementService.DTOs;
using AuthManagementService.Repositories;

namespace AuthManagementService.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _userRepository;

        public ProfileService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ProfileResponseDto?> GetProfileAsync(int id, string role)
        {
            if (string.Equals(role, "User", StringComparison.OrdinalIgnoreCase))
            {
                var customer = await _userRepository.GetCustomerByIdAsync(id);
                if (customer == null) return null;

                return new ProfileResponseDto
                {
                    Id = customer.Id.ToString(),
                    Name = customer.Name,
                    Email = customer.Email,
                    Mobile = customer.MobileNumber,
                    Role = "User"
                };
            }
            else
            {
                var staff = await _userRepository.GetStaffByIdAsync(id);
                if (staff == null) return null;

                return new ProfileResponseDto
                {
                    Id = staff.Id.ToString(),
                    Name = staff.Username,
                    Email = staff.Email,
                    Mobile = staff.MobileNumber,
                    Role = staff.Role
                };
            }
        }

        public async Task<bool> UpdateProfileAsync(int id, string role, ProfileUpdateDto dto)
        {
            if (string.Equals(role, "User", StringComparison.OrdinalIgnoreCase))
            {
                var customer = await _userRepository.GetCustomerByIdAsync(id);
                if (customer == null) return false;

                customer.Name = dto.Name;
                customer.Email = dto.Email;
                customer.MobileNumber = dto.Mobile;

                await _userRepository.UpdateCustomerAsync(customer);
            }
            else
            {
                var staff = await _userRepository.GetStaffByIdAsync(id);
                if (staff == null) return false;

                staff.Username = dto.Name;
                staff.Email = dto.Email;
                staff.MobileNumber = dto.Mobile;

                await _userRepository.UpdateStaffAsync(staff);
            }

            return await _userRepository.SaveChangesAsync();
        }
    }
}
