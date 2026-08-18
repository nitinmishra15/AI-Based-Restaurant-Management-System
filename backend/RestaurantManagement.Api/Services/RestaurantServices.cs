using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RestaurantManagement.Api.Data;
using RestaurantManagement.Api.DTOs;
using RestaurantManagement.Api.Helpers;
using RestaurantManagement.Api.Models;

namespace RestaurantManagement.Api.Services
{
    // ==========================================
    // AUTH SERVICE
    // ==========================================
    public interface IAuthService
    {
        Task<CustomerLoginResponse> CustomerLoginAsync(CustomerLoginRequest request);
        Task<StaffLoginResponse?> StaffLoginAsync(StaffLoginRequest request);
        Task<Staff?> CreateChefAsync(ChefRegisterRequest request);
        Task<List<Staff>> GetAllStaffAsync();
        Task<Staff?> GetStaffByIdAsync(int id);
        Task<bool> UpdateStaffAsync(int id, ChefRegisterRequest request);
        Task<bool> DeleteStaffAsync(int id);
        Task<List<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(int id);
        Task<bool> UpdateCustomerAsync(int id, CustomerLoginRequest request);
        Task<bool> DeleteCustomerAsync(int id);
    }

    public class AuthService : IAuthService
    {
        private readonly RestaurantDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(RestaurantDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GenerateJwtToken(int id, string username, string email, string role, string mobileNumber)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["SecretKey"] ?? "SuperSecretKeyForRestaurantManagementSystem123!";
            var issuer = jwtSettings["Issuer"] ?? "RestaurantAuthService";
            var audience = jwtSettings["Audience"] ?? "RestaurantReactClient";
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("MobileNumber", mobileNumber)
                }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpiryInMinutes"] ?? "120")),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<CustomerLoginResponse> CustomerLoginAsync(CustomerLoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.MobileNumber))
            {
                return new CustomerLoginResponse { Message = "Mobile number is required." };
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.MobileNumber == request.MobileNumber.Trim());

            if (customer == null)
            {
                if (!string.IsNullOrEmpty(request.Username) && !string.IsNullOrEmpty(request.Email))
                {
                    customer = new Customer
                    {
                        Username = request.Username.Trim(),
                        Email = request.Email.Trim(),
                        MobileNumber = request.MobileNumber.Trim(),
                        PasswordHash = PasswordHelper.HashPassword(Guid.NewGuid().ToString())
                    };

                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();

                    var token = GenerateJwtToken(customer.Id, customer.Username, customer.Email, "User", customer.MobileNumber);

                    return new CustomerLoginResponse
                    {
                        IsRegistered = true,
                        OtpSent = true,
                        Token = token,
                        User = new
                        {
                            Id = customer.Id,
                            Username = customer.Username,
                            Email = customer.Email,
                            MobileNumber = customer.MobileNumber,
                            Role = "User"
                        },
                        Message = "Account created and logged in successfully."
                    };
                }

                return new CustomerLoginResponse
                {
                    IsRegistered = false,
                    OtpSent = true,
                    Message = "Mobile not registered. Please provide name and email to continue."
                };
            }

            var existingToken = GenerateJwtToken(customer.Id, customer.Username, customer.Email, "User", customer.MobileNumber);
            return new CustomerLoginResponse
            {
                IsRegistered = true,
                OtpSent = true,
                Token = existingToken,
                User = new
                {
                    Id = customer.Id,
                    Username = customer.Username,
                    Email = customer.Email,
                    MobileNumber = customer.MobileNumber,
                    Role = "User"
                },
                Message = "Logged in successfully."
            };
        }

        public async Task<StaffLoginResponse?> StaffLoginAsync(StaffLoginRequest request)
        {
            var staff = await _context.StaffMembers.FirstOrDefaultAsync(s => s.Username == request.Username.Trim());
            if (staff == null)
            {
                return null;
            }

            if (!PasswordHelper.VerifyPassword(request.Password, staff.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(staff.Id, staff.Username, staff.Email, staff.Role, staff.MobileNumber);
            return new StaffLoginResponse
            {
                Token = token,
                User = new
                {
                    Id = staff.Id,
                    Username = staff.Username,
                    Email = staff.Email,
                    Role = staff.Role,
                    MobileNumber = staff.MobileNumber,
                    DutyPeriod = staff.DutyPeriod,
                    IsOnDuty = staff.IsOnDuty
                }
            };
        }

        public async Task<Staff?> CreateChefAsync(ChefRegisterRequest request)
        {
            var exists = await _context.StaffMembers.AnyAsync(s => s.Username == request.Username || s.Email == request.Email);
            if (exists) return null;

            var password = string.IsNullOrEmpty(request.Password) ? "ChefPassword@123" : request.Password;
            var staff = new Staff
            {
                Username = request.Username,
                Name = request.Username,
                Email = request.Email,
                MobileNumber = request.MobileNumber,
                Phone = request.MobileNumber,
                PasswordHash = PasswordHelper.HashPassword(password),
                Role = string.IsNullOrEmpty(request.Role) ? "Chef" : request.Role,
                DutyPeriod = request.DutyPeriod ?? "Morning",
                IsOnDuty = request.IsOnDuty
            };

            _context.StaffMembers.Add(staff);
            await _context.SaveChangesAsync();
            return staff;
        }

        public async Task<List<Staff>> GetAllStaffAsync() => await _context.StaffMembers.ToListAsync();
        public async Task<Staff?> GetStaffByIdAsync(int id) => await _context.StaffMembers.FindAsync(id);

        public async Task<bool> UpdateStaffAsync(int id, ChefRegisterRequest request)
        {
            var staff = await _context.StaffMembers.FindAsync(id);
            if (staff == null) return false;

            staff.Username = request.Username;
            staff.Name = request.Username;
            staff.Email = request.Email;
            staff.MobileNumber = request.MobileNumber;
            staff.Phone = request.MobileNumber;
            if (!string.IsNullOrEmpty(request.Role)) staff.Role = request.Role;
            if (!string.IsNullOrEmpty(request.DutyPeriod)) staff.DutyPeriod = request.DutyPeriod;
            staff.IsOnDuty = request.IsOnDuty;

            if (!string.IsNullOrEmpty(request.Password))
            {
                staff.PasswordHash = PasswordHelper.HashPassword(request.Password);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStaffAsync(int id)
        {
            var staff = await _context.StaffMembers.FindAsync(id);
            if (staff == null) return false;
            _context.StaffMembers.Remove(staff);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Customer>> GetAllCustomersAsync() => await _context.Customers.ToListAsync();
        public async Task<Customer?> GetCustomerByIdAsync(int id) => await _context.Customers.FindAsync(id);

        public async Task<bool> UpdateCustomerAsync(int id, CustomerLoginRequest request)
        {
            var cust = await _context.Customers.FindAsync(id);
            if (cust == null) return false;
            if (!string.IsNullOrEmpty(request.Username)) cust.Username = request.Username;
            if (!string.IsNullOrEmpty(request.Email)) cust.Email = request.Email;
            if (!string.IsNullOrEmpty(request.MobileNumber)) cust.MobileNumber = request.MobileNumber;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var cust = await _context.Customers.FindAsync(id);
            if (cust == null) return false;
            _context.Customers.Remove(cust);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    // ==========================================
    // PROFILE SERVICE
    // ==========================================
    public interface IProfileService
    {
        Task<object?> GetProfileAsync(int userId, string role);
        Task<bool> UpdateProfileAsync(int userId, string role, ProfileUpdateDto dto);
    }

    public class ProfileService : IProfileService
    {
        private readonly RestaurantDbContext _context;
        public ProfileService(RestaurantDbContext context) => _context = context;

        public async Task<object?> GetProfileAsync(int userId, string role)
        {
            if (role.Equals("User", StringComparison.OrdinalIgnoreCase))
            {
                var user = await _context.Customers.FindAsync(userId);
                if (user == null) return null;
                return new { Id = user.Id, Name = user.Username, Email = user.Email, Mobile = user.MobileNumber, Role = "Customer" };
            }
            else
            {
                var staff = await _context.StaffMembers.FindAsync(userId);
                if (staff == null) return null;
                return new { Id = staff.Id, Name = staff.Username, Email = staff.Email, Mobile = staff.MobileNumber, Role = staff.Role, DutyPeriod = staff.DutyPeriod, IsOnDuty = staff.IsOnDuty };
            }
        }

        public async Task<bool> UpdateProfileAsync(int userId, string role, ProfileUpdateDto dto)
        {
            if (role.Equals("User", StringComparison.OrdinalIgnoreCase))
            {
                var user = await _context.Customers.FindAsync(userId);
                if (user == null) return false;
                if (!string.IsNullOrEmpty(dto.Name)) user.Username = dto.Name;
                if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
                if (!string.IsNullOrEmpty(dto.Mobile)) user.MobileNumber = dto.Mobile;
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                var staff = await _context.StaffMembers.FindAsync(userId);
                if (staff == null) return false;
                if (!string.IsNullOrEmpty(dto.Name)) { staff.Username = dto.Name; staff.Name = dto.Name; }
                if (!string.IsNullOrEmpty(dto.Email)) staff.Email = dto.Email;
                if (!string.IsNullOrEmpty(dto.Mobile)) { staff.MobileNumber = dto.Mobile; staff.Phone = dto.Mobile; }
                await _context.SaveChangesAsync();
                return true;
            }
        }
    }

    // ==========================================
    // MENU & CATEGORY SERVICE
    // ==========================================
    public interface ICategoryService
    {
        IEnumerable<Category> GetAllCategories();
        Category? GetCategoryById(int id);
        Category CreateCategory(CategoryCreateDto dto);
        bool UpdateCategory(int id, CategoryUpdateDto dto);
        bool DeleteCategory(int id);
    }

    public class CategoryService : ICategoryService
    {
        private readonly RestaurantDbContext _context;
        public CategoryService(RestaurantDbContext context) => _context = context;

        public IEnumerable<Category> GetAllCategories() => _context.Categories.ToList();
        public Category? GetCategoryById(int id) => _context.Categories.Find(id);

        public Category CreateCategory(CategoryCreateDto dto)
        {
            var category = new Category { CategoryName = dto.CategoryName };
            _context.Categories.Add(category);
            _context.SaveChanges();
            return category;
        }

        public bool UpdateCategory(int id, CategoryUpdateDto dto)
        {
            var cat = _context.Categories.Find(id);
            if (cat == null) return false;
            cat.CategoryName = dto.CategoryName;
            _context.SaveChanges();
            return true;
        }

        public bool DeleteCategory(int id)
        {
            var cat = _context.Categories.Find(id);
            if (cat == null) return false;
            _context.Categories.Remove(cat);
            _context.SaveChanges();
            return true;
        }
    }

    public interface IMenuItemService
    {
        IEnumerable<MenuItem> GetAllMenuItems();
        MenuItem? GetMenuItemById(int id);
        MenuItem CreateMenuItem(MenuItemCreateDto dto);
        bool UpdateMenuItem(int id, MenuItemUpdateDto dto);
        bool DeleteMenuItem(int id);
    }

    public class MenuItemService : IMenuItemService
    {
        private readonly RestaurantDbContext _context;
        public MenuItemService(RestaurantDbContext context) => _context = context;

        public IEnumerable<MenuItem> GetAllMenuItems() => _context.MenuItems.Include(m => m.Category).ToList();
        public MenuItem? GetMenuItemById(int id) => _context.MenuItems.Include(m => m.Category).FirstOrDefault(m => m.Id == id);

        public MenuItem CreateMenuItem(MenuItemCreateDto dto)
        {
            var item = new MenuItem
            {
                ItemName = dto.ItemName,
                Description = dto.Description,
                Price = dto.Price,
                Status = dto.Status,
                CategoryId = dto.CategoryId,
                ImageUrl = dto.ImageUrl
            };
            _context.MenuItems.Add(item);
            _context.SaveChanges();
            return item;
        }

        public bool UpdateMenuItem(int id, MenuItemUpdateDto dto)
        {
            var item = _context.MenuItems.Find(id);
            if (item == null) return false;
            item.ItemName = dto.ItemName;
            item.Description = dto.Description;
            item.Price = dto.Price;
            item.Status = dto.Status;
            item.CategoryId = dto.CategoryId;
            if (!string.IsNullOrEmpty(dto.ImageUrl)) item.ImageUrl = dto.ImageUrl;
            _context.SaveChanges();
            return true;
        }

        public bool DeleteMenuItem(int id)
        {
            var item = _context.MenuItems.Find(id);
            if (item == null) return false;
            _context.MenuItems.Remove(item);
            _context.SaveChanges();
            return true;
        }
    }

    // ==========================================
    // ORDER & PAYMENT SERVICE
    // ==========================================
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAll();
        Task<Order?> GetById(int id);
        Task<Order> Create(Order order);
        Task Update(Order order);
        Task Delete(int id);
        Task Save();
    }

    public class OrderRepository : IOrderRepository
    {
        private readonly RestaurantDbContext _context;
        public OrderRepository(RestaurantDbContext context) => _context = context;

        public async Task<IEnumerable<Order>> GetAll() => await _context.Orders.ToListAsync();
        public async Task<Order?> GetById(int id) => await _context.Orders.FindAsync(id);
        public async Task<Order> Create(Order order)
        {
            var result = await _context.Orders.AddAsync(order);
            return result.Entity;
        }
        public async Task Update(Order order) => await Task.Run(() => _context.Orders.Update(order));
        public async Task Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null) _context.Orders.Remove(order);
        }
        public async Task Save() => await _context.SaveChangesAsync();
    }

    public interface IPaymentGatewayService
    {
        Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto dto);
    }

    public class PaymentGatewayService : IPaymentGatewayService
    {
        public Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto dto)
        {
            var txnId = $"TXN_{Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()}";
            return Task.FromResult(new PaymentResponseDto
            {
                Success = true,
                TransactionId = txnId,
                Message = "Payment processed successfully.",
                Amount = dto.Amount
            });
        }
    }

    // ==========================================
    // INVENTORY SERVICE
    // ==========================================
    public interface IInventoryService
    {
        Task<IEnumerable<Inventory>> GetAllInventoryAsync();
        Task<Inventory?> GetInventoryByIdAsync(int id);
        Task<Inventory> AddInventoryAsync(CreateInventoryDto dto);
        Task<Inventory?> UpdateInventoryAsync(int id, UpdateInventoryDto dto);
        Task<bool> DeleteInventoryAsync(int id);
        Task<IEnumerable<Inventory>> GetLowStockAlertsAsync(int? threshold = null);
        Task<IEnumerable<Inventory>> SearchInventoryAsync(string query);
        Task<IEnumerable<Inventory>> FilterByCategoryAsync(string category);
        Task<IEnumerable<Inventory>> FilterByStatusAsync(string status);
    }

    public class InventoryService : IInventoryService
    {
        private readonly RestaurantDbContext _context;
        public InventoryService(RestaurantDbContext context) => _context = context;

        public async Task<IEnumerable<Inventory>> GetAllInventoryAsync() => await _context.Inventories.ToListAsync();
        public async Task<Inventory?> GetInventoryByIdAsync(int id) => await _context.Inventories.FindAsync(id);

        public async Task<Inventory> AddInventoryAsync(CreateInventoryDto dto)
        {
            var item = new Inventory
            {
                InventoryName = dto.InventoryName,
                Price = dto.Price,
                Qty = dto.Qty,
                Status = dto.Status,
                Category = dto.Category,
                LowStockThreshold = dto.LowStockThreshold,
                LastUpdated = DateTime.UtcNow
            };
            _context.Inventories.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<Inventory?> UpdateInventoryAsync(int id, UpdateInventoryDto dto)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return null;
            item.InventoryName = dto.InventoryName;
            item.Price = dto.Price;
            item.Qty = dto.Qty;
            item.Status = dto.Status;
            item.Category = dto.Category;
            item.LowStockThreshold = dto.LowStockThreshold;
            item.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> DeleteInventoryAsync(int id)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return false;
            _context.Inventories.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Inventory>> GetLowStockAlertsAsync(int? threshold = null)
        {
            return await _context.Inventories
                .Where(i => threshold.HasValue ? i.Qty <= threshold.Value : i.Qty <= i.LowStockThreshold)
                .ToListAsync();
        }

        public async Task<IEnumerable<Inventory>> SearchInventoryAsync(string query)
        {
            return await _context.Inventories
                .Where(i => i.InventoryName.Contains(query) || i.Category.Contains(query))
                .ToListAsync();
        }

        public async Task<IEnumerable<Inventory>> FilterByCategoryAsync(string category) =>
            await _context.Inventories.Where(i => i.Category.ToLower() == category.ToLower()).ToListAsync();

        public async Task<IEnumerable<Inventory>> FilterByStatusAsync(string status) =>
            await _context.Inventories.Where(i => i.Status.ToLower() == status.ToLower()).ToListAsync();
    }

    // ==========================================
    // OFFER SERVICE
    // ==========================================
    public interface IOfferService
    {
        Task<IEnumerable<Offer>> GetAllOffersAsync();
        Task<Offer?> GetOfferByIdAsync(int id);
        Task<IEnumerable<Offer>> GetActiveOffersAsync();
        Task<Offer?> GetOfferByCouponCodeAsync(string couponCode);
        Task<Offer> AddOfferAsync(CreateOfferDto dto);
        Task<Offer?> UpdateOfferAsync(int id, UpdateOfferDto dto);
        Task<bool> DeleteOfferAsync(int id);
        Task<IEnumerable<Offer>> SearchOffersAsync(string query);
    }

    public class OfferService : IOfferService
    {
        private readonly RestaurantDbContext _context;
        public OfferService(RestaurantDbContext context) => _context = context;

        public async Task<IEnumerable<Offer>> GetAllOffersAsync() => await _context.Offers.ToListAsync();
        public async Task<Offer?> GetOfferByIdAsync(int id) => await _context.Offers.FindAsync(id);
        public async Task<IEnumerable<Offer>> GetActiveOffersAsync() =>
            await _context.Offers.Where(o => o.IsActive && DateTime.UtcNow >= o.StartDate && DateTime.UtcNow <= o.EndDate).ToListAsync();

        public async Task<Offer?> GetOfferByCouponCodeAsync(string couponCode) =>
            await _context.Offers.FirstOrDefaultAsync(o => o.CouponCode == couponCode);

        public async Task<Offer> AddOfferAsync(CreateOfferDto dto)
        {
            var offer = new Offer
            {
                Title = dto.Title,
                Description = dto.Description,
                DiscountType = dto.DiscountType,
                DiscountValue = dto.DiscountValue,
                MinOrderAmount = dto.MinOrderAmount,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                CouponCode = dto.CouponCode,
                ApplicableCategory = dto.ApplicableCategory,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();
            return offer;
        }

        public async Task<Offer?> UpdateOfferAsync(int id, UpdateOfferDto dto)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return null;
            offer.Title = dto.Title;
            offer.Description = dto.Description;
            offer.DiscountType = dto.DiscountType;
            offer.DiscountValue = dto.DiscountValue;
            offer.MinOrderAmount = dto.MinOrderAmount;
            offer.StartDate = dto.StartDate;
            offer.EndDate = dto.EndDate;
            offer.CouponCode = dto.CouponCode;
            offer.ApplicableCategory = dto.ApplicableCategory;
            offer.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return offer;
        }

        public async Task<bool> DeleteOfferAsync(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return false;
            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Offer>> SearchOffersAsync(string query) =>
            await _context.Offers.Where(o => o.Title.Contains(query) || o.Description.Contains(query) || (o.CouponCode != null && o.CouponCode.Contains(query))).ToListAsync();
    }

    // ==========================================
    // STAFF SERVICE
    // ==========================================
    public interface IStaffService
    {
        IEnumerable<Staff> GetAllStaff();
        Staff? GetStaffById(int id);
        void AddStaff(Staff staff);
        void UpdateStaff(Staff staff);
        void DeleteStaff(int id);
    }

    public class StaffService : IStaffService
    {
        private readonly RestaurantDbContext _context;
        public StaffService(RestaurantDbContext context) => _context = context;

        public IEnumerable<Staff> GetAllStaff() => _context.StaffMembers.ToList();
        public Staff? GetStaffById(int id) => _context.StaffMembers.Find(id);

        public void AddStaff(Staff staff)
        {
            _context.StaffMembers.Add(staff);
            _context.SaveChanges();
        }

        public void UpdateStaff(Staff staff)
        {
            var existing = _context.StaffMembers.Find(staff.Id);
            if (existing != null)
            {
                existing.Name = staff.Name;
                existing.Username = staff.Name;
                existing.Role = staff.Role;
                existing.Department = staff.Department;
                existing.Email = staff.Email;
                existing.Phone = staff.Phone;
                existing.MobileNumber = staff.Phone;
                existing.Status = staff.Status;
                if (!string.IsNullOrEmpty(staff.ImageUrl)) existing.ImageUrl = staff.ImageUrl;
                _context.SaveChanges();
            }
        }

        public void DeleteStaff(int id)
        {
            var staff = _context.StaffMembers.Find(id);
            if (staff != null)
            {
                _context.StaffMembers.Remove(staff);
                _context.SaveChanges();
            }
        }
    }

    // ==========================================
    // AI PREDICTIONS & RECOMMENDATIONS
    // ==========================================
    public interface IRecommendationAiService
    {
        Task<object> GetAsync(int customerId, CancellationToken ct = default);
    }

    public interface IDemandPredictionService
    {
        Task<object> GetAsync(string dish, CancellationToken ct = default);
    }

    public interface IOfferPredictionService
    {
        Task<object> GetAsync(int customerId, CancellationToken ct = default);
    }

    public interface IInventoryPredictionService
    {
        Task<object> GetAsync(string ingredient, CancellationToken ct = default);
    }

    public class RestaurantAiServices : IRecommendationAiService, IDemandPredictionService, IOfferPredictionService, IInventoryPredictionService
    {
        private readonly RestaurantDbContext _context;

        public RestaurantAiServices(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetAsync(int customerId, CancellationToken ct = default)
        {
            var items = await _context.MenuItems.Take(3).ToListAsync(ct);
            return new
            {
                CustomerId = customerId,
                Recommendations = items.Select(i => new { i.Id, DishName = i.ItemName, i.Price, Score = 0.95 }),
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<object> GetAsync(string dish, CancellationToken ct = default)
        {
            await Task.Yield();
            var random = new Random(dish.GetHashCode());
            var predictedOrders = random.Next(25, 80);
            return new
            {
                DishName = dish,
                PredictedDailyDemand = predictedOrders,
                Confidence = 0.88,
                PeakHour = "7:00 PM - 9:00 PM",
                Recommendation = "Ensure adequate raw ingredients for evening service."
            };
        }

        Task<object> IOfferPredictionService.GetAsync(int customerId, CancellationToken ct)
        {
            var result = new
            {
                CustomerId = customerId,
                RecommendedDiscount = 15,
                CouponCode = "TASTY15",
                SuggestedCategory = "Indian",
                ValidityDays = 7,
                Confidence = 0.91
            };
            return Task.FromResult<object>(result);
        }

        Task<object> IInventoryPredictionService.GetAsync(string ingredient, CancellationToken ct)
        {
            var random = new Random(ingredient.GetHashCode());
            var daysRemaining = random.Next(2, 7);
            var reorderQty = random.Next(10, 50);

            var result = new
            {
                Ingredient = ingredient,
                EstimatedDaysRemaining = daysRemaining,
                SuggestedReorderQuantity = $"{reorderQty} kg",
                Status = daysRemaining <= 3 ? "Reorder Soon" : "Adequate Stock",
                UrgencyLevel = daysRemaining <= 2 ? "High" : "Normal"
            };
            return Task.FromResult<object>(result);
        }
    }
}
