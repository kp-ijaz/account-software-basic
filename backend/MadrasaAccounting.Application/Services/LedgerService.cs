using MadrasaAccounting.Application.DTOs.Ledger;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class LedgerService : ILedgerService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger _logger;

    public LedgerService(MadrasaDbContext context)
    {
        _context = context;
        _logger = Log.ForContext<LedgerService>();
    }

    public async Task<LedgerPaginatedResponse> GetLedgerAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 50,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? categoryFilter = null,
        string? typeFilter = null)
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

            // Apply type filter
            var includeIncome = string.IsNullOrEmpty(typeFilter) || typeFilter == "Income";
            var includeExpense = string.IsNullOrEmpty(typeFilter) || typeFilter == "Expense";

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

            // Apply category filter
            if (!string.IsNullOrEmpty(categoryFilter))
            {
                incomeQuery = incomeQuery.Where(i => i.Category.Name == categoryFilter);
                expenseQuery = expenseQuery.Where(e => e.Category.Name == categoryFilter);
            }

            // Get transactions
            var incomes = includeIncome ? await incomeQuery.ToListAsync() : new List<Domain.Entities.Income>();
            var expenses = includeExpense ? await expenseQuery.ToListAsync() : new List<Domain.Entities.Expense>();

            // Combine into single list
            var allTransactions = new List<LedgerEntryResponse>();

            foreach (var income in incomes)
            {
                allTransactions.Add(new LedgerEntryResponse
                {
                    TransactionId = income.Id,
                    Date = income.Date,
                    Description = income.Description,
                    Category = income.Category.Name,
                    Debit = income.Amount, // Income is debit
                    Credit = 0,
                    TransactionType = "Income",
                    PaymentMethod = income.PaymentMethod
                });
            }

            foreach (var expense in expenses)
            {
                allTransactions.Add(new LedgerEntryResponse
                {
                    TransactionId = expense.Id,
                    Date = expense.Date,
                    Description = expense.Description,
                    Category = expense.Category.Name,
                    Debit = 0,
                    Credit = expense.Amount, // Expense is credit
                    TransactionType = "Expense",
                    PaymentMethod = expense.PaymentMethod
                });
            }

            // Sort by date
            allTransactions = allTransactions
                .OrderBy(t => t.Date)
                .ThenBy(t => t.TransactionType == "Income" ? 0 : 1)
                .ToList();

            // Calculate running balance
            decimal runningBalance = openingBalance;
            foreach (var entry in allTransactions)
            {
                runningBalance += entry.Debit - entry.Credit;
                entry.RunningBalance = runningBalance;
            }

            // Get totals
            var totalDebit = allTransactions.Sum(t => t.Debit);
            var totalCredit = allTransactions.Sum(t => t.Credit);
            var closingBalance = openingBalance + totalDebit - totalCredit;

            // Apply pagination
            var totalCount = allTransactions.Count;
            var skip = (pageNumber - 1) * pageSize;
            var paginatedTransactions = allTransactions
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            return new LedgerPaginatedResponse
            {
                Entries = paginatedTransactions,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalDebit = totalDebit,
                TotalCredit = totalCredit,
                OpeningBalance = openingBalance,
                ClosingBalance = closingBalance
            };
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error retrieving ledger for admin {AdminId}", adminId);
            throw;
        }
    }

    public async Task<LedgerPaginatedResponse> GetThisMonthLedgerAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);
        return await GetLedgerAsync(adminId, pageNumber, pageSize, startOfMonth, endOfMonth);
    }

    public async Task<LedgerPaginatedResponse> GetThisYearLedgerAsync(Guid adminId, int pageNumber = 1, int pageSize = 50)
    {
        var today = DateTime.UtcNow.Date;
        var startOfYear = new DateTime(today.Year, 1, 1);
        var endOfYear = new DateTime(today.Year, 12, 31, 23, 59, 59);
        return await GetLedgerAsync(adminId, pageNumber, pageSize, startOfYear, endOfYear);
    }
}
