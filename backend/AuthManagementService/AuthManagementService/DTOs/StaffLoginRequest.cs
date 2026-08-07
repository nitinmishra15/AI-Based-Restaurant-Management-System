using System.ComponentModel.DataAnnotations;

namespace AuthManagementService.DTOs
{
    public class StaffLoginRequest
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}
