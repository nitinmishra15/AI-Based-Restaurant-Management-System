using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
using MenuService.DTOs;
using MenuService.Services.Interfaces;

namespace MenuService.Controllers
{
    [ApiController]
    [Route("api/menuitems")]
    public class MenuItemController : ControllerBase
    {
        private readonly IMenuItemService _menuItemService;

        // Inject IMenuItemService via constructor injection
        public MenuItemController(IMenuItemService menuItemService)
        {
            _menuItemService = menuItemService;
        }

        // GET: api/menuitems
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var items = _menuItemService.GetAllMenuItems();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching menu items.", details = ex.Message });
            }
        }

        // GET: api/menuitems/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var item = _menuItemService.GetMenuItemById(id);
                if (item == null)
                {
                    return NotFound(new { message = $"Menu item with ID {id} not found." });
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the menu item.", details = ex.Message });
            }
        }

        private string? SaveUploadedImage(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                throw new ArgumentException("Image size must be less than 5MB.");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Only JPG, JPEG, PNG, and WEBP image formats are allowed.");
            }

            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(imagesFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return $"/images/{fileName}";
        }

        private void DeleteImageFile(string? relativePath)
        {
            if (string.IsNullOrEmpty(relativePath))
            {
                return;
            }

            try
            {
                var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var fullPath = Path.Combine(wwwRootPath, relativePath.TrimStart('/'));
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch
            {
                // Suppress errors to prevent breaking API flows
            }
        }

        // POST: api/menuitems
        [HttpPost]
        public IActionResult Create([FromForm] MenuItemCreateDto menuItemDto, IFormFile? Image)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (Image != null)
                {
                    menuItemDto.ImageUrl = SaveUploadedImage(Image);
                }

                var createdItem = _menuItemService.CreateMenuItem(menuItemDto);
                return CreatedAtAction(nameof(GetById), new { id = createdItem.Id }, createdItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the menu item.", details = ex.Message });
            }
        }

        // PUT: api/menuitems/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromForm] MenuItemUpdateDto menuItemDto, IFormFile? Image)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingItem = _menuItemService.GetMenuItemById(id);
                if (existingItem == null)
                {
                    return NotFound(new { message = $"Menu item with ID {id} not found." });
                }

                if (Image != null)
                {
                    DeleteImageFile(existingItem.ImageUrl);
                    menuItemDto.ImageUrl = SaveUploadedImage(Image);
                }
                else
                {
                    menuItemDto.ImageUrl = existingItem.ImageUrl;
                }

                var isUpdated = _menuItemService.UpdateMenuItem(id, menuItemDto);
                if (!isUpdated)
                {
                    return NotFound(new { message = $"Menu item with ID {id} not found." });
                }

                return Ok(new { message = "Menu item updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the menu item.", details = ex.Message });
            }
        }

        // DELETE: api/menuitems/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var existingItem = _menuItemService.GetMenuItemById(id);
                if (existingItem == null)
                {
                    return NotFound(new { message = $"Menu item with ID {id} not found." });
                }

                DeleteImageFile(existingItem.ImageUrl);

                var isDeleted = _menuItemService.DeleteMenuItem(id);
                if (!isDeleted)
                {
                    return NotFound(new { message = $"Menu item with ID {id} not found." });
                }

                return Ok(new { message = "Menu item deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the menu item.", details = ex.Message });
            }
        }
    }
}
