using MadrasaAccounting.Application.DTOs.DayBook;

namespace MadrasaAccounting.Application.Services;

public interface IDayBookService
{
    /// <summary>
    /// Get day book entries with optional date filter and pagination
    /// </summary>
    Task<DayBookPaginatedResponse> GetDayBookAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? searchTerm = null);

    /// <summary>
    /// Get today's day book entries
    /// </summary>
    Task<DayBookPaginatedResponse> GetTodayDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);

    /// <summary>
    /// Get this week's day book entries
    /// </summary>
    Task<DayBookPaginatedResponse> GetThisWeekDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);

    /// <summary>
    /// Get this month's day book entries
    /// </summary>
    Task<DayBookPaginatedResponse> GetThisMonthDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);
}
