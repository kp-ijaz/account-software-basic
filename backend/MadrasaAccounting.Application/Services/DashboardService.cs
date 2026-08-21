using MadrasaAccounting.Application.DTOs.Dashboard;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger _logger;

    public DashboardService(MadrasaDbContext context)
    {
        _context = context;
        _logger = Log.ForContext<DashboardService>();
    }

    public async Task<DashboardSummaryResponse> GetDashboardSummaryAsync(Guid adminId)
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var startOfYear = new DateTime(today.Year, 1, 1);
            var endOfYear = new DateTime(today.Year, 12, 31, 23, 59, 59);

            // Get today's metrics
            var todayIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.Date >= today)
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var todayExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.Date >= today)
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            // Get this month's metrics
            var thisMonthIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.Date >= startOfMonth && i.Date <= today.AddDays(1).AddTicks(-1))
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var thisMonthExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.Date >= startOfMonth && e.Date <= today.AddDays(1).AddTicks(-1))
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            // Get current cash balance (all time)
            var totalCashIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.PaymentMethod == "Cash")
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var totalCashExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.PaymentMethod == "Cash")
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var currentCashBalance = totalCashIncome - totalCashExpense;

            // Get current bank balance (all time)
            var totalBankIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.PaymentMethod == "Bank")
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var totalBankExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.PaymentMethod == "Bank")
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var currentBankBalance = totalBankIncome - totalBankExpense;

            // Get recent transactions (last 10)
            var recentIncomes = await _context.Incomes
                .Where(i => i.AdminId == adminId)
                .Include(i => i.Category)
                .AsNoTracking()
                .OrderByDescending(i => i.Date)
                .Take(10)
                .Select(i => new RecentTransactionResponse
                {
                    TransactionId = i.Id,
                    Date = i.Date,
                    Description = i.Description,
                    Category = i.Category.Name,
                    Amount = i.Amount,
                    Type = "Income",
                    PaymentMethod = i.PaymentMethod
                })
                .ToListAsync();

            var recentExpenses = await _context.Expenses
                .Where(e => e.AdminId == adminId)
                .Include(e => e.Category)
                .AsNoTracking()
                .OrderByDescending(e => e.Date)
                .Take(10)
                .Select(e => new RecentTransactionResponse
                {
                    TransactionId = e.Id,
                    Date = e.Date,
                    Description = e.Description,
                    Category = e.Category.Name,
                    Amount = e.Amount,
                    Type = "Expense",
                    PaymentMethod = e.PaymentMethod
                })
                .ToListAsync();

            var recentTransactions = recentIncomes
                .Concat(recentExpenses)
                .OrderByDescending(t => t.Date)
                .Take(10)
                .ToList();

            // Get monthly chart data for current year
            var monthlyChartData = new List<MonthlyChartDataResponse>();

            for (int month = 1; month <= 12; month++)
            {
                var startOfMonthData = new DateTime(today.Year, month, 1);
                var endOfMonthData = month == 12
                    ? new DateTime(today.Year, 12, 31, 23, 59, 59)
                    : new DateTime(today.Year, month + 1, 1).AddTicks(-1);

                var monthIncome = await _context.Incomes
                    .Where(i => i.AdminId == adminId && i.Date >= startOfMonthData && i.Date <= endOfMonthData)
                    .AsNoTracking()
                    .SumAsync(i => i.Amount);

                var monthExpense = await _context.Expenses
                    .Where(e => e.AdminId == adminId && e.Date >= startOfMonthData && e.Date <= endOfMonthData)
                    .AsNoTracking()
                    .SumAsync(e => e.Amount);

                monthlyChartData.Add(new MonthlyChartDataResponse
                {
                    Month = month,
                    MonthName = GetMonthName(month),
                    Income = monthIncome,
                    Expense = monthExpense
                });
            }

            return new DashboardSummaryResponse
            {
                TodayIncome = todayIncome,
                TodayExpense = todayExpense,
                ThisMonthIncome = thisMonthIncome,
                ThisMonthExpense = thisMonthExpense,
                CurrentCashBalance = currentCashBalance,
                CurrentBankBalance = currentBankBalance,
                RecentTransactions = recentTransactions,
                MonthlyChartData = monthlyChartData
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error retrieving dashboard summary for admin {AdminId}", adminId);
            throw;
        }
    }

    private static string GetMonthName(int month) => month switch
    {
        1 => "January",
        2 => "February",
        3 => "March",
        4 => "April",
        5 => "May",
        6 => "June",
        7 => "July",
        8 => "August",
        9 => "September",
        10 => "October",
        11 => "November",
        12 => "December",
        _ => "Unknown"
    };
}
