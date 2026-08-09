using System.ComponentModel.DataAnnotations;

namespace OrderService.DTOs
{
    // payment request details
    public class PaymentRequestDto
    {
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile Number is required")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Payment Method is required")]
        public string PaymentMethod { get; set; } = string.Empty; // e.g. "Card", "UPI", "NetBanking"
    }
}
