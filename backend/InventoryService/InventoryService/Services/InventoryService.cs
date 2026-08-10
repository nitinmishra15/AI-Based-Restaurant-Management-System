using InventoryService.Data;
using InventoryService.DTOs;
using InventoryService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly ApplicationDbContext _context;

        public InventoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InventoryResponseDto>> GetAllInventoryAsync()
        {
            var items = await _context.Inventories.ToListAsync();
            return items.Select(MapToResponseDto);
        }

        public async Task<InventoryResponseDto?> GetInventoryByIdAsync(int id)
        {
            var item = await _context.Inventories.FindAsync(id);
            return item == null ? null : MapToResponseDto(item);
        }

        public async Task<InventoryResponseDto> AddInventoryAsync(CreateInventoryDto dto)
        {
            var status = DetermineStatus(dto.Qty, dto.LowStockThreshold, dto.Status);

            var item = new Inventory
            {
                InventoryName = dto.InventoryName.Trim(),
                Price = dto.Price,
                Qty = dto.Qty,
                Status = status,
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
                LowStockThreshold = dto.LowStockThreshold <= 0 ? 5 : dto.LowStockThreshold
            };

            _context.Inventories.Add(item);
            await _context.SaveChangesAsync();

            return MapToResponseDto(item);
        }

        public async Task<InventoryResponseDto?> UpdateInventoryAsync(int id, UpdateInventoryDto dto)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return null;

            item.InventoryName = dto.InventoryName.Trim();
            item.Price = dto.Price;
            item.Qty = dto.Qty;
            item.LowStockThreshold = dto.LowStockThreshold <= 0 ? 5 : dto.LowStockThreshold;
            item.Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim();
            item.Status = DetermineStatus(dto.Qty, item.LowStockThreshold, dto.Status);

            _context.Inventories.Update(item);
            await _context.SaveChangesAsync();

            return MapToResponseDto(item);
        }

        public async Task<bool> DeleteInventoryAsync(int id)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return false;

            _context.Inventories.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<InventoryResponseDto>> SearchInventoryAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return await GetAllInventoryAsync();
            }

            var searchTerm = query.Trim().ToLower();
            var items = await _context.Inventories
                .Where(i => i.InventoryName.ToLower().Contains(searchTerm) || i.Category.ToLower().Contains(searchTerm))
                .ToListAsync();

            return items.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<InventoryResponseDto>> FilterByCategoryAsync(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return await GetAllInventoryAsync();
            }

            var cat = category.Trim().ToLower();
            var items = await _context.Inventories
                .Where(i => i.Category.ToLower() == cat)
                .ToListAsync();

            return items.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<InventoryResponseDto>> FilterByStatusAsync(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return await GetAllInventoryAsync();
            }

            var st = status.Trim().ToLower();
            var items = await _context.Inventories
                .Where(i => i.Status.ToLower() == st)
                .ToListAsync();

            return items.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<InventoryResponseDto>> GetLowStockAlertsAsync(int? threshold = null)
        {
            var items = await _context.Inventories.ToListAsync();

            var lowStockItems = items.Where(i => 
                i.Qty <= (threshold ?? i.LowStockThreshold) || 
                string.Equals(i.Status, "Low Stock", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(i.Status, "Out of Stock", StringComparison.OrdinalIgnoreCase)
            );

            return lowStockItems.Select(MapToResponseDto);
        }

        private static string DetermineStatus(int qty, int threshold, string userProvidedStatus)
        {
            if (qty == 0) return "Out of Stock";
            if (qty <= threshold) return "Low Stock";
            if (string.IsNullOrWhiteSpace(userProvidedStatus) || userProvidedStatus.Equals("Out of Stock", StringComparison.OrdinalIgnoreCase) || userProvidedStatus.Equals("Low Stock", StringComparison.OrdinalIgnoreCase))
            {
                return "In Stock";
            }
            return userProvidedStatus;
        }

        private static InventoryResponseDto MapToResponseDto(Inventory item)
        {
            return new InventoryResponseDto
            {
                Id = item.Id,
                InventoryName = item.InventoryName,
                Price = item.Price,
                Qty = item.Qty,
                Status = item.Status,
                Category = item.Category,
                LowStockThreshold = item.LowStockThreshold,
                IsLowStock = item.Qty <= item.LowStockThreshold || string.Equals(item.Status, "Low Stock", StringComparison.OrdinalIgnoreCase) || string.Equals(item.Status, "Out of Stock", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}
