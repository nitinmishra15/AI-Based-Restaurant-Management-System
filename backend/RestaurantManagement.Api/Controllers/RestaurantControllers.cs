using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagement.Api.DTOs;
using RestaurantManagement.Api.Models;
using RestaurantManagement.Api.Services;

namespace RestaurantManagement.Api.Controllers
{
    // ==========================================
    // AUTH CONTROLLER (/api/auth)
    // ==========================================
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("customer-login")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.CustomerLoginAsync(request);
            if (!result.IsRegistered && !string.IsNullOrEmpty(request.Username) && !string.IsNullOrEmpty(request.Email))
            {
                if (result.OtpSent) return Ok(result);
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }

        [HttpPost("staff-login")]
        public async Task<IActionResult> StaffLogin([FromBody] StaffLoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.StaffLoginAsync(request);
            if (result == null) return Unauthorized(new { message = "Invalid Username or Password." });
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("create-chef")]
        public async Task<IActionResult> CreateChef([FromForm] ChefRegisterRequest request, IFormFile? Image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.CreateChefAsync(request);
            if (result == null) return BadRequest(new { message = "Username or Email is already registered." });

            if (Image != null)
            {
                try { SaveStaffImage(Image, request.Username); }
                catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
            }

            return Ok(new { message = "Chef account created successfully.", chefDetails = result });
        }

        private string SaveStaffImage(IFormFile file, string username)
        {
            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(imagesFolder)) Directory.CreateDirectory(imagesFolder);

            var extension = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"staff_{username.ToLower()}{extension}";
            var filePath = Path.Combine(imagesFolder, fileName);

            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);

            return $"/images/{fileName}";
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            return Ok(new
            {
                Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Username = User.FindFirst(ClaimTypes.Name)?.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Role = User.FindFirst(ClaimTypes.Role)?.Value,
                MobileNumber = User.FindFirst("MobileNumber")?.Value
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout() => Ok(new { message = "Logged out successfully." });

        [Authorize(Roles = "Admin,Chef")]
        [HttpGet("staff")]
        public async Task<IActionResult> GetAllStaff()
        {
            var list = await _authService.GetAllStaffAsync();
            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var resultList = list.Select(staff =>
            {
                string imageUrl = "";
                if (Directory.Exists(imagesFolder))
                {
                    var files = Directory.GetFiles(imagesFolder, $"staff_{staff.Username.ToLower()}.*");
                    if (files.Length > 0)
                    {
                        var filename = Path.GetFileName(files[0]);
                        imageUrl = $"{baseUrl}/images/{filename.Replace(" ", "%20")}";
                    }
                }
                return new
                {
                    staff.Id,
                    staff.Username,
                    staff.Email,
                    staff.MobileNumber,
                    staff.Role,
                    staff.DutyPeriod,
                    staff.IsOnDuty,
                    ImageUrl = imageUrl
                };
            });
            return Ok(resultList);
        }

        [Authorize(Roles = "Admin,Chef")]
        [HttpGet("staff/{id}")]
        public async Task<IActionResult> GetStaffById(int id)
        {
            var staff = await _authService.GetStaffByIdAsync(id);
            if (staff == null) return NotFound(new { message = "Staff member not found." });
            return Ok(staff);
        }

        [Authorize(Roles = "Admin,Chef")]
        [HttpPut("staff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromForm] ChefRegisterRequest request, IFormFile? Image)
        {
            var success = await _authService.UpdateStaffAsync(id, request);
            if (!success) return NotFound(new { message = "Staff member not found." });
            if (Image != null) SaveStaffImage(Image, request.Username);
            return Ok(new { message = "Staff member updated successfully." });
        }

        [Authorize(Roles = "Admin,Chef")]
        [HttpDelete("staff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var success = await _authService.DeleteStaffAsync(id);
            if (!success) return NotFound(new { message = "Staff member not found." });
            return Ok(new { message = "Staff member deleted successfully." });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers() => Ok(await _authService.GetAllCustomersAsync());

        [Authorize(Roles = "Admin")]
        [HttpGet("customers/{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var item = await _authService.GetCustomerByIdAsync(id);
            if (item == null) return NotFound(new { message = "Customer not found." });
            return Ok(item);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("customers/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerLoginRequest request)
        {
            var success = await _authService.UpdateCustomerAsync(id, request);
            if (!success) return NotFound(new { message = "Customer not found." });
            return Ok(new { message = "Customer updated successfully." });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("customers/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var success = await _authService.DeleteCustomerAsync(id);
            if (!success) return NotFound(new { message = "Customer not found." });
            return Ok(new { message = "Customer deleted successfully." });
        }
    }

    // ==========================================
    // PROFILE CONTROLLER (/api/profile)
    // ==========================================
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        public ProfileController(IProfileService profileService) => _profileService = profileService;

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(userRole) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid token or claims." });

            var profile = await _profileService.GetProfileAsync(userId, userRole);
            if (profile == null) return NotFound(new { message = "Profile not found." });
            return Ok(profile);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(userRole) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid token or claims." });

            var success = await _profileService.UpdateProfileAsync(userId, userRole, dto);
            if (!success) return BadRequest(new { message = "Failed to update profile details." });
            return Ok(new { message = "Profile updated successfully." });
        }
    }

    // ==========================================
    // MENU & CATEGORY CONTROLLERS
    // ==========================================
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService) => _categoryService = categoryService;

        [HttpGet]
        public IActionResult GetAll() => Ok(_categoryService.GetAllCategories());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _categoryService.GetCategoryById(id);
            if (item == null) return NotFound(new { message = $"Category with ID {id} not found." });
            return Ok(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CategoryCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = _categoryService.CreateCategory(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CategoryUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var ok = _categoryService.UpdateCategory(id, dto);
            if (!ok) return NotFound(new { message = $"Category with ID {id} not found." });
            return Ok(new { message = "Category updated successfully." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ok = _categoryService.DeleteCategory(id);
            if (!ok) return NotFound(new { message = $"Category with ID {id} not found." });
            return Ok(new { message = "Category deleted successfully." });
        }
    }

    [ApiController]
    [Route("api/menuitems")]
    public class MenuItemController : ControllerBase
    {
        private readonly IMenuItemService _menuItemService;
        public MenuItemController(IMenuItemService menuItemService) => _menuItemService = menuItemService;

        [HttpGet]
        public IActionResult GetAll() => Ok(_menuItemService.GetAllMenuItems());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _menuItemService.GetMenuItemById(id);
            if (item == null) return NotFound(new { message = $"Menu item with ID {id} not found." });
            return Ok(item);
        }

        private string? SaveUploadedImage(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;
            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(imagesFolder)) Directory.CreateDirectory(imagesFolder);

            var extension = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(imagesFolder, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);
            return $"/images/{fileName}";
        }

        [HttpPost]
        public IActionResult Create([FromForm] MenuItemCreateDto menuItemDto, IFormFile? Image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (Image != null) menuItemDto.ImageUrl = SaveUploadedImage(Image);
            var created = _menuItemService.CreateMenuItem(menuItemDto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromForm] MenuItemUpdateDto menuItemDto, IFormFile? Image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (Image != null) menuItemDto.ImageUrl = SaveUploadedImage(Image);
            var ok = _menuItemService.UpdateMenuItem(id, menuItemDto);
            if (!ok) return NotFound(new { message = $"Menu item with ID {id} not found." });
            return Ok(new { message = "Menu item updated successfully." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ok = _menuItemService.DeleteMenuItem(id);
            if (!ok) return NotFound(new { message = $"Menu item with ID {id} not found." });
            return Ok(new { message = "Menu item deleted successfully." });
        }
    }

    // ==========================================
    // ORDER & PAYMENT CONTROLLERS
    // ==========================================
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _repository;
        public OrdersController(IOrderRepository repository) => _repository = repository;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _repository.GetAll();
            var response = orders.Select(order => new OrderResponseDto
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
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _repository.GetById(id);
            if (order == null) return NotFound($"Order with ID {id} was not found.");
            return Ok(new OrderResponseDto
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
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            if (dto == null) return BadRequest("Order data is required.");

            var order = new Order
            {
                TableId = dto.TableId <= 0 ? 1 : dto.TableId,
                OrderItems = dto.OrderItems ?? "",
                Price = dto.Price,
                Notes = dto.Notes,
                Status = dto.Status ?? "Pending",
                Quantity = dto.Quantity <= 0 ? 1 : dto.Quantity,
                Duration = dto.Duration ?? "15 mins",
                PaymentStatus = dto.PaymentStatus ?? "Pending",
                TransactionId = dto.TransactionId,
                PaymentMethod = dto.PaymentMethod,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.Create(order);
            await _repository.Save();

            return StatusCode(201, new OrderResponseDto
            {
                Id = created.Id,
                TableId = created.TableId,
                OrderItems = created.OrderItems,
                Price = created.Price,
                Notes = created.Notes,
                Status = created.Status,
                Quantity = created.Quantity,
                Duration = created.Duration,
                PaymentStatus = created.PaymentStatus,
                TransactionId = created.TransactionId,
                PaymentMethod = created.PaymentMethod
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOrderDto dto)
        {
            var existing = await _repository.GetById(id);
            if (existing == null) return NotFound($"Order with ID {id} was not found.");

            existing.TableId = dto.TableId;
            existing.OrderItems = dto.OrderItems;
            existing.Price = dto.Price;
            existing.Notes = dto.Notes;
            existing.Status = dto.Status;
            existing.Quantity = dto.Quantity;
            existing.Duration = dto.Duration;

            await _repository.Update(existing);
            await _repository.Save();
            return Ok(new { message = "Order updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _repository.GetById(id);
            if (existing == null) return NotFound($"Order with ID {id} was not found.");

            await _repository.Delete(id);
            await _repository.Save();
            return Ok(new { message = "Order deleted successfully" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentGatewayService _paymentService;
        public PaymentsController(IPaymentGatewayService paymentService) => _paymentService = paymentService;

        [HttpPost("process")]
        public async Task<IActionResult> Process([FromBody] PaymentRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var response = await _paymentService.ProcessPaymentAsync(dto);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
    }

    // ==========================================
    // INVENTORY CONTROLLERS
    // ==========================================
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        public InventoryController(IInventoryService inventoryService) => _inventoryService = inventoryService;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? status, [FromQuery] bool? isLowStock)
        {
            if (isLowStock == true) return Ok(await _inventoryService.GetLowStockAlertsAsync());
            if (!string.IsNullOrWhiteSpace(search)) return Ok(await _inventoryService.SearchInventoryAsync(search));
            if (!string.IsNullOrWhiteSpace(category)) return Ok(await _inventoryService.FilterByCategoryAsync(category));
            if (!string.IsNullOrWhiteSpace(status)) return Ok(await _inventoryService.FilterByStatusAsync(status));
            return Ok(await _inventoryService.GetAllInventoryAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _inventoryService.GetInventoryByIdAsync(id);
            if (item == null) return NotFound(new { message = $"Inventory item with ID {id} not found." });
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateInventoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _inventoryService.AddInventoryAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateInventoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _inventoryService.UpdateInventoryAsync(id, dto);
            if (updated == null) return NotFound(new { message = $"Inventory item with ID {id} not found." });
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _inventoryService.DeleteInventoryAsync(id);
            if (!success) return NotFound(new { message = $"Inventory item with ID {id} not found." });
            return Ok(new { message = $"Inventory item with ID {id} deleted successfully." });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockAlerts([FromQuery] int? threshold) =>
            Ok(await _inventoryService.GetLowStockAlertsAsync(threshold));
    }

    [ApiController]
    [Route("api/inventory")]
    public class AiInventoryController : ControllerBase
    {
        private readonly IInventoryPredictionService _service;
        public AiInventoryController(IInventoryPredictionService service) => _service = service;

        [HttpGet("predict/{ingredient}")]
        public async Task<IActionResult> Predict(string ingredient, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(ingredient)) return BadRequest(new { message = "ingredient is required." });
            return Ok(await _service.GetAsync(ingredient, ct));
        }
    }

    // ==========================================
    // OFFER CONTROLLERS
    // ==========================================
    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;
        public OfferController(IOfferService offerService) => _offerService = offerService;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] bool? isActive)
        {
            if (isActive == true) return Ok(await _offerService.GetActiveOffersAsync());
            if (!string.IsNullOrWhiteSpace(search)) return Ok(await _offerService.SearchOffersAsync(search));
            return Ok(await _offerService.GetAllOffersAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var offer = await _offerService.GetOfferByIdAsync(id);
            if (offer == null) return NotFound(new { message = $"Offer with ID {id} not found." });
            return Ok(offer);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive() => Ok(await _offerService.GetActiveOffersAsync());

        [HttpGet("coupon/{code}")]
        public async Task<IActionResult> GetByCouponCode(string code)
        {
            var offer = await _offerService.GetOfferByCouponCodeAsync(code);
            if (offer == null) return NotFound(new { message = $"Offer with coupon code '{code}' not found." });
            return Ok(offer);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateOfferDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _offerService.AddOfferAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOfferDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _offerService.UpdateOfferAsync(id, dto);
            if (updated == null) return NotFound(new { message = $"Offer with ID {id} not found." });
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _offerService.DeleteOfferAsync(id);
            if (!success) return NotFound(new { message = $"Offer with ID {id} not found." });
            return Ok(new { message = $"Offer with ID {id} deleted successfully." });
        }
    }

    [ApiController]
    [Route("api/offers")]
    public class AiOffersController : ControllerBase
    {
        private readonly IOfferPredictionService _service;
        public AiOffersController(IOfferPredictionService service) => _service = service;

        [HttpGet("predict/{customerId:int}")]
        public async Task<IActionResult> Predict(int customerId, CancellationToken ct)
        {
            if (customerId <= 0) return BadRequest(new { message = "customerId must be positive." });
            return Ok(await _service.GetAsync(customerId, ct));
        }
    }

    // ==========================================
    // STAFF CONTROLLER (/api/Staff)
    // ==========================================
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _service;
        private readonly IWebHostEnvironment _environment;

        public StaffController(IStaffService service, IWebHostEnvironment environment)
        {
            _service = service;
            _environment = environment;
        }

        [HttpGet]
        public IActionResult GetAllStaff() => Ok(_service.GetAllStaff());

        [HttpGet("{id}")]
        public IActionResult GetStaffById(int id)
        {
            var staff = _service.GetStaffById(id);
            if (staff == null) return NotFound("Staff Not Found");
            return Ok(staff);
        }

        [HttpPost]
        public async Task<IActionResult> AddStaff([FromForm] AddStaffDto dto)
        {
            string imagePath = "";
            if (dto.Image != null)
            {
                var folder = Path.Combine(_environment.WebRootPath ?? Directory.GetCurrentDirectory(), "images");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(folder, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);
                imagePath = "/images/" + fileName;
            }

            var staff = new Staff
            {
                Name = dto.Name,
                Username = dto.Name,
                Role = dto.Role,
                Department = dto.Department,
                Email = dto.Email,
                Phone = dto.Phone,
                MobileNumber = dto.Phone,
                Status = dto.Status,
                ImageUrl = imagePath,
                PasswordHash = Helpers.PasswordHelper.HashPassword("StaffPassword@123")
            };

            _service.AddStaff(staff);
            return Ok(staff);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateStaff(int id, [FromBody] Staff staff)
        {
            staff.Id = id;
            _service.UpdateStaff(staff);
            return Ok(new { message = "Staff Updated Successfully" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStaff(int id)
        {
            _service.DeleteStaff(id);
            return Ok(new { message = "Staff Deleted Successfully" });
        }
    }

    // ==========================================
    // AI RECOMMENDATION & PREDICTION CONTROLLERS
    // ==========================================
    [ApiController]
    [Route("api/recommendations")]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationAiService _service;
        public RecommendationController(IRecommendationAiService service) => _service = service;

        [HttpGet("{customerId:int}")]
        public async Task<IActionResult> Get(int customerId, CancellationToken ct) =>
            Ok(await _service.GetAsync(customerId, ct));
    }

    [ApiController]
    [Route("api/prediction")]
    public class PredictionController : ControllerBase
    {
        private readonly IDemandPredictionService _service;
        public PredictionController(IDemandPredictionService service) => _service = service;

        [HttpGet("demand")]
        public async Task<IActionResult> Demand([FromQuery] string dish, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dish)) return BadRequest(new { message = "dish is required." });
            return Ok(await _service.GetAsync(dish.Trim(), ct));
        }
    }
}
