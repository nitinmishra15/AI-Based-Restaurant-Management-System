using System.Threading.Tasks;
using AuthManagementService.DTOs;

namespace AuthManagementService.Services
{
    public interface IProfileService
    {
        Task<ProfileResponseDto?> GetProfileAsync(int id, string role);
        Task<bool> UpdateProfileAsync(int id, string role, ProfileUpdateDto dto);
    }
}
