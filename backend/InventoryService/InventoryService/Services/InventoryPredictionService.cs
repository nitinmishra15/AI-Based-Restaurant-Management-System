using Microsoft.EntityFrameworkCore;
using InventoryService.Data;
using InventoryService.DTOs;

namespace InventoryService.Services
{
    public interface IInventoryPredictionService
    {
        Task<InventoryPredictionResponseDto> GetAsync(string ingredient, CancellationToken cancellationToken);
    }

    public class InventoryPredictionService : IInventoryPredictionService
    {
        private readonly ApplicationDbContext _context;

        public InventoryPredictionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<InventoryPredictionResponseDto> GetAsync(string ingredient, CancellationToken cancellationToken)
        {
            // Query the local Inventories table
            var dbItem = await _context.Inventories
                .Where(i => i.InventoryName.Contains(ingredient))
                .FirstOrDefaultAsync(cancellationToken);

            decimal currentStock = 10;
            decimal dailyUsage = 3;
            decimal lowStockThreshold = 5;

            if (dbItem != null)
            {
                currentStock = dbItem.Qty;
                lowStockThreshold = dbItem.LowStockThreshold;
                // Usage speed estimate depending on the item category
                dailyUsage = dbItem.Category.Equals("Meat", StringComparison.OrdinalIgnoreCase) 
                    ? 5 
                    : dbItem.Category.Equals("Dairy", StringComparison.OrdinalIgnoreCase) 
                        ? 4 
                        : 2;
            }

            // Estimate remaining stock life
            decimal days = currentStock / (dailyUsage > 0 ? dailyUsage : 1);
            days = Math.Round(days, 1);

            // Flag alarm if remaining days <= 3 or stock falls below minimum threshold
            bool alert = days <= 3 || currentStock <= lowStockThreshold;

            // Suggest purchase quantity to replenish stock for a full week (7 days)
            int reorder = alert ? (int)Math.Max(0, Math.Ceiling((dailyUsage * 7) - currentStock)) : 0;

            return new InventoryPredictionResponseDto(
                ingredient,
                days,
                alert,
                reorder,
                "LocalRuleEngine"
            );
        }
    }
}
