using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthManagementService.DTOs;
using AuthManagementService.Services;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Linq;

namespace AuthManagementService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ====================================================
        // AUTHENTICATION ENDPOINTS
        // ====================================================

        [HttpPost("customer-login")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.CustomerLoginAsync(request);

            if (!result.IsRegistered && !string.IsNullOrEmpty(request.Username) && !string.IsNullOrEmpty(request.Email))
            {
                if (result.OtpSent)
                {
                    return Ok(result);
                }
                return BadRequest(new { message = result.Message });
            }

            if (result.IsRegistered && result.OtpSent && string.IsNullOrEmpty(result.Token) && !string.IsNullOrEmpty(request.Otp))
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result);
        }

        [HttpPost("staff-login")]
        public async Task<IActionResult> StaffLogin([FromBody] StaffLoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.StaffLoginAsync(request);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid Username or Password." });
            }

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("create-chef")]
        public async Task<IActionResult> CreateChef([FromForm] ChefRegisterRequest request, IFormFile? Image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                request.Password = Guid.NewGuid().ToString();
            }

            var result = await _authService.CreateChefAsync(request);
            if (result == null)
            {
                return BadRequest(new { message = "Username or Email is already registered." });
            }

            if (Image != null)
            {
                try
                {
                    SaveStaffImage(Image, request.Username);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

            return Ok(new { message = "Chef account created successfully.", chefDetails = result });
        }

        private string SaveStaffImage(IFormFile file, string username)
        {
            if (file == null || file.Length == 0)
            {
                return string.Empty;
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!System.Linq.Enumerable.Contains(allowedExtensions, extension))
            {
                throw new ArgumentException("Only JPG, JPEG, PNG, and WEBP image formats are allowed.");
            }

            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            var fileName = $"staff_{username.ToLower()}{extension}";
            var filePath = Path.Combine(imagesFolder, fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return $"/images/{fileName}";
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var mobileNumber = User.FindFirst("MobileNumber")?.Value;

            return Ok(new
            {
                Id = userId,
                Username = username,
                Email = email,
                Role = role,
                MobileNumber = mobileNumber
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully. Please delete the token from the client-side storage." });
        }
        // ====================================================
        // STAFF CRUD ENDPOINTS (Admin Only)
        // ====================================================

        [Authorize(Roles = "Admin,Chef")]
        [HttpGet("staff")]
        public async Task<IActionResult> GetAllStaff()
        {
            var list = await _authService.GetAllStaffAsync();
            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");

            var resultList = list.Select(staff => {
                string imageUrl = "";
                if (Directory.Exists(imagesFolder))
                {
                    var files = Directory.GetFiles(imagesFolder, $"staff_{staff.Username.ToLower()}.*");
                    if (files.Length > 0)
                    {
                        var filename = Path.GetFileName(files[0]);
                        imageUrl = $"https://localhost:44383/images/{filename.Replace(" ", "%20")}";
                    }
                }

                return new {
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
            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found." });
            }

            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var imagesFolder = Path.Combine(wwwRootPath, "images");
            string imageUrl = "";
            if (Directory.Exists(imagesFolder))
            {
                var files = Directory.GetFiles(imagesFolder, $"staff_{staff.Username.ToLower()}.*");
                if (files.Length > 0)
                {
                    var filename = Path.GetFileName(files[0]);
                    imageUrl = $"https://localhost:44383/images/{filename.Replace(" ", "%20")}";
                }
            }

            return Ok(new {
                staff.Id,
                staff.Username,
                staff.Email,
                staff.MobileNumber,
                staff.Role,
                staff.DutyPeriod,
                staff.IsOnDuty,
                ImageUrl = imageUrl
            });
        }

        [Authorize(Roles = "Admin,Chef")]
        [HttpPut("staff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromForm] ChefRegisterRequest request, IFormFile? Image)
        {
            var success = await _authService.UpdateStaffAsync(id, request);
            if (!success)
            {
                return NotFound(new { message = "Staff member not found or update failed." });
            }

            if (Image != null)
            {
                try
                {
                    SaveStaffImage(Image, request.Username);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

            return Ok(new { message = "Staff member updated successfully." });
        }

        [Authorize(Roles = "Admin,Chef")]
        [HttpDelete("staff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var success = await _authService.DeleteStaffAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Staff member not found or deletion failed." });
            }
            return Ok(new { message = "Staff member deleted successfully." });
        }

        // ====================================================
        // CUSTOMER CRUD ENDPOINTS (Admin Only)
        // ====================================================

        [Authorize(Roles = "Admin")]
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var list = await _authService.GetAllCustomersAsync();
            return Ok(list);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("customers/{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var item = await _authService.GetCustomerByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Customer not found." });
            }
            return Ok(item);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("customers/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerLoginRequest request)
        {
            var success = await _authService.UpdateCustomerAsync(id, request);
            if (!success)
            {
                return NotFound(new { message = "Customer not found or update failed." });
            }
            return Ok(new { message = "Customer updated successfully." });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("customers/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var success = await _authService.DeleteCustomerAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Customer not found or deletion failed." });
            }
            return Ok(new { message = "Customer deleted successfully." });
        }
    }
}
