using Microsoft.AspNetCore.Mvc;
using OrderService.DTOs;
using OrderService.Interfaces;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentGatewayService _paymentService;

        public PaymentsController(IPaymentGatewayService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/payments/process
        [HttpPost("process")]
        public async Task<IActionResult> Process([FromBody] PaymentRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // process payment
            var response = await _paymentService.ProcessPaymentAsync(dto);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
