using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Models;
using System.Security.Cryptography;
using System.Text;

namespace StoreHub.Data;

public static class AdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration config)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<StoreHubDbContext>();

        var email = config["SeedAdmin:Email"]?.Trim().ToLower();
        var password = config["SeedAdmin:Password"];
        var fullName = config["SeedAdmin:FullName"] ?? "Admin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        var exists = await db.Users.AnyAsync(u => u.Email == email);
        if (exists) return;

        var admin = new User
        {
            Name = fullName.Trim(),
            Email = email,
            PasswordHash = HashPassword(password),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
