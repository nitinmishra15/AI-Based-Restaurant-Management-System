using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("UserInteractions")]
    public class UserInteraction
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int InventoryId { get; set; }
        public float Rating { get; set; }
        public string InteractionType { get; set; } = "Order"; // "Order", "Like", "View"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
