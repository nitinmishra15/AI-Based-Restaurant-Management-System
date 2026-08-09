using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Interfaces;
using OrderService.Repositories;
using OrderService.Services;

namespace OrderService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // configure db context with sql server connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // register repository dependency injection
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();

            // register payment gateway service dependency injection
            builder.Services.AddScoped<IPaymentGatewayService, PaymentGatewayService>();

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();

            // Automatic Database and Table Creation
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                int retries = 5;
                while (retries > 0)
                {
                    try
                    {
                        dbContext.Database.EnsureCreated();

                        // Alter table to add missing payment columns if they are not in the existing database
                        try
                        {
                            dbContext.Database.ExecuteSqlRaw(@"
                                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Orders') AND name = 'PaymentStatus')
                                    ALTER TABLE Orders ADD PaymentStatus NVARCHAR(MAX) NOT NULL DEFAULT 'Pending';
                                
                                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Orders') AND name = 'TransactionId')
                                    ALTER TABLE Orders ADD TransactionId NVARCHAR(MAX) NULL;

                                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Orders') AND name = 'PaymentMethod')
                                    ALTER TABLE Orders ADD PaymentMethod NVARCHAR(MAX) NULL;
                            ");
                        }
                        catch (Exception sqlEx)
                        {
                            Console.WriteLine($"Dynamic schema update warning: {sqlEx.Message}");
                        }

                        break; // Success
                    }
                    catch (Exception ex)
                    {
                        retries--;
                        Console.WriteLine($"Order Service Database connection failed. Retrying... ({5 - retries}/5). Error: {ex.Message}");
                        if (retries == 0)
                        {
                            throw;
                        }
                        System.Threading.Thread.Sleep(3000); // Sleep 3 seconds
                    }
                }
            }

            app.UseCors("ReactApp");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();

        }
    }
}