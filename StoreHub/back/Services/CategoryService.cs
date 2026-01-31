using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;

namespace StoreHub.Services
{
    public class CategoryService(StoreHubDbContext _dbContext) : BaseService<Category>(_dbContext), ICategoryService
    {
        public async Task<bool> ProtectedDeleteAsync(long id)
        {
            var exists = await _dbContext.Categories.AnyAsync(c => c.Id == id);
            if (!exists) return false;

            var hasChildren = await _dbContext.Categories.AnyAsync(c => c.ParentCategoryId == id);
            if (hasChildren)
                throw new InvalidOperationException("Cannot delete: this category has sub-categories. Delete/move sub-categories first.");

            var hasProducts = await _dbContext.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
                throw new InvalidOperationException("Cannot delete: this category has products. Move products to another category first.");

            return await _dbContext.Categories
                .Where(c => c.Id == id)
                .ExecuteDeleteAsync() > 0;
        }
    }
}
