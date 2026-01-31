using StoreHub.Dtos.Products;
using StoreHub.Models;
using StoreHub.Services.Base;

namespace StoreHub.Services.Interfaces
{
    public interface IProductService : IBaseService<Product>
    {
        Task<List<ProductListDto>> NewSearchAsync(string value = "", int pageNumber = 1, int pageSize = 10);
    }
}
