using backend.DTOs;

namespace backend.Services;

public interface IRecommendationAiService { Task<RecommendationResponseDto> GetAsync(int customerId, CancellationToken cancellationToken = default); }
public interface IDemandPredictionService { Task<DemandPredictionResponseDto> GetAsync(string dish, CancellationToken cancellationToken = default); }
public interface IOfferPredictionService { Task<OfferPredictionResponseDto> GetAsync(int customerId, CancellationToken cancellationToken = default); }
public interface IInventoryPredictionService { Task<InventoryPredictionResponseDto> GetAsync(string ingredient, CancellationToken cancellationToken = default); }
