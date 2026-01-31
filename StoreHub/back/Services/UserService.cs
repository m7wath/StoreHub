using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Users;
using StoreHub.Models;
using StoreHub.Services.Base;
using StoreHub.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace StoreHub.Services
{
    public class UserService : BaseService<User>, IUserService
    {
        private readonly StoreHubDbContext _dbContext;
        private readonly IPasswordHasher<User> _hasher;

        public UserService(StoreHubDbContext dbContext, IPasswordHasher<User> hasher) : base(dbContext)
        {
            _dbContext = dbContext;
            _hasher = hasher;
        }

        public async Task<List<UsersListDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            return await _dbContext.Users
                .AsNoTracking()
                .OrderByDescending(u => u.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UsersListDto
                {
                    Id = u.Id,
                    FullName = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        public async Task<bool> ResetPasswordAsync(long id, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword)) return false;

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            user.PasswordHash = HashPassword(newPassword.Trim());

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAdminAsync(long id, string fullName, string email, string role)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            if (!string.IsNullOrWhiteSpace(fullName))
                user.Name = fullName.Trim();

            if (!string.IsNullOrWhiteSpace(email))
                user.Email = email.Trim();

            if (!string.IsNullOrWhiteSpace(role))
                user.Role = role.Trim();

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
