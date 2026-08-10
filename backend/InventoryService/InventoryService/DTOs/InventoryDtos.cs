using System.ComponentModel.DataAnnotations;

namespace InventoryService.DTOs
{
    public class CreateInventoryDto
    {
        [Required(ErrorMessage = "Inventory name is required.")]
        [StringLength(150)]
        public string InventoryName { get; set; } = string.Empty;

        [Range(0, 9999999.99, ErrorMessage = "Price must be non-negative.")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative.")]
        public int Qty { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "In Stock";

        [StringLength(100)]
        public string Category { get; set; } = "General";

        public int LowStockThreshold { get; set; } = 5;
    }

    public class UpdateInventoryDto
    {
        [Required(ErrorMessage = "Inventory name is required.")]
        [StringLength(150)]
        public string InventoryName { get; set; } = string.Empty;

        [Range(0, 9999999.99, ErrorMessage = "Price must be non-negative.")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative.")]
        public int Qty { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "In Stock";

        [StringLength(100)]
        public string Category { get; set; } = "General";

        public int LowStockThreshold { get; set; } = 5;
    }

    public class InventoryResponseDto
    {
        public int Id { get; set; }
        public string InventoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int LowStockThreshold { get; set; }
        public bool IsLowStock { get; set; }
    }

    public record InventoryPredictionResponseDto(
        string Ingredient, 
        decimal DaysRemaining, 
        bool LowStockAlert, 
        int SuggestedReorderQuantity, 
        string ModelSource
    );
}
