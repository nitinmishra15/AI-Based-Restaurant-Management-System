# Multi-stage Dockerfile for Render Deployment (.NET 8)
# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["backend/RestaurantManagement.Api/RestaurantManagement.Api.csproj", "backend/RestaurantManagement.Api/"]
RUN dotnet restore "backend/RestaurantManagement.Api/RestaurantManagement.Api.csproj"

# Copy full source and build release
COPY backend/RestaurantManagement.Api/ backend/RestaurantManagement.Api/
WORKDIR "/src/backend/RestaurantManagement.Api"
RUN dotnet publish "RestaurantManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create images folder for runtime uploads
RUN mkdir -p /app/wwwroot/images

# Render dynamically supplies the PORT environment variable (defaults to 5000)
ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "RestaurantManagement.Api.dll"]
