using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/prediction")]
public sealed class PredictionController : ControllerBase
{
    private readonly IDemandPredictionService _service;
    public PredictionController(IDemandPredictionService service) => _service = service;

    [HttpGet("demand")]
    public async Task<IActionResult> Demand([FromQuery] string dish, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dish)) return BadRequest(new { message = "dish is required." });
        return Ok(await _service.GetAsync(dish.Trim(), cancellationToken));
    }
}
