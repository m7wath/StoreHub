using StoreHub.Data;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;

namespace StoreHub.Services
{
    public class ProductService(StoreHubDbContext _dbContext) : BaseService<Product>(_dbContext), IProductService
    {
    }
}
