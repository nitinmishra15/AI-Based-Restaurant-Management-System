using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    /// <summary>
    /// Rule-based AI prediction and recommendations service querying 5 separate databases.
    /// Bypasses cloud AI calls and calculates metrics using distributed database contexts.
    /// </summary>
    public sealed class RestaurantAiServices : IRecommendationAiService, IDemandPredictionService, IOfferPredictionService, IInventoryPredictionService
    {
        private readonly AppDbContext _authContext;
        private readonly MenuDbContext _menuContext;
        private readonly OrderDbContext _orderContext;
        private readonly InventoryDbContext _inventoryContext;
        private readonly OfferDbContext _offerContext;

        public RestaurantAiServices(
            AppDbContext authContext,
            MenuDbContext menuContext,
            OrderDbContext orderContext,
            InventoryDbContext inventoryContext,
            OfferDbContext offerContext)
        {
            _authContext = authContext;
            _menuContext = menuContext;
            _orderContext = orderContext;
            _inventoryContext = inventoryContext;
            _offerContext = offerContext;
        }

        // 1. Food Recommendation Logic (Queries Auth for preferences, Menu for dishes)
        public async Task<RecommendationResponseDto> GetRecommendationsAsync(int customerId, CancellationToken cancellationToken = default)
        {
            // Find preference based on past interaction history in RestaurantAuthDb
            var lastInteraction = await _authContext.UserInteractions
                .Where(ui => ui.UserId == customerId)
                .OrderByDescending(ui => ui.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            string preference = "Veg"; // default fallback
            if (lastInteraction != null)
            {
                preference = lastInteraction.InteractionType == "NonVeg" ? "NonVeg" : "Veg";
            }

            // Fetch active menu items from QrDinningMenuDb
            var itemsQuery = _menuContext.MenuItems.Where(m => m.Status == true);

            // Filter out meat dishes if user is vegetarian
            if (preference == "Veg")
            {
                itemsQuery = itemsQuery.Where(m => !m.ItemName.Contains("Chicken") && !m.ItemName.Contains("Meat"));
            }

            var availableItems = await itemsQuery.Take(3).ToListAsync(cancellationToken);

            // Map matching items to DTOs
            var recommendations = availableItems.Select((item, index) => new RecommendationItemDto(
                item.ItemName,
                0.95m - (index * 0.05m),
                $"Popular choice matching your {preference} preference."
            )).ToList();

            return new RecommendationResponseDto(customerId, "LocalRuleEngine", recommendations);
        }

        // 2. Food Demand Forecasting Logic (Queries Order DB for order volume trends)
        public async Task<DemandPredictionResponseDto> GetDemandAsync(string dish, CancellationToken cancellationToken = default)
        {
            var tomorrow = DateOnly.FromDateTime(DateTime.Today.AddDays(1));
            var dayCategory = GetDayCategory(tomorrow);

            // Query past order frequencies from QrDinningOrderDb containing this dish name
            var pastOrdersCount = await _orderContext.Orders
                .Where(o => o.OrderItems.Contains(dish))
                .CountAsync(cancellationToken);

            // Calculate base demand (default to 15 if no sales history is recorded)
            var baseDemand = Math.Max(15, pastOrdersCount * 3);

            // Adjust values depending on the day category
            if (dayCategory == "Weekend")
            {
                baseDemand += 12; // Higher demand on weekends
            }
            else if (dayCategory == "MonthEnd")
            {
                baseDemand -= 5; // Slight dip right before salary day
            }
            else
            {
                baseDemand += 3; // Weekday baseline
            }

            return new DemandPredictionResponseDto(dish, tomorrow, baseDemand, "LocalRuleEngine");
        }

        // 3. Custom Coupon Suggestions Logic (Queries Order DB for loyalty, Offer DB for coupons)
        public async Task<OfferPredictionResponseDto> GetOfferAsync(int customerId, CancellationToken cancellationToken = default)
        {
            var dayCategory = GetDayCategory(DateOnly.FromDateTime(DateTime.Today));

            // Query total overall order history count from QrDinningOrderDb to evaluate loyalty tier
            var totalOrders = await _orderContext.Orders.CountAsync(cancellationToken);
            
            string customerType = "Regular";
            if (totalOrders >= 10) customerType = "Loyal";
            else if (totalOrders >= 5) customerType = "Premium";

            // Query active deals from the QrOfferDb database
            var activeOffers = await _offerContext.Offers.Where(o => o.IsActive == true).ToListAsync(cancellationToken);
            
            decimal discountValue = 10m;
            string couponCode = "WELCOME10";
            
            if (activeOffers.Any())
            {
                // Month-end: suggest highest saving coupon to boost sales
                if (dayCategory == "MonthEnd")
                {
                    var bestOffer = activeOffers.OrderByDescending(o => o.DiscountValue).First();
                    discountValue = bestOffer.DiscountValue;
                    couponCode = bestOffer.CouponCode;
                }
                // Weekends/Standard: suggest the weekend coupon
                else
                {
                    var standardOffer = activeOffers.FirstOrDefault(o => o.CouponCode.Contains("FEAST")) ?? activeOffers.First();
                    discountValue = standardOffer.DiscountValue;
                    couponCode = standardOffer.CouponCode;
                }
            }

            return new OfferPredictionResponseDto(
                customerId,
                $"{discountValue}%",
                couponCode,
                0.85m,
                "LocalRuleEngine"
            );
        }

        // 4. Inventory depletion and stock-out alerts logic (Queries Inventory DB for stock levels)
        public async Task<InventoryPredictionResponseDto> GetInventoryAsync(string ingredient, CancellationToken cancellationToken = default)
        {
            // Query the live Stock table in QrDiningInventoryDb
            var dbItem = await _inventoryContext.Inventories
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
                dailyUsage = dbItem.Category == "Meat" ? 5 : dbItem.Category == "Dairy" ? 4 : 2;
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

        // Explicit interface bindings
        Task<RecommendationResponseDto> IRecommendationAiService.GetAsync(int customerId, CancellationToken cancellationToken) => GetRecommendationsAsync(customerId, cancellationToken);
        Task<DemandPredictionResponseDto> IDemandPredictionService.GetAsync(string dish, CancellationToken cancellationToken) => GetDemandAsync(dish, cancellationToken);
        Task<OfferPredictionResponseDto> IOfferPredictionService.GetAsync(int customerId, CancellationToken cancellationToken) => GetOfferAsync(customerId, cancellationToken);
        Task<InventoryPredictionResponseDto> IInventoryPredictionService.GetAsync(string ingredient, CancellationToken cancellationToken) => GetInventoryAsync(ingredient, cancellationToken);

        // Helper to categorize calendar dates
        private static string GetDayCategory(DateOnly date)
        {
            if (date.Day >= 26)
            {
                return "MonthEnd";
            }
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            {
                return "Weekend";
            }
            return "WeekDay";
        }
    }
}
