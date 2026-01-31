namespace StoreHub.Dtos.Order
{
    public class OrderListDto
    {
        public long Id { get; set; }
        public DateTime OrderDate { get; set; }
        public double TotalPrice { get; set; }
        public int ItemsCount { get; set; }

    }
}
