using System.ComponentModel.DataAnnotations;

namespace MenuService.DTOs
{
    // DTO for creating a Category
    public class CategoryCreateDto
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;
    }

    // DTO for updating a Category
    public class CategoryUpdateDto
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;
    }

    // DTO for returning Category details
    public class CategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
