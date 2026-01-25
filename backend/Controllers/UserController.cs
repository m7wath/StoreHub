using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreHub.Services;
using StoreHub.Services.Interfaces;

namespace StoreHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService _userService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _userService.GetAllAsync();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            var result = await _userService.DeleteAsync(id);
            if (result == false) return NotFound();
            return NoContent(); // delete usually returns nocontent instead of ok
        }
    }
}
