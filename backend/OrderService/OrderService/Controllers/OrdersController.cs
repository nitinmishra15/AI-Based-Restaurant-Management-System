using Microsoft.AspNetCore.Mvc;
using OrderService.DTOs;
using OrderService.Interfaces;
using OrderService.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _repository;

        public OrdersController(IOrderRepository repository)
        {
            _repository = repository;
        }

        // GET:     api/orders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // get all orders
            var orders = await _repository.GetAll();
            
            // map to response dto
            var response = new List<OrderResponseDto>();
            foreach (var order in orders)
            {
                response.Add(MapToDto(order));
            }

            return Ok(response);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // get order by id
            var order = await _repository.GetById(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} was not found.");
            }

            // map and return data
            return Ok(MapToDto(order));
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            // validate request
            if (dto == null)
            {
                return BadRequest("Order data is required.");
            }

            if (dto.TableId <= 0)
            {
                return BadRequest("Table ID must be greater than 0.");
            }

            if (string.IsNullOrEmpty(dto.OrderItems))
            {
                return BadRequest("Order items cannot be empty.");
            }

            if (dto.Price <= 0)
            {
                return BadRequest("Price must be greater than 0.");
            }

            if (string.IsNullOrEmpty(dto.Status))
            {
                return BadRequest("Status cannot be empty.");
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            // map dto to order entity
            var order = new Order
            {
                TableId = dto.TableId,
                OrderItems = dto.OrderItems,
                Price = dto.Price,
                Notes = dto.Notes,
                Status = dto.Status,
                Quantity = dto.Quantity,
                Duration = dto.Duration,
                PaymentStatus = dto.PaymentStatus,
                TransactionId = dto.TransactionId,
                PaymentMethod = dto.PaymentMethod
            };

            // create order and save
            var createdOrder = await _repository.Create(order);
            await _repository.Save();

            // Send order confirmation and payment success notifications in the background
            _ = Task.Run(async () =>
            {
                await TriggerNotificationsAsync(createdOrder.Id, dto);
            });

            // map to response dto
            var responseDto = MapToDto(createdOrder);

            return StatusCode(201, responseDto);
        }

        // PUT: api/orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOrderDto dto)
        {
            // validate request
            if (dto == null)
            {
                return BadRequest("Order data is required.");
            }

            if (dto.TableId <= 0)
            {
                return BadRequest("Table ID must be greater than 0.");
            }

            if (string.IsNullOrEmpty(dto.OrderItems))
            {
                return BadRequest("Order items cannot be empty.");
            }

            if (dto.Price <= 0)
            {
                return BadRequest("Price must be greater than 0.");
            }

            if (string.IsNullOrEmpty(dto.Status))
            {
                return BadRequest("Status cannot be empty.");
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            // check if order exists
            var existingOrder = await _repository.GetById(id);
            if (existingOrder == null)
            {
                return NotFound($"Order with ID {id} was not found.");
            }

            // update existing entity fields
            existingOrder.TableId = dto.TableId;
            existingOrder.OrderItems = dto.OrderItems;
            existingOrder.Price = dto.Price;
            existingOrder.Notes = dto.Notes;
            existingOrder.Status = dto.Status;
            existingOrder.Quantity = dto.Quantity;
            existingOrder.Duration = dto.Duration;

            // save update
            await _repository.Update(existingOrder);
            await _repository.Save();

            return Ok(new { message = "Order updated successfully" });
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // check if order exists
            var existingOrder = await _repository.GetById(id);
            if (existingOrder == null)
            {
                return NotFound($"Order with ID {id} was not found.");
            }

            // delete order and save
            await _repository.Delete(id);
            await _repository.Save();

            return Ok(new { message = "Order deleted successfully" });
        }

        // manual mapping helper
        private OrderResponseDto MapToDto(Order order)
        {
            return new OrderResponseDto
            {
                Id = order.Id,
                TableId = order.TableId,
                OrderItems = order.OrderItems,
                Price = order.Price,
                Notes = order.Notes,
                Status = order.Status,
                Quantity = order.Quantity,
                Duration = order.Duration,
                PaymentStatus = order.PaymentStatus,
                TransactionId = order.TransactionId,
                PaymentMethod = order.PaymentMethod
            };
        }

        private static readonly HttpClient _httpClient = new();

        private async Task TriggerNotificationsAsync(int orderId, CreateOrderDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email)) return;

            try
            {
                // 1. Send Order Confirmation Email
                var orderPayload = new
                {
                    orderId = "ORD" + orderId,
                    customerName = dto.CustomerName ?? "Customer",
                    email = dto.Email,
                    amount = (double)dto.Price,
                    orderDate = DateTime.Now.ToString("yyyy-MM-dd"),
                    status = "Confirmed"
                };
                var orderJson = System.Text.Json.JsonSerializer.Serialize(orderPayload);
                var orderContent = new StringContent(orderJson, Encoding.UTF8, "application/json");
                await _httpClient.PostAsync("http://localhost:8082/api/notifications/send-order-email", orderContent);

                // 2. Send Payment Receipt Notification (since payment is completed)
                if (dto.PaymentStatus == "Completed" && !string.IsNullOrEmpty(dto.TransactionId))
                {
                    var paymentPayload = new
                    {
                        paymentId = dto.TransactionId,
                        orderId = "ORD" + orderId,
                        customerName = dto.CustomerName ?? "Customer",
                        email = dto.Email,
                        mobileNumber = dto.MobileNumber ?? "",
                        amount = (double)dto.Price,
                        status = "Success",
                        paymentDate = DateTime.Now.ToString("yyyy-MM-dd")
                    };
                    var paymentJson = System.Text.Json.JsonSerializer.Serialize(paymentPayload);
                    var paymentContent = new StringContent(paymentJson, Encoding.UTF8, "application/json");
                    await _httpClient.PostAsync("http://localhost:8082/api/notifications/send-payment-notification", paymentContent);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OrderService Notification Error] {ex.Message}");
            }
        }
    }
}
