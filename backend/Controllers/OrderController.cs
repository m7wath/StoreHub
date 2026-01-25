using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Order;
using StoreHub.Models;
using StoreHub.Services.Interfaces;
using System.Security.Claims;


namespace StoreHub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController(IOrderService _orderService) : ControllerBase
{
    [HttpGet("{id:long}")]
    public async Task<IActionResult>GetAsync (long id)
    {
        var result = await _orderService.GetWithDetailsAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }
    [Authorize]
    [HttpPost]
    public async Task<IActionResult>AddAsync (CreateOrderDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdStr))
            return Unauthorized();
        var userId = long.Parse(userIdStr);

        var order = new Order
        {
            Name = "Order",
            UserId = userId,
            OrderDate = _orderService.CreateDateTime(),
            TotalPrice = await _orderService.CalculateTotalPrice(dto),
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity
            }).ToList()

        };

        await _orderService.AddAsync(order);
        return Ok();
    }
    [HttpGet]
    public async Task<IActionResult> SearchAsync(string value = "", int pageNumber = 1, int pageSize = 10)
    {
        var result = await _orderService.SearchAsync(value, pageNumber, pageSize);
        return Ok(result);
    }
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> MyOrders()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdStr))
            return Unauthorized();
        var userId = long.Parse(userIdStr!);

        var result = await _orderService.GetMyOrdersAsync(userId);
        return Ok(result);
    }
    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        var result = await _orderService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
