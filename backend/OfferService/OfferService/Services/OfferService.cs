using OfferService.Data;
using OfferService.DTOs;
using OfferService.Models;
using Microsoft.EntityFrameworkCore;

namespace OfferService.Services
{
    public class OfferService : IOfferService
    {
        private readonly ApplicationDbContext _context;

        public OfferService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OfferResponseDto>> GetAllOffersAsync()
        {
            var offers = await _context.Offers.OrderByDescending(o => o.StartDate).ToListAsync();
            return offers.Select(MapToResponseDto);
        }

        public async Task<OfferResponseDto?> GetOfferByIdAsync(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            return offer == null ? null : MapToResponseDto(offer);
        }

        public async Task<OfferResponseDto> AddOfferAsync(CreateOfferDto dto)
        {
            ValidateOffer(dto.DiscountType, dto.DiscountValue, dto.StartDate, dto.EndDate);

            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                await EnsureCouponCodeIsUniqueAsync(dto.CouponCode);
            }

            var offer = new Offer
            {
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                DiscountType = NormalizeDiscountType(dto.DiscountType),
                DiscountValue = dto.DiscountValue,
                MinOrderAmount = dto.MinOrderAmount,
                StartDate = dto.StartDate.Date,
                EndDate = dto.EndDate.Date,
                CouponCode = string.IsNullOrWhiteSpace(dto.CouponCode) ? null : dto.CouponCode.Trim().ToUpperInvariant(),
                ApplicableCategory = string.IsNullOrWhiteSpace(dto.ApplicableCategory) ? "All" : dto.ApplicableCategory.Trim(),
                IsActive = dto.IsActive
            };

            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();

            return MapToResponseDto(offer);
        }

        public async Task<OfferResponseDto?> UpdateOfferAsync(int id, UpdateOfferDto dto)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return null;

            ValidateOffer(dto.DiscountType, dto.DiscountValue, dto.StartDate, dto.EndDate);

            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                await EnsureCouponCodeIsUniqueAsync(dto.CouponCode, id);
            }

            offer.Title = dto.Title.Trim();
            offer.Description = dto.Description?.Trim() ?? string.Empty;
            offer.DiscountType = NormalizeDiscountType(dto.DiscountType);
            offer.DiscountValue = dto.DiscountValue;
            offer.MinOrderAmount = dto.MinOrderAmount;
            offer.StartDate = dto.StartDate.Date;
            offer.EndDate = dto.EndDate.Date;
            offer.CouponCode = string.IsNullOrWhiteSpace(dto.CouponCode) ? null : dto.CouponCode.Trim().ToUpperInvariant();
            offer.ApplicableCategory = string.IsNullOrWhiteSpace(dto.ApplicableCategory) ? "All" : dto.ApplicableCategory.Trim();
            offer.IsActive = dto.IsActive;

            _context.Offers.Update(offer);
            await _context.SaveChangesAsync();

            return MapToResponseDto(offer);
        }

        public async Task<bool> DeleteOfferAsync(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return false;

            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<OfferResponseDto>> SearchOffersAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return await GetAllOffersAsync();
            }

            var searchTerm = query.Trim().ToLower();
            var offers = await _context.Offers
                .Where(o =>
                    o.Title.ToLower().Contains(searchTerm) ||
                    o.Description.ToLower().Contains(searchTerm) ||
                    (o.CouponCode != null && o.CouponCode.ToLower().Contains(searchTerm)) ||
                    o.ApplicableCategory.ToLower().Contains(searchTerm))
                .OrderByDescending(o => o.StartDate)
                .ToListAsync();

            return offers.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<OfferResponseDto>> GetActiveOffersAsync()
        {
            var today = DateTime.UtcNow.Date;
            var offers = await _context.Offers
                .Where(o => o.IsActive && o.StartDate <= today && o.EndDate >= today)
                .OrderByDescending(o => o.StartDate)
                .ToListAsync();

            return offers.Select(MapToResponseDto);
        }

        public async Task<OfferResponseDto?> GetOfferByCouponCodeAsync(string couponCode)
        {
            if (string.IsNullOrWhiteSpace(couponCode)) return null;

            var code = couponCode.Trim().ToUpperInvariant();
            var offer = await _context.Offers
                .FirstOrDefaultAsync(o => o.CouponCode == code);

            return offer == null ? null : MapToResponseDto(offer);
        }

        private async Task EnsureCouponCodeIsUniqueAsync(string couponCode, int? excludeId = null)
        {
            var code = couponCode.Trim().ToUpperInvariant();
            var exists = await _context.Offers
                .AnyAsync(o => o.CouponCode == code && (!excludeId.HasValue || o.Id != excludeId.Value));

            if (exists)
            {
                throw new InvalidOperationException($"Coupon code '{code}' is already in use.");
            }
        }

        private static void ValidateOffer(string discountType, decimal discountValue, DateTime startDate, DateTime endDate)
        {
            var normalizedType = NormalizeDiscountType(discountType);

            if (normalizedType == "Percentage" && discountValue > 100)
            {
                throw new InvalidOperationException("Percentage discount cannot exceed 100.");
            }

            if (endDate.Date < startDate.Date)
            {
                throw new InvalidOperationException("End date cannot be before start date.");
            }
        }

        private static string NormalizeDiscountType(string discountType)
        {
            if (string.IsNullOrWhiteSpace(discountType))
            {
                return "Percentage";
            }

            var normalized = discountType.Trim();
            if (normalized.Equals("Fixed", StringComparison.OrdinalIgnoreCase))
            {
                return "Fixed";
            }

            return "Percentage";
        }

        private static OfferResponseDto MapToResponseDto(Offer offer)
        {
            var today = DateTime.UtcNow.Date;
            var isExpired = offer.EndDate.Date < today;
            var isCurrentlyActive = offer.IsActive && offer.StartDate.Date <= today && offer.EndDate.Date >= today;

            var status = isCurrentlyActive
                ? "Active"
                : isExpired
                    ? "Expired"
                    : offer.IsActive
                        ? "Scheduled"
                        : "Inactive";

            return new OfferResponseDto
            {
                Id = offer.Id,
                Title = offer.Title,
                Description = offer.Description,
                DiscountType = offer.DiscountType,
                DiscountValue = offer.DiscountValue,
                MinOrderAmount = offer.MinOrderAmount,
                StartDate = offer.StartDate,
                EndDate = offer.EndDate,
                CouponCode = offer.CouponCode,
                ApplicableCategory = offer.ApplicableCategory,
                IsActive = offer.IsActive,
                IsExpired = isExpired,
                IsCurrentlyActive = isCurrentlyActive,
                Status = status
            };
        }
    }
}
