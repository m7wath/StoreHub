using Microsoft.EntityFrameworkCore;
using StoreHub.Data;
using StoreHub.Models;

namespace StoreHub.Services.Base;

public class BaseService <T>(StoreHubDbContext _dbContext) : IBaseService<T>
    where T : BaseEntity
{
    public async Task AddAsync(T entity)
    {
        await _dbContext.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(long id)
    {
        return await _dbContext.Set<T>().Where(x => x.Id == id).ExecuteDeleteAsync() > 0; 
    }

    public async Task<bool> UpdateAsync(T entity)
    {
        var old = await _dbContext.Set<T>().FindAsync(entity.Id);
        if (old == null) return false;

        _dbContext.Entry(old).CurrentValues.SetValues(entity);
        await _dbContext.SaveChangesAsync();

        return true;
    }
    public async Task<T> GetAsync(long id)
    {
        try
        {
            var value = await _dbContext.Set<T>().FindAsync(id);
            return value;
        }
        catch (Exception e)
        {
            var x = e;
            throw e;
        }
        //return await _dbContext.Set<T>().FindAsync(id);
    }

    public async Task<List<T>> SearchAsync(string value = "", int pageNumber = 1, int pageSize = 10)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; 

        value ??= "";

        return await _dbContext.Set<T>()
            .AsNoTracking()
            .Where(x => value == "" || x.Name.Contains(value))
            .OrderByDescending(x => x.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

}
