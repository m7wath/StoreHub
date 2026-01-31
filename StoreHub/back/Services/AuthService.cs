using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Dtos.Auth;
using StoreHub.Models;
using StoreHub.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

public class AuthService(StoreHubDbContext _db, ITokenService _tokenService) : IAuthService
{
    public async Task RegisterAsync(RegisterDto dto)
    {
        dto.Email = dto.Email.Trim().ToLower();

        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists)
            throw new ArgumentException("Email is already registered.");

        var user = new User
        {
            Name = dto.FullName.Trim(),
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password),
            Role = "Customer",
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        dto.Email = dto.Email.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            throw new ArgumentException("Invalid email or password.");

        if (!VerifyPassword(dto.Password, user.PasswordHash))
            throw new ArgumentException("Invalid email or password.");

        var (token, expiresAtUtc) = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc
        };
    }

    private static string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password is required.");

        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var hash = HashPassword(password);
        return hash == storedHash;
    }
}
