namespace OrderService.DTOs
{
    // payment response details
    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "Completed", "Failed"
    }
}
