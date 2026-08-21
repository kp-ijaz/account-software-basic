using MadrasaAccounting.Application.DTOs.DayBook;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class DayBookService : IDayBookService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger _logger;

    public DayBookService(MadrasaDbContext context)
    {
        _context = context;
        _logger = Log.ForContext<DayBookService>();
    }

    public async Task<DayBookPaginatedResponse> GetDayBookAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? searchTerm = null)
    {
        try
        {
            // Get opening balance (sum of all transactions before startDate)
            decimal openingBalance = 0;
            if (startDate.HasValue)
            {
                var incomeBeforeStart = await _context.Incomes
                    .Where(i => i.AdminId == adminId && i.Date < startDate.Value)
                    .SumAsync(i => i.Amount);

                var expenseBeforeStart = await _context.Expenses
                    .Where(e => e.AdminId == adminId && e.Date < startDate.Value)
                    .SumAsync(e => e.Amount);

                openingBalance = incomeBeforeStart - expenseBeforeStart;
            }

            // Get all income transactions
            var incomeQuery = _context.Incomes
                .Where(i => i.AdminId == adminId)
                .Include(i => i.Category)
                .AsNoTracking();

            // Get all expense transactions
            var expenseQuery = _context.Expenses
                .Where(e => e.AdminId == adminId)
                .Include(e => e.Category)
                .AsNoTracking();

            // Apply date filter
            if (startDate.HasValue)
            {
                incomeQuery = incomeQuery.Where(i => i.Date >= startDate.Value);
                expenseQuery = expenseQuery.Where(e => e.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                incomeQuery = incomeQuery.Where(i => i.Date <= endDate.Value);
                expenseQuery = expenseQuery.Where(e => e.Date <= endDate.Value);
            }

            // Get all transactions
            var incomes = await incomeQuery.ToListAsync();
            var expenses = await expenseQuery.ToListAsync();

            // Combine into single list
            var allTransactions = new List<DayBookEntryResponse>();

            foreach (var income in incomes)
            {
                allTransactions.Add(new DayBookEntryResponse
                {
                    TransactionId = income.Id,
                    Date = income.Date,
                    Description = income.Description,
                    Category = income.Category.Name,
                    Income = income.Amount,
                    Expense = 0,
                    TransactionType = "Income",
                    PaymentMethod = income.PaymentMethod
                });
            }

            foreach (var expense in expenses)
            {
                allTransactions.Add(new DayBookEntryResponse
                {
                    TransactionId = expense.Id,
                    Date = expense.Date,
                    Description = expense.Description,
                    Category = expense.Category.Name,
                    Income = 0,
                    Expense = expense.Amount,
                    TransactionType = "Expense",
                    PaymentMethod = expense.PaymentMethod
                });
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                allTransactions = allTransactions
                    .Where(t => t.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                t.Category.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // Sort by date (and then by time for same-day transactions)
            allTransactions = allTransactions
                .OrderBy(t => t.Date)
                .ThenBy(t => t.TransactionType == "Income" ? 0 : 1)
                .ToList();

            // Calculate running balance
            decimal runningBalance = openingBalance;
            foreach (var entry in allTransactions)
            {
                runningBalance += entry.Income - entry.Expense;
                entry.RunningBalance = runningBalance;
            }

            // Get totals
            var totalIncome = allTransactions.Sum(t => t.Income);
            var totalExpense = allTransactions.Sum(t => t.Expense);
            var closingBalance = openingBalance + totalIncome - totalExpense;

            // Apply pagination
            var totalCount = allTransactions.Count;
            var skip = (pageNumber - 1) * pageSize;
            var paginatedTransactions = allTransactions
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            return new DayBookPaginatedResponse
            {
                Entries = paginatedTransactions,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                NetBalance = totalIncome - totalExpense,
                OpeningBalance = openingBalance,
                ClosingBalance = closingBalance
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error retrieving day book for admin {AdminId}", adminId);
            throw;
        }
    }

    public async Task<DayBookPaginatedResponse> GetTodayDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        return await GetDayBookAsync(adminId, pageNumber, pageSize, today, tomorrow.AddTicks(-1));
    }

    public async Task<DayBookPaginatedResponse> GetThisWeekDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(6).AddHours(23).AddMinutes(59).AddSeconds(59);
        return await GetDayBookAsync(adminId, pageNumber, pageSize, startOfWeek, endOfWeek);
    }

    public async Task<DayBookPaginatedResponse> GetThisMonthDayBookAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);
        return await GetDayBookAsync(adminId, pageNumber, pageSize, startOfMonth, endOfMonth);
    }
}
