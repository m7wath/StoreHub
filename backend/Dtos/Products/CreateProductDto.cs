using StoreHub.Models;

namespace StoreHub.Dtos.Products
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public double Price { get; set; }
        public string? ImageUrl { get; set; }
        public int Quantity { get; set; }

        public long CategoryId { get; set; }
    }
}
