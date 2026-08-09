using System.Collections.Generic;
using MenuService.Models;

namespace MenuService.Repositories.Interfaces
{
    // Interface for database operations on Category table
    public interface ICategoryRepository
    {
        // Get all categories
        IEnumerable<Category> GetAll();

        // Find category by ID
        Category? GetById(int id);

        // Save a new category
        Category Add(Category category);

        // Update an existing category
        void Update(Category category);

        // Delete a category
        void Delete(Category category);
    }
}
