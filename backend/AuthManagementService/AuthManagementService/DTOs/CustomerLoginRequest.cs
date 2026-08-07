using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace AuthManagementService.DTOs
{
    public class CustomerLoginRequest
    {
        [Required(ErrorMessage = "Mobile Number is required")]
        [Phone(ErrorMessage = "Invalid Mobile Number")]
        [JsonPropertyName("mobileNumber")]
        [JsonProperty("mobileNumber")]
        public string MobileNumber { get; set; } = string.Empty;

        [JsonPropertyName("username")]
        [JsonProperty("username")]
        public string? Username { get; set; } // Representing customer Name

        [JsonPropertyName("email")]
        [JsonProperty("email")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string? Email { get; set; }

        [JsonPropertyName("otp")]
        [JsonProperty("otp")]
        public string? Otp { get; set; }
    }
}
