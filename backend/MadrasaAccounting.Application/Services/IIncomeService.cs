using MadrasaAccounting.Application.DTOs.Income;

namespace MadrasaAccounting.Application.Services;

public interface IIncomeService
{
    Task<IncomeResponse> CreateIncomeAsync(Guid adminId, CreateIncomeRequest request);
    Task<IncomeResponse> GetIncomeByIdAsync(Guid adminId, Guid incomeId);
    Task<IncomePaginatedResponse> GetIncomeListAsync(Guid adminId, int pageNumber = 1, int pageSize = 10, DateTime? startDate = null, DateTime? endDate = null);
    Task<IncomePaginatedResponse> SearchIncomeAsync(Guid adminId, string searchTerm, int pageNumber = 1, int pageSize = 10);
    Task<IncomeResponse> UpdateIncomeAsync(Guid adminId, Guid incomeId, UpdateIncomeRequest request);
    Task DeleteIncomeAsync(Guid adminId, Guid incomeId);
}
