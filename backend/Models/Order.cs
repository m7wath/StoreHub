using System.ComponentModel.DataAnnotations.Schema;

namespace StoreHub.Models;

public class Order : BaseEntity
{
    public DateTime OrderDate { get; set; }
    public double TotalPrice { get; set; }

    public long UserId { get; set; }
    public User User { get; set; }

    public List <OrderItem> Items { get; set; } = new List<OrderItem> ();


}
