using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AuthManagementService.DTOs;
using AuthManagementService.Helpers;
using AuthManagementService.Models;
using AuthManagementService.Repositories;

namespace AuthManagementService.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        // In-memory store for generated OTPs (Mobile -> OTP)
        private static readonly Dictionary<string, string> _activeOtps = new();
        private static readonly HttpClient _httpClient = new();

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        // ====================================================
        // AUTHENTICATION LOGIC
        // ====================================================

        public async Task<CustomerLoginResponse> CustomerLoginAsync(CustomerLoginRequest request)
        {
            // 1. Check if customer already exists by Mobile Number
            var customer = await _userRepository.GetCustomerByMobileNumberAsync(request.MobileNumber);

            if (customer != null)
            {
                // Customer exists!
                // If they did not send an OTP, generate and save a new OTP code
                if (string.IsNullOrEmpty(request.Otp))
                {
                    var generatedOtp = await SendOtpViaNotificationServiceAsync(request.MobileNumber, customer.Email, customer.Name);
                    _activeOtps[request.MobileNumber] = generatedOtp;

                    return new CustomerLoginResponse
                    {
                        IsRegistered = true,
                        OtpSent = true,
                        Message = $"OTP sent to your registered mobile number. (For Testing, your OTP is: {generatedOtp})"
                    };
                }

                // If OTP is provided, verify it
                if (_activeOtps.TryGetValue(request.MobileNumber, out var storedOtp) && request.Otp == storedOtp)
                {
                    _activeOtps.Remove(request.MobileNumber); // Clean up OTP
                    return GenerateCustomerLoginResponse(customer, "Login successful!");
                }

                return new CustomerLoginResponse
                {
                    IsRegistered = true,
                    OtpSent = true,
                    Message = "Invalid OTP code. Please try again."
                };
            }

            // 2. Customer does NOT exist in the database!
            // If they didn't submit Name or Email, prompt the frontend to request them
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Email))
            {
                return new CustomerLoginResponse
                {
                    IsRegistered = false,
                    OtpSent = false,
                    Message = "Mobile number not registered. Please provide your Name and Email to register."
                };
            }

            // Check if name or email conflicts with a registered staff member
            var conflict = await _userRepository.StaffExistsByUsernameOrEmailAsync(request.Username, request.Email);
            if (conflict)
            {
                return new CustomerLoginResponse
                {
                    IsRegistered = false,
                    OtpSent = false,
                    Message = "Username or Email is already registered by a staff member."
                };
            }

            // If OTP is null/empty for a new registration request, generate and send an OTP
            if (string.IsNullOrEmpty(request.Otp))
            {
                var generatedOtp = await SendOtpViaNotificationServiceAsync(request.MobileNumber, request.Email, request.Username);
                _activeOtps[request.MobileNumber] = generatedOtp;

                return new CustomerLoginResponse
                {
                    IsRegistered = false,
                    OtpSent = true,
                    Message = $"OTP sent to your mobile number. (For Testing, your OTP is: {generatedOtp})"
                };
            }

            // If OTP is provided, verify it before completing registration
            if (_activeOtps.TryGetValue(request.MobileNumber, out var registrationOtp) && request.Otp == registrationOtp)
            {
                _activeOtps.Remove(request.MobileNumber); // Clean up OTP

                // Create new customer record
                var newCustomer = new Customer
                {
                    Name = request.Username,
                    Email = request.Email,
                    MobileNumber = request.MobileNumber,
                    CreatedAt = DateTime.UtcNow
                };

                await _userRepository.AddCustomerAsync(newCustomer);
                await _userRepository.SaveChangesAsync();

                // Auto-login and issue token
                return GenerateCustomerLoginResponse(newCustomer, "Registration and login successful!");
            }

            return new CustomerLoginResponse
            {
                IsRegistered = false,
                OtpSent = true,
                Message = "Invalid OTP code. Please try again."
            };
        }

        public async Task<LoginResponse?> StaffLoginAsync(StaffLoginRequest request)
        {
            var staff = await _userRepository.GetStaffByUsernameAsync(request.Username);

            if (staff == null)
                return null;

            // Verify password
            bool isCorrect = PasswordHelper.VerifyPassword(request.Password, staff.PasswordHash);
            if (!isCorrect)
                return null;

            // Generate Token
            var tokenResponse = GenerateStaffToken(staff);
            return tokenResponse;
        }

        public async Task<UserDto?> CreateChefAsync(ChefRegisterRequest request)
        {
            // Check conflicts
            var exists = await _userRepository.StaffExistsByUsernameOrEmailAsync(request.Username, request.Email);
            if (exists)
                return null;

            var chef = new Staff
            {
                Username = request.Username,
                Email = request.Email,
                MobileNumber = request.MobileNumber,
                PasswordHash = PasswordHelper.HashPassword(request.Password),
                Role = string.IsNullOrEmpty(request.Role) ? "Chef" : request.Role,
                DutyPeriod = request.DutyPeriod,
                IsOnDuty = request.IsOnDuty
            };

            await _userRepository.AddStaffAsync(chef);
            await _userRepository.SaveChangesAsync();

            return new UserDto
            {
                Id = chef.Id,
                Username = chef.Username,
                Email = chef.Email,
                MobileNumber = chef.MobileNumber,
                Role = chef.Role,
                DutyPeriod = chef.DutyPeriod,
                IsOnDuty = chef.IsOnDuty
            };
        }

        // ====================================================
        // STAFF CRUD LOGIC
        // ====================================================

        public async Task<IEnumerable<UserDto>> GetAllStaffAsync()
        {
            var list = await _userRepository.GetAllStaffAsync();
            var dtos = new List<UserDto>();
            foreach (var item in list)
            {
                dtos.Add(new UserDto
                {
                    Id = item.Id,
                    Username = item.Username,
                    Email = item.Email,
                    MobileNumber = item.MobileNumber,
                    Role = item.Role,
                    DutyPeriod = item.DutyPeriod,
                    IsOnDuty = item.IsOnDuty
                });
            }
            return dtos;
        }

        public async Task<UserDto?> GetStaffByIdAsync(int id)
        {
            var item = await _userRepository.GetStaffByIdAsync(id);
            if (item == null) return null;

            return new UserDto
            {
                Id = item.Id,
                Username = item.Username,
                Email = item.Email,
                MobileNumber = item.MobileNumber,
                Role = item.Role,
                DutyPeriod = item.DutyPeriod,
                IsOnDuty = item.IsOnDuty
            };
        }

        public async Task<bool> UpdateStaffAsync(int id, ChefRegisterRequest request)
        {
            var item = await _userRepository.GetStaffByIdAsync(id);
            if (item == null) return false;

            item.Username = request.Username;
            item.Email = request.Email;
            item.MobileNumber = request.MobileNumber;
            item.Role = string.IsNullOrEmpty(request.Role) ? item.Role : request.Role;
            item.DutyPeriod = request.DutyPeriod;
            item.IsOnDuty = request.IsOnDuty;
            
            // Only update password if a new one is sent
            if (!string.IsNullOrEmpty(request.Password))
            {
                item.PasswordHash = PasswordHelper.HashPassword(request.Password);
            }

            await _userRepository.UpdateStaffAsync(item);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteStaffAsync(int id)
        {
            var item = await _userRepository.GetStaffByIdAsync(id);
            if (item == null) return false;

            await _userRepository.DeleteStaffAsync(item);
            return await _userRepository.SaveChangesAsync();
        }

        // ====================================================
        // CUSTOMER CRUD LOGIC
        // ====================================================

        public async Task<IEnumerable<UserDto>> GetAllCustomersAsync()
        {
            var list = await _userRepository.GetAllCustomersAsync();
            var dtos = new List<UserDto>();
            foreach (var item in list)
            {
                dtos.Add(new UserDto
                {
                    Id = item.Id,
                    Username = item.Name,
                    Email = item.Email,
                    MobileNumber = item.MobileNumber,
                    Role = "User"
                });
            }
            return dtos;
        }

        public async Task<UserDto?> GetCustomerByIdAsync(int id)
        {
            var item = await _userRepository.GetCustomerByIdAsync(id);
            if (item == null) return null;

            return new UserDto
            {
                Id = item.Id,
                Username = item.Name,
                Email = item.Email,
                MobileNumber = item.MobileNumber,
                Role = "User"
            };
        }

        public async Task<bool> UpdateCustomerAsync(int id, CustomerLoginRequest request)
        {
            var item = await _userRepository.GetCustomerByIdAsync(id);
            if (item == null) return false;

            item.Name = request.Username ?? item.Name;
            item.Email = request.Email ?? item.Email;
            item.MobileNumber = request.MobileNumber;

            await _userRepository.UpdateCustomerAsync(item);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var item = await _userRepository.GetCustomerByIdAsync(id);
            if (item == null) return false;

            await _userRepository.DeleteCustomerAsync(item);
            return await _userRepository.SaveChangesAsync();
        }

        // ====================================================
        // JWT TOKEN GENERATION HELPERS
        // ====================================================

        private CustomerLoginResponse GenerateCustomerLoginResponse(Customer customer, string message)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["Jwt:SecretKey"] ?? "SuperSecretKeyForRestaurantManagementSystem123!";
            var issuer = _configuration["Jwt:Issuer"] ?? "RestaurantAuthService";
            var audience = _configuration["Jwt:Audience"] ?? "RestaurantReactClient";
            var expiryInMinutes = double.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "120");

            var key = Encoding.ASCII.GetBytes(secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Name, customer.Name),
                new Claim(ClaimTypes.Email, customer.Email),
                new Claim(ClaimTypes.Role, "User"),
                new Claim("MobileNumber", customer.MobileNumber)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiryInMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new CustomerLoginResponse
            {
                IsRegistered = true,
                OtpSent = true,
                Token = tokenString,
                Expiration = tokenDescriptor.Expires.Value,
                User = new UserDto
                {
                    Id = customer.Id,
                    Username = customer.Name,
                    Email = customer.Email,
                    MobileNumber = customer.MobileNumber,
                    Role = "User"
                },
                Message = message
            };
        }

        private LoginResponse GenerateStaffToken(Staff staff)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["Jwt:SecretKey"] ?? "SuperSecretKeyForRestaurantManagementSystem123!";
            var issuer = _configuration["Jwt:Issuer"] ?? "RestaurantAuthService";
            var audience = _configuration["Jwt:Audience"] ?? "RestaurantReactClient";
            var expiryInMinutes = double.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "120");

            var key = Encoding.ASCII.GetBytes(secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, staff.Id.ToString()),
                new Claim(ClaimTypes.Name, staff.Username),
                new Claim(ClaimTypes.Email, staff.Email),
                new Claim(ClaimTypes.Role, staff.Role),
                new Claim("MobileNumber", staff.MobileNumber)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiryInMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new LoginResponse
            {
                Token = tokenString,
                Expiration = tokenDescriptor.Expires.Value,
                User = new UserDto
                {
                    Id = staff.Id,
                    Username = staff.Username,
                    Email = staff.Email,
                    MobileNumber = staff.MobileNumber,
                    Role = staff.Role
                }
            };
        }

        private async Task<string> SendOtpViaNotificationServiceAsync(string mobileNumber, string email, string customerName)
        {
            try
            {
                var payload = new { mobileNumber = mobileNumber, email = email, customerName = customerName };
                var json = System.Text.Json.JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Call Java Notification Service running on port 8082
                var response = await _httpClient.PostAsync("http://localhost:8082/api/notifications/send-otp", content);
                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(responseString);
                    if (doc.RootElement.TryGetProperty("otp", out var otpProp))
                    {
                        return otpProp.GetString() ?? "";
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Notification Service Error] {ex.Message}");
            }

            // Local fallback OTP generation in case Notification Service is offline
            var random = new Random();
            var localOtp = random.Next(100000, 999999).ToString();
            Console.WriteLine($"[AuthService Fallback] Local OTP Generated: {localOtp}");
            return localOtp;
        }
    }
}
