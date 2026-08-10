using InventoryService.DTOs;

namespace InventoryService.Services
{
    public interface IInventoryService
    {
        Task<IEnumerable<InventoryResponseDto>> GetAllInventoryAsync();
        Task<InventoryResponseDto?> GetInventoryByIdAsync(int id);
        Task<InventoryResponseDto> AddInventoryAsync(CreateInventoryDto dto);
        Task<InventoryResponseDto?> UpdateInventoryAsync(int id, UpdateInventoryDto dto);
        Task<bool> DeleteInventoryAsync(int id);
        Task<IEnumerable<InventoryResponseDto>> SearchInventoryAsync(string query);
        Task<IEnumerable<InventoryResponseDto>> FilterByCategoryAsync(string category);
        Task<IEnumerable<InventoryResponseDto>> FilterByStatusAsync(string status);
        Task<IEnumerable<InventoryResponseDto>> GetLowStockAlertsAsync(int? threshold = null);
    }
}
