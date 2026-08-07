using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthManagementService.Services;

namespace AuthManagementService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(userRole))
            {
                return Unauthorized(new { message = "Invalid token or claims." });
            }

            if (!int.TryParse(userIdStr, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            var profile = await _profileService.GetProfileAsync(userId, userRole);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found." });
            }

            return Ok(profile);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] DTOs.ProfileUpdateDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(userRole))
            {
                return Unauthorized(new { message = "Invalid token or claims." });
            }

            if (!int.TryParse(userIdStr, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            var success = await _profileService.UpdateProfileAsync(userId, userRole, dto);
            if (!success)
            {
                return BadRequest(new { message = "Failed to update profile details." });
            }

            return Ok(new { message = "Profile updated successfully." });
        }
    }
}
