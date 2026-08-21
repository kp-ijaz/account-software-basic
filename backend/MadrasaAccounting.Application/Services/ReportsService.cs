using MadrasaAccounting.Application.DTOs.Reports;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class ReportsService : IReportsService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger _logger;

    public ReportsService(MadrasaDbContext context)
    {
        _context = context;
        _logger = Log.ForContext<ReportsService>();
    }

    public async Task<MonthlyReportResponse> GetMonthlyReportAsync(Guid adminId, int month, int year)
    {
        try
        {
            var startOfMonth = new DateTime(year, month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

            // Get opening balance (all transactions before this month)
            var incomeBeforeMonth = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.Date < startOfMonth)
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var expenseBeforeMonth = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.Date < startOfMonth)
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var openingBalance = incomeBeforeMonth - expenseBeforeMonth;

            // Get this month's income
            var monthIncomes = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.Date >= startOfMonth && i.Date <= endOfMonth)
                .Include(i => i.Category)
                .AsNoTracking()
                .ToListAsync();

            var totalIncome = monthIncomes.Sum(i => i.Amount);

            // Get this month's expenses
            var monthExpenses = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.Date >= startOfMonth && e.Date <= endOfMonth)
                .Include(e => e.Category)
                .AsNoTracking()
                .ToListAsync();

            var totalExpense = monthExpenses.Sum(e => e.Amount);

            // Income by category
            var incomeByCategory = monthIncomes
                .GroupBy(i => i.Category.Name)
                .Select(g => new CategorySummaryResponse
                {
                    Category = g.Key,
                    Amount = g.Sum(i => i.Amount),
                    TransactionCount = g.Count(),
                    Percentage = totalIncome > 0 ? (g.Sum(i => i.Amount) / totalIncome * 100) : 0
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            // Expense by category
            var expenseByCategory = monthExpenses
                .GroupBy(e => e.Category.Name)
                .Select(g => new CategorySummaryResponse
                {
                    Category = g.Key,
                    Amount = g.Sum(e => e.Amount),
                    TransactionCount = g.Count(),
                    Percentage = totalExpense > 0 ? (g.Sum(e => e.Amount) / totalExpense * 100) : 0
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            // Build day book entries
            var dayBookEntries = new List<DayBookEntryForReportResponse>();
            decimal runningBalance = openingBalance;

            var allTransactions = new List<(DateTime date, string desc, string category, decimal amount, bool isIncome)>();
            foreach (var income in monthIncomes)
            {
                allTransactions.Add((income.Date, income.Description, income.Category.Name, income.Amount, true));
            }
            foreach (var expense in monthExpenses)
            {
                allTransactions.Add((expense.Date, expense.Description, expense.Category.Name, expense.Amount, false));
            }

            foreach (var transaction in allTransactions.OrderBy(t => t.date))
            {
                if (transaction.isIncome)
                {
                    runningBalance += transaction.amount;
                    dayBookEntries.Add(new DayBookEntryForReportResponse
                    {
                        Date = transaction.date,
                        Description = transaction.desc,
                        Category = transaction.category,
                        Income = transaction.amount,
                        Expense = 0,
                        Balance = runningBalance
                    });
                }
                else
                {
                    runningBalance -= transaction.amount;
                    dayBookEntries.Add(new DayBookEntryForReportResponse
                    {
                        Date = transaction.date,
                        Description = transaction.desc,
                        Category = transaction.category,
                        Income = 0,
                        Expense = transaction.amount,
                        Balance = runningBalance
                    });
                }
            }

            // Build ledger entries (same data, different format)
            var ledgerEntries = dayBookEntries
                .Select(e => new LedgerEntryForReportResponse
                {
                    Date = e.Date,
                    Description = e.Description,
                    Category = e.Category,
                    Debit = e.Income,
                    Credit = e.Expense,
                    Balance = e.Balance
                })
                .ToList();

            return new MonthlyReportResponse
            {
                Month = month,
                Year = year,
                MonthName = GetMonthName(month),
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                IncomeByCategory = incomeByCategory,
                ExpenseByCategory = expenseByCategory,
                DayBookEntries = dayBookEntries,
                LedgerEntries = ledgerEntries,
                OpeningBalance = openingBalance
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error generating monthly report for admin {AdminId}, month {Month}/{Year}", adminId, month, year);
            throw;
        }
    }

    public async Task<YearlyReportResponse> GetYearlyReportAsync(Guid adminId, int year)
    {
        try
        {
            var monthlyData = new List<YearlyMonthDataResponse>();
            decimal totalIncome = 0;
            decimal totalExpense = 0;

            for (int month = 1; month <= 12; month++)
            {
                var startOfMonth = new DateTime(year, month, 1);
                var endOfMonth = month == 12
                    ? new DateTime(year, 12, 31, 23, 59, 59)
                    : new DateTime(year, month + 1, 1).AddTicks(-1);

                var monthIncome = await _context.Incomes
                    .Where(i => i.AdminId == adminId && i.Date >= startOfMonth && i.Date <= endOfMonth)
                    .AsNoTracking()
                    .SumAsync(i => i.Amount);

                var monthExpense = await _context.Expenses
                    .Where(e => e.AdminId == adminId && e.Date >= startOfMonth && e.Date <= endOfMonth)
                    .AsNoTracking()
                    .SumAsync(e => e.Amount);

                totalIncome += monthIncome;
                totalExpense += monthExpense;

                monthlyData.Add(new YearlyMonthDataResponse
                {
                    Month = month,
                    MonthName = GetMonthName(month),
                    Income = monthIncome,
                    Expense = monthExpense
                });
            }

            return new YearlyReportResponse
            {
                Year = year,
                MonthlyData = monthlyData,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error generating yearly report for admin {AdminId}, year {Year}", adminId, year);
            throw;
        }
    }

    public async Task<BalanceSheetResponse> GetBalanceSheetAsync(Guid adminId)
    {
        try
        {
            // Get all-time income
            var totalIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId)
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            // Get all-time expenses
            var totalExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId)
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var currentBalance = totalIncome - totalExpense;

            // Cash balance
            var cashIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.PaymentMethod == "Cash")
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var cashExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.PaymentMethod == "Cash")
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var cashBalance = cashIncome - cashExpense;

            // Bank balance
            var bankIncome = await _context.Incomes
                .Where(i => i.AdminId == adminId && i.PaymentMethod == "Bank")
                .AsNoTracking()
                .SumAsync(i => i.Amount);

            var bankExpense = await _context.Expenses
                .Where(e => e.AdminId == adminId && e.PaymentMethod == "Bank")
                .AsNoTracking()
                .SumAsync(e => e.Amount);

            var bankBalance = bankIncome - bankExpense;

            return new BalanceSheetResponse
            {
                AsOfDate = DateTime.UtcNow,
                CashBalance = cashBalance,
                BankBalance = bankBalance,
                PendingPayments = 0, // Not implemented yet
                CurrentBalance = currentBalance
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error generating balance sheet for admin {AdminId}", adminId);
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
