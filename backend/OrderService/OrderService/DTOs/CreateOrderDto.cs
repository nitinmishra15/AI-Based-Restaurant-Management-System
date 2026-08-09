using System.ComponentModel.DataAnnotations;

namespace OrderService.DTOs
{
    // dto for creating a new order
    public class CreateOrderDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Table ID must be greater than 0")]
        public int TableId { get; set; }

        [Required(ErrorMessage = "Order items cannot be empty")]
        public string OrderItems { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        public string? Notes { get; set; }

        [Required(ErrorMessage = "Status cannot be empty")]
        public string Status { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }

        public string Duration { get; set; } = string.Empty;

        public string PaymentStatus { get; set; } = "Pending";

        public string? TransactionId { get; set; }

        public string? PaymentMethod { get; set; }

        public string? Email { get; set; }

        public string? CustomerName { get; set; }

        public string? MobileNumber { get; set; }
    }
}
