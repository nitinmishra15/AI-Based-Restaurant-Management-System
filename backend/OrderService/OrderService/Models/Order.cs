using System.ComponentModel.DataAnnotations;

namespace OrderService.Models
{
    // order entity model
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int TableId { get; set; }

        [Required]
        public string OrderItems { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? Notes { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public string Duration { get; set; } = string.Empty;

        [Required]
        public string PaymentStatus { get; set; } = "Pending";

        public string? TransactionId { get; set; }

        public string? PaymentMethod { get; set; }
    }
}
