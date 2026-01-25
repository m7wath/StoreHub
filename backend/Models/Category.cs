using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreHub.Models;

public class Category : BaseEntity
{

    [MaxLength (500)]
    public string? Description { get; set; }

    // Parent (one)
    public long? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }

    // Children (many)
    public List<Category> SubCategories { get; set; } = new();

    // Products in this category
    public List<Product> Products { get; set; } = new();
}
