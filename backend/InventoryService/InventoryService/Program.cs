using Microsoft.EntityFrameworkCore;
using InventoryService.Data;
using InventoryService.Services;

namespace InventoryService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            
            // Add Swagger services
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Getting connection string from appsettings.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Register EF Core DbContext to connect with SQL Server database
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Registering Service Layer in Dependency Injection container
            builder.Services.AddScoped<IInventoryService, Services.InventoryService>();
            builder.Services.AddScoped<IInventoryPredictionService, Services.InventoryPredictionService>();

            // Configure CORS for React frontend client
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Enable Swagger in Development or all environments for easy testing
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Inventory Service API v1");
                c.RoutePrefix = "swagger";
            });

            // Automatically apply EF Core migrations and create database at startup
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    // Ensure the database is created and tables are seeded
                    context.Database.EnsureCreated();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while migrating/seeding the database: {ex.Message}");
                }
            }

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
