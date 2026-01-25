using System.Collections.Generic;

namespace StoreHub.Dtos.Order
{
    public class CreateOrderDto
    {
        public List <CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    }
}
