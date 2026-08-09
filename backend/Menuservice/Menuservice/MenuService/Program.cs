using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using MenuService.Data;
using MenuService.Models;
using MenuService.Repositories.Interfaces;
using MenuService.Repositories.Implementations;
using MenuService.Services.Interfaces;
using MenuService.Services.Implementations;

namespace MenuService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers();
            builder.Services.AddControllersWithViews();

            // Getting connection string from appsettings.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Register EF Core DbContext to connect with SQL Server database
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Registering Repository Layer in Dependency Injection container
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IMenuItemRepository, MenuItemRepository>();

            // Registering Service Layer in Dependency Injection container
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IMenuItemService, MenuItemService>();

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

            // Automatically apply EF Core migrations and create database at startup
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    // EnsureCreated creates the database and schema if they don't exist
                    context.Database.EnsureCreated();

                    // Seed Categories and Menu Items if database is empty
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
                            new MenuItem { ItemName = "Masala Chai", Price = 40.00m, Description = "Spiced Indian tea", Status = true, CategoryId = drinks.Id, ImageUrl = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500" },
                            new MenuItem { ItemName = "Gulab Jamun", Price = 80.00m, Description = "Sweet milk dumplings in syrup", Status = true, CategoryId = desserts.Id, ImageUrl = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500" },
                            new MenuItem { ItemName = "Cheese Burger", Price = 120.00m, Description = "Juicy chicken patty with extra cheese slice", Status = true, CategoryId = burgers.Id, ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }
                        };

                        context.MenuItems.AddRange(items);
                        context.SaveChanges();
                    }
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
                app.UseDeveloperExceptionPage();
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
