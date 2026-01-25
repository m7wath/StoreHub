using Microsoft.EntityFrameworkCore;

namespace StoreHub.Services.Base;

public interface IBaseService<T>
{
    public Task AddAsync(T entity);

    public Task<bool> DeleteAsync(long id);

    public Task<T> GetAsync(long id);

    public Task<List<T>> SearchAsync(string value, int pageNumber = 1, int pageSize = 10);
    public Task<bool> UpdateAsync(T entity);
}
