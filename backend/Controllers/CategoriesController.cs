using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreHub.Dtos.Category;
using StoreHub.Models;
using StoreHub.Services;
using StoreHub.Services.Interfaces;

namespace StoreHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(ICategoryService _categoryService ) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsyncById(long id)
        {
            var result = await _categoryService.GetAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> SearchAsync(string value = "", int pageNum = 1, int PageSize = 10)
        {
            var result = await _categoryService.SearchAsync(value, pageNum, PageSize);
            return Ok(result);

        }
        [HttpPost]
        public async Task<IActionResult>AddAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                ParentCategoryId = dto.ParentCategoryId
            };

          await  _categoryService.AddAsync(category);
            return Ok();
        }
        [HttpPut("{id:long}")]
        public async Task<IActionResult>UpdateAsync (long id,UpdateCategoryDto dto)
        {
            if (id <= 0) return BadRequest("Invalid id");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var old = await _categoryService.GetAsync(id);
            if (old is null) return NotFound();
            old.Name = dto.Name;
            old.Description = dto.Description;
            old.ParentCategoryId = dto.ParentCategoryId;

            var updated = await _categoryService.UpdateAsync(old);
            if (!updated) return NotFound();
            return Ok();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            var result = await _categoryService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
