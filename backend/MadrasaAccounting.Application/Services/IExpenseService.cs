using MadrasaAccounting.Application.DTOs.Expense;

namespace MadrasaAccounting.Application.Services;

public interface IExpenseService
{
    Task<ExpenseResponse> CreateExpenseAsync(Guid adminId, CreateExpenseRequest request);
    Task<ExpenseResponse> GetExpenseByIdAsync(Guid adminId, Guid expenseId);
    Task<ExpensePaginatedResponse> GetExpenseListAsync(Guid adminId, int pageNumber = 1, int pageSize = 10, DateTime? startDate = null, DateTime? endDate = null);
    Task<ExpensePaginatedResponse> SearchExpenseAsync(Guid adminId, string searchTerm, int pageNumber = 1, int pageSize = 10);
    Task<ExpenseResponse> UpdateExpenseAsync(Guid adminId, Guid expenseId, UpdateExpenseRequest request);
    Task DeleteExpenseAsync(Guid adminId, Guid expenseId);
}
