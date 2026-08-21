using MadrasaAccounting.Application.DTOs.Ledger;

namespace MadrasaAccounting.Application.Services;

public interface ILedgerService
{
    /// <summary>
    /// Get ledger entries with optional filters and pagination
    /// </summary>
    Task<LedgerPaginatedResponse> GetLedgerAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? categoryFilter = null,
        string? typeFilter = null); // "Income", "Expense", or null for all

    /// <summary>
    /// Get this month's ledger entries
    /// </summary>
    Task<LedgerPaginatedResponse> GetThisMonthLedgerAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);

    /// <summary>
    /// Get this year's ledger entries
    /// </summary>
    Task<LedgerPaginatedResponse> GetThisYearLedgerAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);
}
