using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MenuService.Data;
using MenuService.Models;
using MenuService.Repositories.Interfaces;

namespace MenuService.Repositories.Implementations
{
    // MenuItem repository implementation using Entity Framework Core
    public class MenuItemRepository : IMenuItemRepository
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection for ApplicationDbContext
        public MenuItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all menu items including their category details
        public IEnumerable<MenuItem> GetAll()
        {
            return _context.MenuItems.Include(m => m.Category).ToList();
        }

        // Get single menu item by ID including its category details
        public MenuItem? GetById(int id)
        {
            return _context.MenuItems.Include(m => m.Category).FirstOrDefault(m => m.Id == id);
        }

        // Add a new menu item
        public MenuItem Add(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
            _context.SaveChanges();
            return menuItem;
        }

        // Update an existing menu item
        public void Update(MenuItem menuItem)
        {
            _context.MenuItems.Update(menuItem);
            _context.SaveChanges();
        }

        // Delete a menu item
        public void Delete(MenuItem menuItem)
        {
            _context.MenuItems.Remove(menuItem);
            _context.SaveChanges();
        }
    }
}
