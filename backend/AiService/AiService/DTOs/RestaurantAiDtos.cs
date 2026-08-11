namespace backend.DTOs;

public sealed record RecommendationItemDto(string Item, decimal ConfidenceScore, string Reason);
public sealed record RecommendationResponseDto(int CustomerId, string ModelSource, IReadOnlyList<RecommendationItemDto> Recommendations);
public sealed record DemandPredictionResponseDto(string Dish, DateOnly ForecastDate, int PredictedOrders, string ModelSource);
public sealed record OfferPredictionResponseDto(int CustomerId, string RecommendedDiscount, string CouponCode, decimal ConfidenceScore, string ModelSource);
public sealed record InventoryPredictionResponseDto(string Ingredient, decimal DaysRemaining, bool LowStockAlert, int SuggestedReorderQuantity, string ModelSource);
