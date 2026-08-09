using System.Collections.Generic;
using MenuService.Models;

namespace MenuService.Repositories.Interfaces
{
    // Interface for database operations on MenuItem table
    public interface IMenuItemRepository
    {
        // Get all menu items
        IEnumerable<MenuItem> GetAll();

        // Get single menu item by ID
        MenuItem? GetById(int id);

        // Add a new menu item
        MenuItem Add(MenuItem menuItem);

        // Update an existing menu item
        void Update(MenuItem menuItem);

        // Delete a menu item
        void Delete(MenuItem menuItem);
    }
}
