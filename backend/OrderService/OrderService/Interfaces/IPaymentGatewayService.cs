using OrderService.DTOs;

namespace OrderService.Interfaces
{
    // payment gateway service interface
    public interface IPaymentGatewayService
    {
        Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto request);
    }
}
