using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MenuService.Models
{
    // MenuItem database entity mapping to MenuItem table
    public class MenuItem
    {
        // Primary key
        public int Id { get; set; }

        // Name of the menu item
        [Required]
        [StringLength(150)]
        public string ItemName { get; set; } = string.Empty;

        // Price of the menu item
        [Required]
        [Range(0.01, 10000.00)]
        public decimal Price { get; set; }

        // Description of the menu item
        public string? Description { get; set; }

        // Availability status
        public bool Status { get; set; }

        // URL or file path of the uploaded image
        public string? ImageUrl { get; set; }

        // Foreign key referencing Category table
        [Required]
        public int CategoryId { get; set; }

        // Navigation property to parent Category
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}
