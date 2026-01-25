using StoreHub.Dtos.Auth;

namespace StoreHub.Services.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}