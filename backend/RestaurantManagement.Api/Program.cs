using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RestaurantManagement.Api.Data;
using RestaurantManagement.Api.Helpers;
using RestaurantManagement.Api.Models;
using RestaurantManagement.Api.Services;

namespace RestaurantManagement.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Configure Port for Cloud Hosting (Render sets PORT env variable)
            var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

            // 2. Configure CORS to allow Vercel Frontend and Localhost
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowVercelAndLocal", policy =>
                {
                    policy.SetIsOriginAllowed(origin => true) // Allows *.vercel.app, localhost, custom domains
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            // 3. Configure Database (SQLite fallback, or SQL Server if ConnectionString provided)
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=restaurant.db";
            builder.Services.AddDbContext<RestaurantDbContext>(options =>
            {
                if (connectionString.Contains("Server=", StringComparison.OrdinalIgnoreCase) ||
                    connectionString.Contains("Database=", StringComparison.OrdinalIgnoreCase))
                {
                    options.UseSqlServer(connectionString);
                }
                else
                {
                    options.UseSqlite(connectionString);
                }
            });

            // 4. Register Services & Repositories
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IProfileService, ProfileService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IMenuItemService, MenuItemService>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IPaymentGatewayService, PaymentGatewayService>();
            builder.Services.AddScoped<IInventoryService, InventoryService>();
            builder.Services.AddScoped<IOfferService, OfferService>();
            builder.Services.AddScoped<IStaffService, StaffService>();

            builder.Services.AddScoped<RestaurantAiServices>();
            builder.Services.AddScoped<IRecommendationAiService>(sp => sp.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IDemandPredictionService>(sp => sp.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IOfferPredictionService>(sp => sp.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IInventoryPredictionService>(sp => sp.GetRequiredService<RestaurantAiServices>());

            // 5. Configure JWT Authentication
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var secretKey = jwtSettings["SecretKey"] ?? "SuperSecretKeyForRestaurantManagementSystem123!";
            var issuer = jwtSettings["Issuer"] ?? "RestaurantAuthService";
            var audience = jwtSettings["Audience"] ?? "RestaurantReactClient";
            var key = Encoding.ASCII.GetBytes(secretKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // 6. Controllers and Swagger Documentation
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "AI-Based Restaurant Management API",
                    Version = "v1",
                    Description = "Unified Backend API for AI-Based Restaurant Management System on Render"
                });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer {token}'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            var app = builder.Build();

            // 7. Auto-create database & Seed initial data
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<RestaurantDbContext>();
                try
                {
                    context.Database.EnsureCreated();

                    // Seed Staff (Admin & Chef)
                    if (!context.StaffMembers.Any(s => s.Username == "admin"))
                    {
                        context.StaffMembers.Add(new Staff
                        {
                            Username = "admin",
                            Name = "System Admin",
                            Email = "admin@restaurant.com",
                            MobileNumber = "1112223333",
                            Phone = "1112223333",
                            PasswordHash = PasswordHelper.HashPassword("AdminPassword@123"),
                            Role = "Admin",
                            Department = "Management",
                            Shift = "All Day",
                            Status = "Active",
                            IsOnDuty = true,
                            DutyPeriod = "Morning"
                        });
                    }

                    if (!context.StaffMembers.Any(s => s.Username == "chef_maria"))
                    {
                        context.StaffMembers.Add(new Staff
                        {
                            Username = "chef_maria",
                            Name = "Chef Maria",
                            Email = "chef.maria@restaurant.com",
                            MobileNumber = "4445556666",
                            Phone = "4445556666",
                            PasswordHash = PasswordHelper.HashPassword("ChefPassword@123"),
                            Role = "Chef",
                            Department = "Kitchen",
                            Shift = "Morning",
                            Status = "Active",
                            IsOnDuty = true,
                            DutyPeriod = "Morning"
                        });
                    }

                    // Seed Categories & Menu Items
                    if (!context.Categories.Any())
                    {
                        var indian = new Category { CategoryName = "Indian" };
                        var burgers = new Category { CategoryName = "Burgers" };
                        var drinks = new Category { CategoryName = "Drinks" };
                        var desserts = new Category { CategoryName = "Desserts" };

                        context.Categories.AddRange(indian, burgers, drinks, desserts);
                        context.SaveChanges();

                        var items = new List<MenuItem>
                        {
                            new MenuItem { ItemName = "Butter Chicken", Price = 350.00m, Description = "Rich and creamy classic Indian chicken dish", Status = true, CategoryId = indian.Id, ImageUrl = "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500" },
                            new MenuItem { ItemName = "Dal Makhani", Price = 240.00m, Description = "Slow cooked black lentils with cream and butter", Status = true, CategoryId = indian.Id, ImageUrl = "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
                            new MenuItem { ItemName = "Masala Chai", Price = 40.00m, Description = "Spiced Indian tea with aromatic spices", Status = true, CategoryId = drinks.Id, ImageUrl = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500" },
                            new MenuItem { ItemName = "Gulab Jamun", Price = 80.00m, Description = "Sweet milk dumplings dipped in fragrant rose syrup", Status = true, CategoryId = desserts.Id, ImageUrl = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500" },
                            new MenuItem { ItemName = "Cheese Burger", Price = 120.00m, Description = "Juicy patty with melted cheese, lettuce, and secret sauce", Status = true, CategoryId = burgers.Id, ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }
                        };

                        context.MenuItems.AddRange(items);
                    }

                    // Seed Inventory
                    if (!context.Inventories.Any())
                    {
                        context.Inventories.AddRange(
                            new Inventory { InventoryName = "Basmati Rice", Category = "Grains", Price = 80, Qty = 50, LowStockThreshold = 10, Status = "In Stock" },
                            new Inventory { InventoryName = "Paneer", Category = "Dairy", Price = 320, Qty = 15, LowStockThreshold = 5, Status = "In Stock" },
                            new Inventory { InventoryName = "Chicken", Category = "Meat", Price = 220, Qty = 25, LowStockThreshold = 8, Status = "In Stock" },
                            new Inventory { InventoryName = "Butter", Category = "Dairy", Price = 450, Qty = 8, LowStockThreshold = 3, Status = "In Stock" },
                            new Inventory { InventoryName = "Garam Masala", Category = "Spices", Price = 600, Qty = 4, LowStockThreshold = 2, Status = "Low Stock" }
                        );
                    }

                    // Seed Offers
                    if (!context.Offers.Any())
                    {
                        context.Offers.AddRange(
                            new Offer
                            {
                                Title = "Welcome Offer 20% OFF",
                                Description = "Get 20% off on all first orders above ₹300",
                                DiscountType = "Percentage",
                                DiscountValue = 20,
                                MinOrderAmount = 300,
                                CouponCode = "WELCOME20",
                                ApplicableCategory = "All",
                                IsActive = true,
                                StartDate = DateTime.UtcNow.AddDays(-1),
                                EndDate = DateTime.UtcNow.AddMonths(2)
                            },
                            new Offer
                            {
                                Title = "Weekend Feast 15% OFF",
                                Description = "Special weekend discount on Indian main course",
                                DiscountType = "Percentage",
                                DiscountValue = 15,
                                MinOrderAmount = 500,
                                CouponCode = "FEAST15",
                                ApplicableCategory = "Indian",
                                IsActive = true,
                                StartDate = DateTime.UtcNow.AddDays(-1),
                                EndDate = DateTime.UtcNow.AddMonths(1)
                            }
                        );
                    }

                    context.SaveChanges();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Database Initialization Warning] {ex.Message}");
                }
            }

            // 8. Middleware Pipeline
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Restaurant API v1");
                c.RoutePrefix = "swagger";
            });

            // Static files folder for uploads and dish images
            var imagesDir = Path.Combine(app.Environment.WebRootPath ?? Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("AllowVercelAndLocal");

            app.UseAuthentication();
            app.UseAuthorization();

            // Health check root endpoint
            app.MapGet("/", () => Results.Ok(new
            {
                Status = "Healthy",
                Service = "AI-Based Restaurant Management API",
                Environment = app.Environment.EnvironmentName,
                Swagger = "/swagger",
                Timestamp = DateTime.UtcNow
            }));

            app.MapControllers();

            app.Run();
        }
    }
}
