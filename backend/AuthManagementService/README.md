# Authentication & CRUD Management Service

This is the standalone **Authentication Service** for the **QR and AI-based Restaurant Management System**. It manages authentication for three roles: **User** (Customer), **Admin**, and **Chef**, and implements full CRUD (Create, Read, Update, Delete) management capabilities for both Staff and Customer accounts.

---

## 🏗️ Project Architecture & Structure

The codebase is organized under the namespace **`AuthManagementService`** using the Layered Architecture pattern:
- **Models**: Defines database schemas (`Staff.cs`, `Customer.cs`).
- **Data (EF Core)**: `AppDbContext.cs` mapping database entities and seeding seed accounts.
- **DTOs**: Data Transfer Objects for validation and serialization formatting.
- **Repositories**: Abstract database data access methods (`IUserRepository.cs` & `UserRepository.cs`).
- **Services**: Business logic layer managing JWT parameters and login states (`IAuthService.cs` & `AuthService.cs`).
- **Controllers**: Exposes HTTP endpoints and routes (`AuthController.cs`).

---

## 🚀 Key Features

### 1. Automatic Database & Table Setup (Zero-Configuration)
You **do not need** to run migrations or update commands externally. The service includes the following startup routine in `Program.cs`:
```csharp
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}
```
At startup, EF Core automatically checks your SQL Server. If the database or tables do not exist, it creates them and seeds the default testing accounts instantly.

### 2. Multi-Step Customer Login (Mobile Check & OTP Flow)
* **Step 1 (Check Mobile)**: The customer enters their mobile number.
  * If the number exists: A random 6-digit OTP code is generated, saved in memory, and returned in the response message.
  * If the number does not exist: The system returns a prompt asking the customer to provide their Name and Email.
* **Step 2A (OTP Verification)**: If registered, the customer enters the dynamic OTP. Upon verification, they receive a signed JWT token.
* **Step 2B (Self-Registration)**: If new, the customer enters their Name, Email, and Mobile. The system inserts them into the `Customers` table and issues a JWT token.

### 3. Staff Login (Admin / Chef)
* Authenticates using a pre-saved Username and Password.
* Hashes password strings using SHA256 hashing.
* Issues role-specific JWT tokens containing claims that define access rights.

### 4. Admin Management (CRUD Operations)
Authorized Admins can manage the system by performing CRUD operations on staff and customers:
* **Staff CRUD**: Get All, Get By ID, Update (Username, Email, Mobile, Password), and Delete.
* **Customer CRUD**: Get All, Get By ID, Update (Name, Email, Mobile), and Delete.

---

## 📡 API Endpoint Reference & Postman Testing Payloads

### A. Authentication Endpoints

#### 1. Customer Login (POST `/api/auth/customer-login`)
* **Step 1 Request (Check Mobile)**:
  ```json
  {
    "mobileNumber": "9876543210"
  }
  ```
* **Step 2A Request (Verify OTP)**:
  ```json
  {
    "mobileNumber": "9876543210",
    "otp": "COPY_OTP_CODE_FROM_STEP_1_RESPONSE_MESSAGE"
  }
  ```
* **Step 2B Request (Register New Customer)**:
  ```json
  {
    "mobileNumber": "9998887776",
    "username": "Rahul Sharma",
    "email": "rahul.sharma@gmail.com"
  }
  ```

#### 2. Staff Login (POST `/api/auth/staff-login`)
* **Admin Login**:
  ```json
  {
    "username": "admin",
    "password": "AdminPassword123"
  }
  ```
* **Chef Login**:
  ```json
  {
    "username": "chef_maria",
    "password": "ChefPassword123"
  }
  ```

---

### B. Admin CRUD Endpoints (Requires Admin Bearer Token)

#### 1. Get All Staff members (GET `/api/auth/staff`)
* **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`

#### 2. Update Staff Details (PUT `/api/auth/staff/{id}`)
* **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Body**:
  ```json
  {
    "username": "chef_maria_updated",
    "email": "maria.new@restaurant.com",
    "mobileNumber": "4445556666",
    "password": "NewChefPassword123"
  }
  ```

#### 3. Delete Staff member (DELETE `/api/auth/staff/{id}`)
* **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`

#### 4. Get All Registered Customers (GET `/api/auth/customers`)
* **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`

#### 5. Delete Customer Profile (DELETE `/api/auth/customers/{id}`)
* **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
