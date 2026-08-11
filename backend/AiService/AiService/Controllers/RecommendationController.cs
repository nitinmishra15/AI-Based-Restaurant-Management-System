using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/recommendations")]
public sealed class RecommendationController : ControllerBase
{
    private readonly IRecommendationAiService _service;
    public RecommendationController(IRecommendationAiService service) => _service = service;

    /// <summary>Returns the three highest-ranked dishes from the Food Recommendation AutoML model.</summary>
    [HttpGet("{customerId:int}")]
    public async Task<IActionResult> Get(int customerId, CancellationToken cancellationToken)
    {
        if (customerId <= 0) return BadRequest(new { message = "customerId must be positive." });
        return Ok(await _service.GetAsync(customerId, cancellationToken));
    }
}
