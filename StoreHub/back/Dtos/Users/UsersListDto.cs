namespace StoreHub.Dtos.Users
{
    public class UsersListDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Role { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}
