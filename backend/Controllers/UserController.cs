using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreHub.Dtos.Users;
using StoreHub.Services.Interfaces;

namespace StoreHub.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService _userService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllAsync(int pageNumber = 1, int pageSize = 10)
        {
            var result = await _userService.GetAllAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            var result = await _userService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateUserDto dto)
        {
            if (dto == null) return BadRequest("Body is required");

            if (string.IsNullOrWhiteSpace(dto.FullName)) return BadRequest("FullName is required");
            if (string.IsNullOrWhiteSpace(dto.Email)) return BadRequest("Email is required");
            if (string.IsNullOrWhiteSpace(dto.Role)) return BadRequest("Role is required");

            var ok = await _userService.UpdateAdminAsync(id, dto.FullName, dto.Email, dto.Role);
            if (!ok) return NotFound();

            return Ok();
        }

        [HttpPut("{id:long}/reset-password")]
        public async Task<IActionResult> ResetPassword(long id, [FromBody] ResetPasswordDto dto)
        {
            if (dto == null) return BadRequest("Body is required");

            if (string.IsNullOrWhiteSpace(dto.NewPassword)) return BadRequest("NewPassword is required");
            if (dto.NewPassword.Length < 6) return BadRequest("Password must be at least 6 characters");

            var ok = await _userService.ResetPasswordAsync(id, dto.NewPassword);
            if (!ok) return NotFound();

            return Ok();
        }
    }
}
