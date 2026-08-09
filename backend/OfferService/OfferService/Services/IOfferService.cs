using OfferService.DTOs;

namespace OfferService.Services
{
    public interface IOfferService
    {
        Task<IEnumerable<OfferResponseDto>> GetAllOffersAsync();
        Task<OfferResponseDto?> GetOfferByIdAsync(int id);
        Task<OfferResponseDto> AddOfferAsync(CreateOfferDto dto);
        Task<OfferResponseDto?> UpdateOfferAsync(int id, UpdateOfferDto dto);
        Task<bool> DeleteOfferAsync(int id);
        Task<IEnumerable<OfferResponseDto>> SearchOffersAsync(string query);
        Task<IEnumerable<OfferResponseDto>> GetActiveOffersAsync();
        Task<OfferResponseDto?> GetOfferByCouponCodeAsync(string couponCode);
    }
}
