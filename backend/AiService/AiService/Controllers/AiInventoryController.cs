using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/inventory")]
public sealed class AiInventoryController : ControllerBase
{
    private readonly IInventoryPredictionService _service;
    public AiInventoryController(IInventoryPredictionService service) => _service = service;

    [HttpGet("predict/{ingredient}")]
    public async Task<IActionResult> Predict(string ingredient, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(ingredient)) return BadRequest(new { message = "ingredient is required." });
        return Ok(await _service.GetAsync(ingredient, cancellationToken));
    }
}
