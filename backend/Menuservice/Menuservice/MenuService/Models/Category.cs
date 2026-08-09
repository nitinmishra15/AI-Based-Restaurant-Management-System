using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MenuService.Models
{
    // Category database entity mapping to Category table
    public class Category
    {
        // Primary key
        public int Id { get; set; }
        
        // Category Name (e.g. Pizza, Burger)
        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        // Navigation property: One Category can have many Menu Items
        public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}
