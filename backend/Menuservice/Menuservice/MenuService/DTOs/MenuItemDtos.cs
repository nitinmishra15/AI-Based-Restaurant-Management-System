using System.ComponentModel.DataAnnotations;

namespace MenuService.DTOs
{
    // DTO for creating a MenuItem
    public class MenuItemCreateDto
    {
        [Required(ErrorMessage = "Item name is required.")]
        [StringLength(150, ErrorMessage = "Item name cannot exceed 150 characters.")]
        public string ItemName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, 10000.00, ErrorMessage = "Price must be between 0.01 and 10000.00.")]
        public decimal Price { get; set; }

        public string? Description { get; set; }

        public bool Status { get; set; }

        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }
    }

    // DTO for updating a MenuItem
    public class MenuItemUpdateDto
    {
        [Required(ErrorMessage = "Item name is required.")]
        [StringLength(150, ErrorMessage = "Item name cannot exceed 150 characters.")]
        public string ItemName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, 10000.00, ErrorMessage = "Price must be between 0.01 and 10000.00.")]
        public decimal Price { get; set; }

        public string? Description { get; set; }

        public bool Status { get; set; }

        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }
    }

    // DTO for returning MenuItem details
    public class MenuItemDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public bool Status { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}
