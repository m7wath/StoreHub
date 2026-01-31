using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Admin;

namespace StoreHub.Controllers
{
    [Route("api/admin/dashboard")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController(StoreHubDbContext _db) : ControllerBase
    {
        [HttpGet("stats")]
        public async Task<ActionResult<AdminDashboardStatsDto>> GetStats()
        {
            var dto = new AdminDashboardStatsDto
            {
                Products = await _db.Products.CountAsync(),
                Orders = await _db.Orders.CountAsync(),
                Categories = await _db.Categories.CountAsync(),
                Users = await _db.Users.CountAsync()
            };

            return Ok(dto);
        }
    }
}
