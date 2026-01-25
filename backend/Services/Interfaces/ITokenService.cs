using StoreHub.Models;

namespace StoreHub.Services.Interfaces
{
    public interface ITokenService
    {
        (string token, DateTime expiresAtUtc) GenerateToken(User user);
    }
}
