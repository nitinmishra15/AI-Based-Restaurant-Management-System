using System.Collections.Generic;
using MenuService.DTOs;

namespace MenuService.Services.Interfaces
{
    // Interface for Category business actions
    public interface ICategoryService
    {
        // Get all categories mapped to DTOs
        IEnumerable<CategoryDto> GetAllCategories();

        // Get single category by ID mapped to DTO
        CategoryDto? GetCategoryById(int id);

        // Create new category using DTO
        CategoryDto CreateCategory(CategoryCreateDto categoryDto);

        // Update an existing category name
        bool UpdateCategory(int id, CategoryUpdateDto categoryDto);

        // Delete an existing category
        bool DeleteCategory(int id);
    }
}
