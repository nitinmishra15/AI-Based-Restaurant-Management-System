using Microsoft.EntityFrameworkCore;
using OfferService.Data;
using OfferService.DTOs;

namespace OfferService.Services
{
    public interface IOfferPredictionService
    {
        Task<OfferPredictionResponseDto> GetAsync(int customerId, CancellationToken cancellationToken);
    }

    public class OfferPredictionService : IOfferPredictionService
    {
        private readonly ApplicationDbContext _context;

        public OfferPredictionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OfferPredictionResponseDto> GetAsync(int customerId, CancellationToken cancellationToken)
        {
            // Lightweight rule-based prediction:
            // Fetch active offers and recommend the best one
            var activeOffers = await _context.Offers
                .Where(o => o.IsActive)
                .ToListAsync(cancellationToken);

            string recommendedDiscount = "10%";
            string couponCode = "WELCOME10";

            if (activeOffers.Any())
            {
                // Recommend the offer with the highest discount value
                var bestOffer = activeOffers.OrderByDescending(o => o.DiscountValue).First();
                recommendedDiscount = bestOffer.DiscountType == "Percentage" 
                    ? $"{bestOffer.DiscountValue}%" 
                    : $"Rs.{bestOffer.DiscountValue} OFF";
                couponCode = bestOffer.CouponCode ?? "DEFAULT10";
            }

            return new OfferPredictionResponseDto(
                customerId,
                recommendedDiscount,
                couponCode,
                0.85m,
                "LocalRuleEngine"
            );
        }
    }
}
