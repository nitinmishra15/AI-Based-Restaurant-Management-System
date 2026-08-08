using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StaffService.DTOs
{
    public class AddStaffDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Role { get; set; }

        public string Department { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }

        public IFormFile Image { get; set; }
    }
}