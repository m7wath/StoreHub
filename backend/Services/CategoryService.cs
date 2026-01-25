using StoreHub.Data;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;

namespace StoreHub.Services
{
    public class CategoryService(StoreHubDbContext _dbContext) : BaseService<Category>(_dbContext), ICategoryService
    {
    }
}
