using InventoryService.DTOs;
using InventoryService.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        /// <summary>
        /// Get all inventory items (with optional filters)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? status, [FromQuery] bool? isLowStock)
        {
            if (isLowStock == true)
            {
                var lowStockItems = await _inventoryService.GetLowStockAlertsAsync();
                return Ok(lowStockItems);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchResult = await _inventoryService.SearchInventoryAsync(search);
                return Ok(searchResult);
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryResult = await _inventoryService.FilterByCategoryAsync(category);
                return Ok(categoryResult);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                var statusResult = await _inventoryService.FilterByStatusAsync(status);
                return Ok(statusResult);
            }

            var result = await _inventoryService.GetAllInventoryAsync();
            return Ok(result);
        }

        /// <summary>
        /// Get inventory item details by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _inventoryService.GetInventoryByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { message = $"Inventory item with ID {id} not found." });
            }

            return Ok(item);
        }

        /// <summary>
        /// Add new inventory item (Chef / Admin)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateInventoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdItem = await _inventoryService.AddInventoryAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdItem.Id }, createdItem);
        }

        /// <summary>
        /// Update inventory item by ID (Chef / Admin)
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateInventoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedItem = await _inventoryService.UpdateInventoryAsync(id, dto);
            if (updatedItem == null)
            {
                return NotFound(new { message = $"Inventory item with ID {id} not found." });
            }

            return Ok(updatedItem);
        }

        /// <summary>
        /// Delete inventory item by ID (Chef / Admin)
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _inventoryService.DeleteInventoryAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Inventory item with ID {id} not found." });
            }

            return Ok(new { message = $"Inventory item with ID {id} deleted successfully." });
        }

        /// <summary>
        /// Search inventory items by name or category
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var results = await _inventoryService.SearchInventoryAsync(query);
            return Ok(results);
        }

        /// <summary>
        /// Filter inventory items by category
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<IActionResult> FilterByCategory(string category)
        {
            var results = await _inventoryService.FilterByCategoryAsync(category);
            return Ok(results);
        }

        /// <summary>
        /// Filter inventory items by status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<IActionResult> FilterByStatus(string status)
        {
            var results = await _inventoryService.FilterByStatusAsync(status);
            return Ok(results);
        }

        /// <summary>
        /// Get Low Stock Alerts
        /// </summary>
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockAlerts([FromQuery] int? threshold)
        {
            var results = await _inventoryService.GetLowStockAlertsAsync(threshold);
            return Ok(results);
        }
    }
}
