using System;

namespace AuthManagementService.DTOs
{
    public class CustomerLoginResponse
    {
        public bool IsRegistered { get; set; }
        
        public bool OtpSent { get; set; }
        
        public string? Token { get; set; }
        
        public DateTime? Expiration { get; set; }
        
        public UserDto? User { get; set; }
        
        public string Message { get; set; } = string.Empty;
    }
}
