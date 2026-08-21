using MadrasaAccounting.Application.DTOs.AuditLog;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class AuditLogService : IAuditLogService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger _logger;

    public AuditLogService(MadrasaDbContext context)
    {
        _context = context;
        _logger = Log.ForContext<AuditLogService>();
    }

    public async Task<AuditLogPaginatedResponse> GetAuditLogsAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? actionTypeFilter = null,
        string? searchTerm = null)
    {
        try
        {
            var query = _context.AuditLogs
                .Where(a => a.AdminId == adminId)
                .AsNoTracking();

            // Apply date filter
            if (startDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= endDate.Value);
            }

            // Apply action type filter
            if (!string.IsNullOrWhiteSpace(actionTypeFilter))
            {
                query = query.Where(a => a.ActionType == actionTypeFilter);
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(a => a.Description.Contains(searchTerm));
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var skip = (pageNumber - 1) * pageSize;
            var items = await query
                .OrderByDescending(a => a.Timestamp)
                .Skip(skip)
                .Take(pageSize)
                .Select(a => new AuditLogResponse
                {
                    Id = a.Id,
                    CreatedAt = a.Timestamp,
                    ActionType = a.ActionType,
                    Description = a.Description,
                    TransactionId = a.TransactionId,
                    OldValues = a.OldValues ?? string.Empty,
                    NewValues = a.NewValues ?? string.Empty
                })
                .ToListAsync();

            return new AuditLogPaginatedResponse
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error retrieving audit logs for admin {AdminId}", adminId);
            throw;
        }
    }

    public async Task<AuditLogPaginatedResponse> GetTodayAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        return await GetAuditLogsAsync(adminId, pageNumber, pageSize, today, tomorrow.AddTicks(-1));
    }

    public async Task<AuditLogPaginatedResponse> GetThisWeekAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(6).AddHours(23).AddMinutes(59).AddSeconds(59);
        return await GetAuditLogsAsync(adminId, pageNumber, pageSize, startOfWeek, endOfWeek);
    }

    public async Task<AuditLogPaginatedResponse> GetThisMonthAuditLogsAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);
        return await GetAuditLogsAsync(adminId, pageNumber, pageSize, startOfMonth, endOfMonth);
    }
}
