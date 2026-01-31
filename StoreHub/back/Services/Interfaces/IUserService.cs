using StoreHub.Dtos.Users;
using StoreHub.Models;
using StoreHub.Services.Base;

namespace StoreHub.Services.Interfaces
{
    public interface IUserService : IBaseService<User>
    {
        Task<List<UsersListDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10);

        Task<bool> UpdateAdminAsync(long id, string fullName, string email, string role);

        Task<bool> ResetPasswordAsync(long id, string newPassword);
    }
}
