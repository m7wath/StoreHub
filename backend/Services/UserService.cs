using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Users;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;


namespace StoreHub.Services
{
    public class UserService(StoreHubDbContext _dbContext) : BaseService<User>(_dbContext), IUserService
    {
        public async Task<List<UsersListDto>> GetAllAsync( int pageNumber = 1, int pageSize = 10)
        {
            var result =await _dbContext.Users
           .OrderByDescending(u => u.CreatedAt)
           .Select(u => new UsersListDto
           {
               Id = u.Id,
               FullName = u.Name,
               Email = u.Email,
               Role = u.Role,
               CreatedAt = u.CreatedAt
           })
           .ToListAsync();

            return result;
        }

    }
}
