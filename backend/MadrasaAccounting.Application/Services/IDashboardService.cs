using MadrasaAccounting.Application.DTOs.Dashboard;

namespace MadrasaAccounting.Application.Services;

public interface IDashboardService
{
    /// <summary>
    /// Get complete dashboard data with summary, recent transactions, and chart data
    /// Optimized for single API call to prevent multiple queries
    /// </summary>
    Task<DashboardSummaryResponse> GetDashboardSummaryAsync(Guid adminId);
}
