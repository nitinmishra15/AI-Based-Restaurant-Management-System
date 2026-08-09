using OfferService.DTOs;
using OfferService.Services;
using Microsoft.AspNetCore.Mvc;

namespace OfferService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OfferController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        /// <summary>
        /// Get all offers (with optional filters)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] bool? isActive)
        {
            if (isActive == true)
            {
                var activeOffers = await _offerService.GetActiveOffersAsync();
                return Ok(activeOffers);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchResult = await _offerService.SearchOffersAsync(search);
                return Ok(searchResult);
            }

            var result = await _offerService.GetAllOffersAsync();
            return Ok(result);
        }

        /// <summary>
        /// Get offer details by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var offer = await _offerService.GetOfferByIdAsync(id);
            if (offer == null)
            {
                return NotFound(new { message = $"Offer with ID {id} not found." });
            }

            return Ok(offer);
        }

        /// <summary>
        /// Get currently active offers
        /// </summary>
        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var offers = await _offerService.GetActiveOffersAsync();
            return Ok(offers);
        }

        /// <summary>
        /// Get offer by coupon code
        /// </summary>
        [HttpGet("coupon/{code}")]
        public async Task<IActionResult> GetByCouponCode(string code)
        {
            var offer = await _offerService.GetOfferByCouponCodeAsync(code);
            if (offer == null)
            {
                return NotFound(new { message = $"Offer with coupon code '{code}' not found." });
            }

            return Ok(offer);
        }

        /// <summary>
        /// Add new offer (Chef / Admin)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateOfferDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdOffer = await _offerService.AddOfferAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = createdOffer.Id }, createdOffer);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update offer by ID (Chef / Admin)
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOfferDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedOffer = await _offerService.UpdateOfferAsync(id, dto);
                if (updatedOffer == null)
                {
                    return NotFound(new { message = $"Offer with ID {id} not found." });
                }

                return Ok(updatedOffer);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete offer by ID (Chef / Admin)
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _offerService.DeleteOfferAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Offer with ID {id} not found." });
            }

            return Ok(new { message = $"Offer with ID {id} deleted successfully." });
        }

        /// <summary>
        /// Search offers by title, description, coupon code, or category
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var results = await _offerService.SearchOffersAsync(query);
            return Ok(results);
        }
    }
}
