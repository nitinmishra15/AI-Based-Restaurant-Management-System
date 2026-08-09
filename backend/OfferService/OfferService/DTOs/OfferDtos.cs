using System.ComponentModel.DataAnnotations;

namespace OfferService.DTOs
{
    public class CreateOfferDto
    {
        [Required(ErrorMessage = "Offer title is required.")]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string DiscountType { get; set; } = "Percentage";

        [Range(0.01, 9999999.99, ErrorMessage = "Discount value must be greater than zero.")]
        public decimal DiscountValue { get; set; }

        [Range(0, 9999999.99, ErrorMessage = "Minimum order amount must be non-negative.")]
        public decimal MinOrderAmount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(50)]
        public string? CouponCode { get; set; }

        [StringLength(100)]
        public string ApplicableCategory { get; set; } = "All";

        public bool IsActive { get; set; } = true;
    }

    public class UpdateOfferDto
    {
        [Required(ErrorMessage = "Offer title is required.")]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string DiscountType { get; set; } = "Percentage";

        [Range(0.01, 9999999.99, ErrorMessage = "Discount value must be greater than zero.")]
        public decimal DiscountValue { get; set; }

        [Range(0, 9999999.99, ErrorMessage = "Minimum order amount must be non-negative.")]
        public decimal MinOrderAmount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(50)]
        public string? CouponCode { get; set; }

        [StringLength(100)]
        public string ApplicableCategory { get; set; } = "All";

        public bool IsActive { get; set; } = true;
    }

    public class OfferResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? CouponCode { get; set; }
        public string ApplicableCategory { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsExpired { get; set; }
        public bool IsCurrentlyActive { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public record OfferPredictionResponseDto(
        int CustomerId, 
        string RecommendedDiscount, 
        string CouponCode, 
        decimal ConfidenceScore, 
        string ModelSource
    );
}
