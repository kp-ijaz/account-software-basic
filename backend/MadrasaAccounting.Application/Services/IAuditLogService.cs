using MadrasaAccounting.Application.DTOs.AuditLog;

namespace MadrasaAccounting.Application.Services;

public interface IAuditLogService
{
    /// <summary>
    /// Get paginated audit logs with optional filters
    /// </summary>
    Task<AuditLogPaginatedResponse> GetAuditLogsAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? actionTypeFilter = null,
        string? searchTerm = null);

    /// <summary>
    /// Get today's audit logs
    /// </summary>
    Task<AuditLogPaginatedResponse> GetTodayAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);

    /// <summary>
    /// Get this week's audit logs
    /// </summary>
    Task<AuditLogPaginatedResponse> GetThisWeekAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);

    /// <summary>
    /// Get this month's audit logs
    /// </summary>
    Task<AuditLogPaginatedResponse> GetThisMonthAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50);
}
