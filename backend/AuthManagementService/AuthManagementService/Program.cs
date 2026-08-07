using System.Text;
using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AuthManagementService.Data;
using AuthManagementService.Models;
using AuthManagementService.Repositories;
using AuthManagementService.Services;

namespace AuthManagementService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Configure CORS for React client (http://localhost:5173 and http://localhost:3000)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactCorsPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            // 2. Configure Database Context (SQL Server)
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));

            // 3. Register Repositories and Services (Dependency Injection)
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IProfileService, ProfileService>();

            // 4. Configure JWT Authentication
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

            builder.Services.AddControllers();

            var app = builder.Build();

            // 5. Automatic Database and Table Creation (Without external migrations)
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                int retries = 5;
                while (retries > 0)
                {
                    try
                    {
                        dbContext.Database.EnsureCreated(); // Creates database & tables automatically if they don't exist

                        // Dynamically add columns if they are missing in the existing database
                        try 
                        {
                            dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'IsOnDuty' AND Object_ID = Object_ID(N'StaffMembers')) ALTER TABLE StaffMembers ADD IsOnDuty BIT NOT NULL DEFAULT 1;");
                            dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'DutyPeriod' AND Object_ID = Object_ID(N'StaffMembers')) ALTER TABLE StaffMembers ADD DutyPeriod NVARCHAR(MAX) NOT NULL DEFAULT '';");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Dynamic database updates warning: {ex.Message}");
                        }
                        
                        // Seed or correct staff credentials in database to ensure hashes match the current algorithm
                        var admin = dbContext.StaffMembers.FirstOrDefault(s => s.Username == "admin");
                        if (admin != null)
                        {
                            admin.PasswordHash = Helpers.PasswordHelper.HashPassword("AdminPassword@123");
                            dbContext.StaffMembers.Update(admin);
                        }
                        else
                        {
                            dbContext.StaffMembers.Add(new Staff
                            {
                                Username = "admin",
                                Email = "admin@restaurant.com",
                                MobileNumber = "1112223333",
                                PasswordHash = Helpers.PasswordHelper.HashPassword("AdminPassword@123"),
                                Role = "Admin"
                            });
                        }

                        var chef = dbContext.StaffMembers.FirstOrDefault(s => s.Username == "chef_maria");
                        if (chef != null)
                        {
                            chef.PasswordHash = Helpers.PasswordHelper.HashPassword("ChefPassword@123");
                            dbContext.StaffMembers.Update(chef);
                        }
                        else
                        {
                            dbContext.StaffMembers.Add(new Staff
                            {
                                Username = "chef_maria",
                                Email = "chef.maria@restaurant.com",
                                MobileNumber = "4445556666",
                                PasswordHash = Helpers.PasswordHelper.HashPassword("ChefPassword@123"),
                                Role = "Chef"
                            });
                        }
                        
                        dbContext.SaveChanges();
                        break; // Success! Exit retry loop.
                    }
                    catch (Exception ex)
                    {
                        retries--;
                        Console.WriteLine($"Database initialization failed. Retrying... ({5 - retries}/5). Error: {ex.Message}");
                        if (retries == 0)
                        {
                            throw; // Re-throw if all retries failed.
                        }
                        System.Threading.Thread.Sleep(3000); // Wait 3 seconds before next retry
                    }
                }
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            // 6. Middleware Execution Order (CORS must be placed after UseRouting and before Auth)
            app.UseCors("ReactCorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
