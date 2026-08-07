using System;
using System.Security.Cryptography;
using System.Text;

namespace AuthManagementService.Helpers
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInput = HashPassword(password);
            return string.Equals(hashedInput, hashedPassword, StringComparison.OrdinalIgnoreCase);
        }
    }
}
