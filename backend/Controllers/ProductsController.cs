using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Products;
using StoreHub.Models;
using StoreHub.Services.Interfaces;

namespace StoreHub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(IProductService _productService) : ControllerBase
{
    [HttpGet("{id}")]
  public async Task<IActionResult>GetAsync(long id)
    {
        var result = await _productService.GetAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult>SearchAsync(string value = "", int pageNumber = 1, int pageSize = 10)
    {
        var result = await _productService.SearchAsync(value, pageNumber, pageSize);
        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        var result = await _productService.DeleteAsync(id);
        if (result == false) return NotFound();
        return NoContent(); // delete usually returns nocontent instead of ok

    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Id = 0,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            CategoryId = dto.CategoryId,
            ImageUrl = dto.ImageUrl
        };
        await _productService.AddAsync(product);
        return Ok();

    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> UpdateAsync(long id,UpdateProductDto dto)
    {
        if (id <= 0) return BadRequest("Invalid id");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var old = await _productService.GetAsync(id);
        if (old is null) return NotFound();

        old.Name = dto.Name;
        old.Description = dto.Description;
        old.Price = dto.Price;
        old.Quantity = dto.Quantity;
        old.ImageUrl = dto.ImageUrl;

        var updated = await _productService.UpdateAsync(old);
        if (!updated) return NotFound(); 
        return Ok(); 
    }
}
