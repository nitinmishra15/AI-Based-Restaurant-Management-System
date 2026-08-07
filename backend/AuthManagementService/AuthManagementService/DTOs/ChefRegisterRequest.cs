using System.ComponentModel.DataAnnotations;

namespace AuthManagementService.DTOs
{
    public class ChefRegisterRequest
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile Number is required")]
        public string MobileNumber { get; set; } = string.Empty;

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string? Password { get; set; }

        public string Role { get; set; } = string.Empty;
        public string DutyPeriod { get; set; } = string.Empty;
        public bool IsOnDuty { get; set; } = true;
    }
}
