using StoreHub.Dtos.Order;
using StoreHub.Models;
using StoreHub.Services.Base;

namespace StoreHub.Services.Interfaces;

public interface IOrderService : IBaseService<Order>
{
    Task<double> CalculateTotalPrice(CreateOrderDto dto);
    public DateTime CreateDateTime();
    Task<List<OrderListDto>> GetMyOrdersAsync(long userId, int pageNumber = 1, int pageSize = 10);
    Task<Order?> GetWithDetailsAsync(long id);
}
