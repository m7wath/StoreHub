using AutoMapper;
using StoreHub.Models;

namespace StoreHub.Mapping
{
    public class StoreHubProfile : Profile
    {
        public StoreHubProfile() 
        {
            //CreateMap<Product, ProductListDto>()
            //   .ForMember(dest => dest.CategoryName,
            //              opt => opt.MapFrom(src => src.Category.Name));

            //CreateMap<CreateProductDto, Product>();
            //CreateMap<UpdateProductDto, Product>();
        }
    }
}
