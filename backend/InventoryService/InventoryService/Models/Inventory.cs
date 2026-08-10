using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryService.Models
{
    [Table("Inventories")]
    public class Inventory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        [Column("inventory_name")]
        public string InventoryName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Qty { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "In Stock";

        [StringLength(100)]
        public string Category { get; set; } = "General";

        public int LowStockThreshold { get; set; } = 5;
    }
}
