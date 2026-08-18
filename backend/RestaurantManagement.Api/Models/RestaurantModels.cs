using System.ComponentModel.DataAnnotations;

namespace RestaurantManagement.Api.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }

    public class Staff
    {
        [Key]
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Chef"; // Admin, Chef, Staff
        public string Department { get; set; } = "Kitchen";
        public string Shift { get; set; } = "Morning";
        public string Status { get; set; } = "Active";
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsOnDuty { get; set; } = true;
        public string DutyPeriod { get; set; } = string.Empty;
    }

    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }

    public class MenuItem
    {
        [Key]
        public int Id { get; set; }

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

        public string? CategoryName => Category?.CategoryName;

        [System.Text.Json.Serialization.JsonIgnore]
        public Category? Category { get; set; }

        public string? ImageUrl { get; set; }
    }

    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int TableId { get; set; } = 1;
        public string OrderItems { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";
        public int Quantity { get; set; } = 1;
        public string? Duration { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Inventory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string InventoryName { get; set; } = string.Empty;

        public string Category { get; set; } = "General";
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public string Status { get; set; } = "In Stock";
        public int LowStockThreshold { get; set; } = 5;
        public bool IsLowStock => Qty <= LowStockThreshold;
        public string Unit { get; set; } = "kg";
        public double DailyConsumptionRate { get; set; } = 1.0;
        public int LeadTimeDays { get; set; } = 2;
        public string SupplierName { get; set; } = "Fresh Farm Supplies";
        public decimal UnitCost { get; set; } = 50.0m;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    public class Offer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percentage";
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; } = DateTime.UtcNow.AddDays(30);
        public string? CouponCode { get; set; }
        public string ApplicableCategory { get; set; } = "All";
        public bool IsActive { get; set; } = true;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsExpired => DateTime.UtcNow > EndDate;
        public bool IsCurrentlyActive => IsActive && DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;
        public string Status => IsExpired ? "Expired" : (IsCurrentlyActive ? "Active" : "Inactive");
    }

    public class UserInteraction
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int MenuItemId { get; set; }
        public double Rating { get; set; } = 5.0;
        public string InteractionType { get; set; } = "Order";
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
