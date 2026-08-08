using System.ComponentModel.DataAnnotations;

namespace StaffService.Models
{
    public class Staff
    {
        [Key]
        public int StaffId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Role { get; set; }

        public string Department { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }

        public string ImageUrl { get; set; }
    }
}
