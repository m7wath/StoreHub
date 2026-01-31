namespace StoreHub.Dtos.Category
{
    public class UpdateCategoryDto
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public long? ParentCategoryId { get; set; }
    }
}
