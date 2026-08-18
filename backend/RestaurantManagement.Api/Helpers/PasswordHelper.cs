using System.Security.Cryptography;
using System.Text;

namespace RestaurantManagement.Api.Helpers
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public static bool VerifyPassword(string enteredPassword, string storedHash)
        {
            var hashOfEntered = HashPassword(enteredPassword);
            return string.Equals(hashOfEntered, storedHash, StringComparison.OrdinalIgnoreCase);
        }
    }
}
