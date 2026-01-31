namespace StoreHub.Dtos.Category
{
    public class CategoryDetailsDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public long? ParentCategoryId { get; set; }

        public List<CategoryListDto> SubCategories { get; set; } = new();
    }
}
