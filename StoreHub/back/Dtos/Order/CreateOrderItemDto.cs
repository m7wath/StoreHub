namespace StoreHub.Dtos.Order
{
    public class CreateOrderItemDto
    {
        public int Quantity { get; set; }
        public long ProductId { get; set; }
    }
}
