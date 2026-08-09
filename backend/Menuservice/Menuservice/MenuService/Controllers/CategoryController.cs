using System;
using Microsoft.AspNetCore.Mvc;
using MenuService.DTOs;
using MenuService.Services.Interfaces;

namespace MenuService.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        // Constructor injection for CategoryService
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/categories
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var categories = _categoryService.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching categories.", details = ex.Message });
            }
        }

        // GET: api/categories/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var category = _categoryService.GetCategoryById(id);
                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the category.", details = ex.Message });
            }
        }

        // POST: api/categories
        [HttpPost]
        public IActionResult Create([FromBody] CategoryCreateDto categoryDto)
        {
            try
            {
                // Model validation check
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdCategory = _categoryService.CreateCategory(categoryDto);
                
                // Return 201 Created with resource location and data
                return CreatedAtAction(nameof(GetById), new { id = createdCategory.Id }, createdCategory);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the category.", details = ex.Message });
            }
        }

        // PUT: api/categories/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CategoryUpdateDto categoryDto)
        {
            try
            {
                // Model validation check
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var isUpdated = _categoryService.UpdateCategory(id, categoryDto);
                if (!isUpdated)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                return Ok(new { message = "Category updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the category.", details = ex.Message });
            }
        }

        // DELETE: api/categories/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var isDeleted = _categoryService.DeleteCategory(id);
                if (!isDeleted)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                return Ok(new { message = "Category deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the category.", details = ex.Message });
            }
        }
    }
}
