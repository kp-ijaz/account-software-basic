using MadrasaAccounting.Application.DTOs.Reports;

namespace MadrasaAccounting.Application.Services;

public interface IReportsService
{
    /// <summary>
    /// Get monthly report for specified month and year
    /// Includes summary, category-wise breakdown, and detailed entries
    /// </summary>
    Task<MonthlyReportResponse> GetMonthlyReportAsync(Guid adminId, int month, int year);

    /// <summary>
    /// Get yearly report for specified year
    /// Shows all 12 months with income, expense, and balance
    /// </summary>
    Task<YearlyReportResponse> GetYearlyReportAsync(Guid adminId, int year);

    /// <summary>
    /// Get balance sheet as of today
    /// Shows assets, liabilities, and current balance
    /// </summary>
    Task<BalanceSheetResponse> GetBalanceSheetAsync(Guid adminId);
}
