using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace RestaurantManagement.Api.DTOs
{
    // Auth DTOs
    public class CustomerLoginRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Otp { get; set; }
    }

    public class CustomerLoginResponse
    {
        public bool IsRegistered { get; set; }
        public bool OtpSent { get; set; }
        public string? Token { get; set; }
        public object? User { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class StaffLoginRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class StaffLoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public object User { get; set; } = new();
    }

    public class ChefRegisterRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string MobileNumber { get; set; } = string.Empty;

        public string? Password { get; set; }
        public string? Role { get; set; } = "Chef";
        public string? DutyPeriod { get; set; } = "Morning";
        public bool IsOnDuty { get; set; } = true;
    }

    public class ProfileUpdateDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
    }

    // Menu DTOs
    public class CategoryCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;
    }

    public class CategoryUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;
    }

    public class MenuItemCreateDto
    {
        [Required]
        [MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public bool Status { get; set; } = true;

        [Required]
        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }
    }

    public class MenuItemUpdateDto
    {
        [Required]
        [MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public bool Status { get; set; } = true;

        [Required]
        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }
    }

    // Order DTOs
    public class CreateOrderDto
    {
        public int TableId { get; set; }
        public string OrderItems { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";
        public int Quantity { get; set; } = 1;
        public string? Duration { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Email { get; set; }
        public string? CustomerName { get; set; }
        public string? MobileNumber { get; set; }
    }

    public class UpdateOrderDto
    {
        public int TableId { get; set; }
        public string OrderItems { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";
        public int Quantity { get; set; }
        public string? Duration { get; set; }
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public string OrderItems { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Duration { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
    }

    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "UPI";
    }

    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    // Inventory DTOs
    public class CreateInventoryDto
    {
        [Required]
        public string InventoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public string Status { get; set; } = "In Stock";
        public string Category { get; set; } = "General";
        public int LowStockThreshold { get; set; } = 5;
    }

    public class UpdateInventoryDto
    {
        [Required]
        public string InventoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public string Status { get; set; } = "In Stock";
        public string Category { get; set; } = "General";
        public int LowStockThreshold { get; set; } = 5;
    }

    // Offer DTOs
    public class CreateOfferDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percentage";
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? CouponCode { get; set; }
        public string ApplicableCategory { get; set; } = "All";
        public bool IsActive { get; set; } = true;
    }

    public class UpdateOfferDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percentage";
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? CouponCode { get; set; }
        public string ApplicableCategory { get; set; } = "All";
        public bool IsActive { get; set; } = true;
    }

    // Staff DTOs
    public class AddStaffDto
    {
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public IFormFile? Image { get; set; }
    }
}
