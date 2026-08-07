using System;

namespace AuthManagementService.Models
{
    public class Staff
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // "Admin" or "Chef"
        public string DutyPeriod { get; set; } = string.Empty;
        public bool IsOnDuty { get; set; } = true;
    }
}
