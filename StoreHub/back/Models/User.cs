using System.Text.Json.Serialization;

namespace StoreHub.Models;

public class User : BaseEntity
{
    public string Email { get; set; }
    [JsonIgnore]
    public string PasswordHash { get; set; }

    public string Role { get; set; } = "Customer";
    public List<Order> Orders { get; set; } = new List<Order>();
    public DateTime CreatedAt { get; set; }
}
