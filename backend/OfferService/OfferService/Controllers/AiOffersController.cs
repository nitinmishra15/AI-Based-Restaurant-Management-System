using OfferService.Services;
using Microsoft.AspNetCore.Mvc;

namespace OfferService.Controllers
{
    [ApiController]
    [Route("api/offers")]
    public sealed class AiOffersController : ControllerBase
    {
        private readonly IOfferPredictionService _service;

        public AiOffersController(IOfferPredictionService service) => _service = service;

        [HttpGet("predict/{customerId:int}")]
        public async Task<IActionResult> Predict(int customerId, CancellationToken cancellationToken)
        {
            if (customerId <= 0) return BadRequest(new { message = "customerId must be positive." });
            return Ok(await _service.GetAsync(customerId, cancellationToken));
        }
    }
}
