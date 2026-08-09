using System;
using System.Collections.Generic;
using MenuService.DTOs;
using MenuService.Models;
using MenuService.Repositories.Interfaces;
using MenuService.Services.Interfaces;

namespace MenuService.Services.Implementations
{
    // Category service implementation handling business validations and entity-DTO mapping
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        // Constructor injection for CategoryRepository
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // Get all categories mapped to CategoryDto
        public IEnumerable<CategoryDto> GetAllCategories()
        {
            var categories = _categoryRepository.GetAll();
            var dtoList = new List<CategoryDto>();

            // Manual mapping (no AutoMapper as requested for beginner-friendly style)
            foreach (var category in categories)
            {
                dtoList.Add(new CategoryDto
                {
                    Id = category.Id,
                    CategoryName = category.CategoryName
                });
            }

            return dtoList;
        }

        // Get category by ID mapped to CategoryDto
        public CategoryDto? GetCategoryById(int id)
        {
            var category = _categoryRepository.GetById(id);
            if (category == null)
            {
                return null;
            }

            return new CategoryDto
            {
                Id = category.Id,
                CategoryName = category.CategoryName
            };
        }

        // Create new category with validations
        public CategoryDto CreateCategory(CategoryCreateDto categoryDto)
        {
            if (categoryDto == null)
            {
                throw new ArgumentNullException(nameof(categoryDto), "Category data is null.");
            }

            if (string.IsNullOrWhiteSpace(categoryDto.CategoryName))
            {
                throw new ArgumentException("Category name cannot be empty.");
            }

            // Create Entity
            var category = new Category
            {
                CategoryName = categoryDto.CategoryName.Trim()
            };

            var createdCategory = _categoryRepository.Add(category);

            // Return response DTO
            return new CategoryDto
            {
                Id = createdCategory.Id,
                CategoryName = createdCategory.CategoryName
            };
        }

        // Update category name
        public bool UpdateCategory(int id, CategoryUpdateDto categoryDto)
        {
            if (categoryDto == null)
            {
                throw new ArgumentNullException(nameof(categoryDto), "Category data is null.");
            }

            if (string.IsNullOrWhiteSpace(categoryDto.CategoryName))
            {
                throw new ArgumentException("Category name cannot be empty.");
            }

            var existingCategory = _categoryRepository.GetById(id);
            if (existingCategory == null)
            {
                return false;
            }

            existingCategory.CategoryName = categoryDto.CategoryName.Trim();
            _categoryRepository.Update(existingCategory);

            return true;
        }

        // Delete a category
        public bool DeleteCategory(int id)
        {
            var existingCategory = _categoryRepository.GetById(id);
            if (existingCategory == null)
            {
                return false;
            }

            _categoryRepository.Delete(existingCategory);
            return true;
        }
    }
}
