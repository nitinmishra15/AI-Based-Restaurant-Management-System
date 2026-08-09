using System;
using System.Collections.Generic;
using MenuService.DTOs;
using MenuService.Models;
using MenuService.Repositories.Interfaces;
using MenuService.Services.Interfaces;

namespace MenuService.Services.Implementations
{
    // MenuItem service implementation handling business validation and manual mapping to DTOs
    public class MenuItemService : IMenuItemService
    {
        private readonly IMenuItemRepository _menuItemRepository;
        private readonly ICategoryRepository _categoryRepository;

        // Constructor injection for repositories
        public MenuItemService(IMenuItemRepository menuItemRepository, ICategoryRepository categoryRepository)
        {
            _menuItemRepository = menuItemRepository;
            _categoryRepository = categoryRepository;
        }

        // Get all menu items
        public IEnumerable<MenuItemDto> GetAllMenuItems()
        {
            var items = _menuItemRepository.GetAll();
            var dtoList = new List<MenuItemDto>();

            foreach (var item in items)
            {
                dtoList.Add(new MenuItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Price = item.Price,
                    Description = item.Description,
                    Status = item.Status,
                    CategoryId = item.CategoryId,
                    CategoryName = item.Category != null ? item.Category.CategoryName : "No Category",
                    ImageUrl = item.ImageUrl
                });
            }

            return dtoList;
        }

        // Get single menu item by ID
        public MenuItemDto? GetMenuItemById(int id)
        {
            var item = _menuItemRepository.GetById(id);
            if (item == null)
            {
                return null;
            }

            return new MenuItemDto
            {
                Id = item.Id,
                ItemName = item.ItemName,
                Price = item.Price,
                Description = item.Description,
                Status = item.Status,
                CategoryId = item.CategoryId,
                CategoryName = item.Category != null ? item.Category.CategoryName : "No Category",
                ImageUrl = item.ImageUrl
            };
        }

        // Create new menu item with validation checks
        public MenuItemDto CreateMenuItem(MenuItemCreateDto menuItemDto)
        {
            if (menuItemDto == null)
            {
                throw new ArgumentNullException(nameof(menuItemDto), "Menu item data is null.");
            }

            if (string.IsNullOrWhiteSpace(menuItemDto.ItemName))
            {
                throw new ArgumentException("Item name cannot be empty.");
            }

            if (menuItemDto.Price <= 0)
            {
                throw new ArgumentException("Price must be greater than zero.");
            }

            // Verify if Category exists
            var category = _categoryRepository.GetById(menuItemDto.CategoryId);
            if (category == null)
            {
                throw new ArgumentException($"Category with ID {menuItemDto.CategoryId} does not exist.");
            }

            // Map DTO to Entity
            var menuItem = new MenuItem
            {
                ItemName = menuItemDto.ItemName.Trim(),
                Price = menuItemDto.Price,
                Description = menuItemDto.Description,
                Status = menuItemDto.Status,
                CategoryId = menuItemDto.CategoryId,
                ImageUrl = menuItemDto.ImageUrl
            };

            var createdItem = _menuItemRepository.Add(menuItem);

            // Map Entity to Response DTO
            return new MenuItemDto
            {
                Id = createdItem.Id,
                ItemName = createdItem.ItemName,
                Price = createdItem.Price,
                Description = createdItem.Description,
                Status = createdItem.Status,
                CategoryId = createdItem.CategoryId,
                CategoryName = category.CategoryName,
                ImageUrl = createdItem.ImageUrl
            };
        }

        // Update an existing menu item
        public bool UpdateMenuItem(int id, MenuItemUpdateDto menuItemDto)
        {
            if (menuItemDto == null)
            {
                throw new ArgumentNullException(nameof(menuItemDto), "Menu item data is null.");
            }

            if (string.IsNullOrWhiteSpace(menuItemDto.ItemName))
            {
                throw new ArgumentException("Item name cannot be empty.");
            }

            if (menuItemDto.Price <= 0)
            {
                throw new ArgumentException("Price must be greater than zero.");
            }

            // Verify if Category exists
            var category = _categoryRepository.GetById(menuItemDto.CategoryId);
            if (category == null)
            {
                throw new ArgumentException($"Category with ID {menuItemDto.CategoryId} does not exist.");
            }

            var existingItem = _menuItemRepository.GetById(id);
            if (existingItem == null)
            {
                return false;
            }

            // Update fields
            existingItem.ItemName = menuItemDto.ItemName.Trim();
            existingItem.Price = menuItemDto.Price;
            existingItem.Description = menuItemDto.Description;
            existingItem.Status = menuItemDto.Status;
            existingItem.CategoryId = menuItemDto.CategoryId;
            existingItem.ImageUrl = menuItemDto.ImageUrl;

            _menuItemRepository.Update(existingItem);
            return true;
        }

        // Delete a menu item by ID
        public bool DeleteMenuItem(int id)
        {
            var existingItem = _menuItemRepository.GetById(id);
            if (existingItem == null)
            {
                return false;
            }

            _menuItemRepository.Delete(existingItem);
            return true;
        }
    }
}
