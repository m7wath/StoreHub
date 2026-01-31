using Microsoft.EntityFrameworkCore;
using StoreHub.Common;
using StoreHub.Data;
using StoreHub.Dtos.Order;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;
using System;

namespace StoreHub.Services;

public class OrderService(StoreHubDbContext _dbContext) : BaseService<Order>(_dbContext), IOrderService
{
    public async Task<double> CalculateTotalPrice(CreateOrderDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0)
            return 0;

        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();

        var products = await _dbContext.Products
        .Where(p => productIds.Contains(p.Id))
        .Select(p => new { p.Id, p.Price })
        .ToListAsync();

        if (products.Count != productIds.Count)
            throw new ArgumentException("One or more ProductId values are invalid.");

        double total = 0;

        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);

            if (item.Quantity <= 0)
                throw new ArgumentException("Quantity must be > 0.");

            total += product.Price * item.Quantity;
        }

        return total;

    }

    public DateTime CreateDateTime()
    {
        return DateTime.UtcNow;
    }

   public async Task<List<OrderListDto>> GetMyOrdersAsync(long userId, int pageNumber = 1, int pageSize = 10)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        return await _dbContext.Set<Order>()
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderListDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                TotalPrice = o.TotalPrice,
                ItemsCount = o.Items.Count
            })
            .ToListAsync();
    }

    public async Task<Order?> GetWithDetailsAsync(long id)
    {
        return await _dbContext.Orders
               .Include(o => o.User)
               .Include(o => o.Items)
               .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<PagedResult<OrderListDto>> SearchPagedAsync(
    string value = "",
    int pageNumber = 1,
    int pageSize = 10)
    {
        value ??= "";

        var query = _dbContext.Orders
            .Where(o => value == "" || o.Id.ToString().Contains(value));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(o => o.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderListDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                TotalPrice = o.TotalPrice,
                ItemsCount = o.Items.Count
            })
            .ToListAsync();

        return new PagedResult<OrderListDto>
        {
            Items = items,
            TotalCount = total
        };
    }
}
