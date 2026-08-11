using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

namespace AiService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Add Auth & Interaction Database Connection
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // 2. Add Menu Database Connection
            builder.Services.AddDbContext<MenuDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("MenuConnection")));

            // 3. Add Order Database Connection
            builder.Services.AddDbContext<OrderDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("OrderConnection")));

            // 4. Add Inventory Database Connection
            builder.Services.AddDbContext<InventoryDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("InventoryConnection")));

            // 5. Add Offer Database Connection
            builder.Services.AddDbContext<OfferDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("OfferConnection")));

            // 6. Add controllers
            builder.Services.AddControllers();

            // 7. Configure Swagger/OpenAPI documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // 8. Register rule-based AI prediction services and their interfaces
            builder.Services.AddScoped<RestaurantAiServices>();
            builder.Services.AddScoped<IRecommendationAiService>(provider => provider.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IDemandPredictionService>(provider => provider.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IOfferPredictionService>(provider => provider.GetRequiredService<RestaurantAiServices>());
            builder.Services.AddScoped<IInventoryPredictionService>(provider => provider.GetRequiredService<RestaurantAiServices>());

            // 9. Enable CORS for frontend applications (Vite)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Enable CORS before authorization
            app.UseCors("AllowFrontend");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
