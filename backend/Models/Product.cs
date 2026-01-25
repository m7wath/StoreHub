using System.ComponentModel.DataAnnotations.Schema;

namespace StoreHub.Models;

public class Product : BaseEntity
{
    public string? Description { get; set; }
    public double Price { get; set; }
    
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }

    public long CategoryId { get; set; }
    public Category Category { get; set; }


}
