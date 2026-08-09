using System.Collections.Generic;
using MenuService.DTOs;

namespace MenuService.Services.Interfaces
{
    // Interface for MenuItem business actions
    public interface IMenuItemService
    {
        // Get all menu items mapped to DTOs
        IEnumerable<MenuItemDto> GetAllMenuItems();

        // Get single menu item by ID mapped to DTO
        MenuItemDto? GetMenuItemById(int id);

        // Create new menu item
        MenuItemDto CreateMenuItem(MenuItemCreateDto menuItemDto);

        // Update an existing menu item
        bool UpdateMenuItem(int id, MenuItemUpdateDto menuItemDto);

        // Delete a menu item by ID
        bool DeleteMenuItem(int id);
    }
}
