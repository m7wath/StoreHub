using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StoreHub.Models;
using StoreHub.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace StoreHub.Services
{
    public class TokenService (IConfiguration _config) : ITokenService
    {
        public (string token, DateTime expiresAtUtc) GenerateToken(User user)
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var key = _config["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(key))
                throw new InvalidOperationException("JWT Key is missing in configuration (Jwt:Key).");

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("Name", user.Name)
        };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var expiresAtUtc = DateTime.UtcNow.AddDays(365);

            var jwt = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiresAtUtc,
                signingCredentials: creds
            );

            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            return (token, expiresAtUtc);
        }
    }
}
