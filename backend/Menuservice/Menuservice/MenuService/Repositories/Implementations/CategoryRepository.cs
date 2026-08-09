using System.Collections.Generic;
using System.Linq;
using MenuService.Data;
using MenuService.Models;
using MenuService.Repositories.Interfaces;

namespace MenuService.Repositories.Implementations
{
    // Category repository implementation using Entity Framework Core
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext via constructor injection
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all categories from database
        public IEnumerable<Category> GetAll()
        {
            return _context.Categories.ToList();
        }

        // Get category by ID from database
        public Category? GetById(int id)
        {
            return _context.Categories.Find(id);
        }

        // Save a new category to database
        public Category Add(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges(); // Persist changes
            return category;
        }

        // Update an existing category
        public void Update(Category category)
        {
            _context.Categories.Update(category);
            _context.SaveChanges(); // Persist changes
        }

        // Delete a category from database
        public void Delete(Category category)
        {
            _context.Categories.Remove(category);
            _context.SaveChanges(); // Persist changes
        }
    }
}
