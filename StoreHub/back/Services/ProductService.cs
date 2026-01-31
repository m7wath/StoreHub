using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Products;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;

namespace StoreHub.Services
{
    public class ProductService(StoreHubDbContext _dbContext) : BaseService<Product>(_dbContext), IProductService
    {
        public async Task<List<ProductListDto>> NewSearchAsync(string value = "", int pageNumber = 1, int pageSize = 10)
        {
            var query = _dbContext.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(value))
            {
                var v = value.Trim();
                query = query.Where(p =>
                    p.Name.Contains(v) ||
                    (p.Description != null && p.Description.Contains(v)));
            }

            var result = await query
                .OrderByDescending(p => p.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = (double)p.Price, 
                    ImageUrl = p.ImageUrl,
                    Quantity = p.Quantity,
                    CreatedAt = p.CreatedAt,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Unknown"
                })
                .ToListAsync();

            return result;
        }
    }
}
