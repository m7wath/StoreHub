using Microsoft.EntityFrameworkCore;
using StoreHub.Models;
namespace StoreHub.Data
{
    public class StoreHubDbContext : DbContext
    {
        public StoreHubDbContext (DbContextOptions<StoreHubDbContext> options) : base(options)
        { 

        }

        // Main Models
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>()
               .Property(p => p.Price)
               .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Category>().HasData(
              new Category { Id = 1, Name = "Hardware", Description = "Main PC parts", ParentCategoryId = null },
              new Category { Id = 2, Name = "Accessories", Description = "PC accessories", ParentCategoryId = null },

              new Category { Id = 3, Name = "GPU", Description = "Graphics Cards", ParentCategoryId = 1 },
              new Category { Id = 4, Name = "CPU", Description = "Processors", ParentCategoryId = 1 },
              new Category { Id = 5, Name = "Motherboard", Description = "Motherboards", ParentCategoryId = 1 },
              new Category { Id = 6, Name = "RAM", Description = "Memory", ParentCategoryId = 1 },
              new Category { Id = 7, Name = "Storage", Description = "Storage devices", ParentCategoryId = 1 },
              new Category { Id = 8, Name = "PSU", Description = "Power Supplies", ParentCategoryId = 1 },
              new Category { Id = 9, Name = "Case", Description = "Computer Cases", ParentCategoryId = 1 },
              new Category { Id = 10, Name = "Cooling", Description = "Cooling solutions", ParentCategoryId = 1 },

              new Category { Id = 11, Name = "SSD", Description = "Solid State Drives", ParentCategoryId = 7 },
              new Category { Id = 12, Name = "HDD", Description = "Hard Disk Drives", ParentCategoryId = 7 });



        }

       
    }
}
