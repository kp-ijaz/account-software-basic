using FluentValidation;
using MadrasaAccounting.Application.DTOs.Expense;
using MadrasaAccounting.Domain.Entities;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MadrasaAccounting.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly MadrasaDbContext _context;
    private readonly IValidator<CreateExpenseRequest> _createValidator;
    private readonly IValidator<UpdateExpenseRequest> _updateValidator;
    private readonly ILogger _logger;

    public ExpenseService(
        MadrasaDbContext context,
        IValidator<CreateExpenseRequest> createValidator,
        IValidator<UpdateExpenseRequest> updateValidator)
    {
        _context = context;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = Log.ForContext<ExpenseService>();
    }

    public async Task<ExpenseResponse> CreateExpenseAsync(Guid adminId, CreateExpenseRequest request)
    {
        var validationResult = await _createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var categoryExists = await _context.ExpenseCategories
                .AnyAsync(c => c.Id == request.CategoryId && c.AdminId == adminId);

            if (!categoryExists)
            {
                throw new InvalidOperationException("Expense category not found");
            }

            var expense = new Domain.Entities.Expense
            {
                Id = Guid.NewGuid(),
                AdminId = adminId,
                CategoryId = request.CategoryId,
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                PaymentMethod = request.PaymentMethod,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            var category = await _context.ExpenseCategories.FirstAsync(c => c.Id == request.CategoryId);

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                AdminId = adminId,
                ActionType = "ExpenseCreated",
                Description = $"Expense created: {category.Name} - {request.Amount}",
                TransactionId = expense.Id,
                NewValues = System.Text.Json.JsonSerializer.Serialize(new
                {
                    expense.Id,
                    expense.CategoryId,
                    expense.Amount,
                    expense.Date,
                    expense.Description,
                    expense.PaymentMethod
                }),
                OldValues = null,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new ExpenseResponse
            {
                Id = expense.Id,
                CategoryId = expense.CategoryId,
                CategoryName = category.Name,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description,
                PaymentMethod = expense.PaymentMethod,
                CreatedAt = expense.CreatedAt,
                UpdatedAt = expense.UpdatedAt
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.Error(ex, "Error creating expense for admin {AdminId}", adminId);
            throw;
        }
    }

    public async Task<ExpenseResponse> GetExpenseByIdAsync(Guid adminId, Guid expenseId)
    {
        var expense = await _context.Expenses
            .Where(e => e.Id == expenseId && e.AdminId == adminId)
            .Include(e => e.Category)
            .FirstOrDefaultAsync();

        if (expense == null)
        {
            throw new KeyNotFoundException("Expense not found");
        }

        return new ExpenseResponse
        {
            Id = expense.Id,
            CategoryId = expense.CategoryId,
            CategoryName = expense.Category.Name,
            Amount = expense.Amount,
            Date = expense.Date,
            Description = expense.Description,
            PaymentMethod = expense.PaymentMethod,
            CreatedAt = expense.CreatedAt,
            UpdatedAt = expense.UpdatedAt
        };
    }

    public async Task<ExpensePaginatedResponse> GetExpenseListAsync(
        Guid adminId,
        int pageNumber = 1,
        int pageSize = 10,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        IQueryable<Expense> query = _context.Expenses
            .Where(e => e.AdminId == adminId)
            .Include(e => e.Category);

        if (startDate.HasValue)
        {
            query = query.Where(e => e.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.Date <= endDate.Value);
        }

        var totalCount = await query.CountAsync();
        var skip = (pageNumber - 1) * pageSize;

        var expenses = await query
            .OrderByDescending(e => e.Date)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        var items = expenses.Select(e => new ExpenseResponse
        {
            Id = e.Id,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description,
            PaymentMethod = e.PaymentMethod,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return new ExpensePaginatedResponse
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<ExpensePaginatedResponse> SearchExpenseAsync(
        Guid adminId,
        string searchTerm,
        int pageNumber = 1,
        int pageSize = 10)
    {
        var query = _context.Expenses
            .Where(e => e.AdminId == adminId && (
                e.Description.Contains(searchTerm) ||
                e.Category.Name.Contains(searchTerm)))
            .Include(e => e.Category);

        var totalCount = await query.CountAsync();
        var skip = (pageNumber - 1) * pageSize;

        var expenses = await query
            .OrderByDescending(e => e.Date)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        var items = expenses.Select(e => new ExpenseResponse
        {
            Id = e.Id,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description,
            PaymentMethod = e.PaymentMethod,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return new ExpensePaginatedResponse
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<ExpenseResponse> UpdateExpenseAsync(Guid adminId, Guid expenseId, UpdateExpenseRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var expense = await _context.Expenses
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == expenseId && e.AdminId == adminId);

            if (expense == null)
            {
                throw new KeyNotFoundException("Expense not found");
            }

            var categoryExists = await _context.ExpenseCategories
                .AnyAsync(c => c.Id == request.CategoryId && c.AdminId == adminId);

            if (!categoryExists)
            {
                throw new InvalidOperationException("Expense category not found");
            }

            var oldValues = System.Text.Json.JsonSerializer.Serialize(new
            {
                expense.CategoryId,
                expense.Amount,
                expense.Date,
                expense.Description,
                expense.PaymentMethod
            });

            expense.CategoryId = request.CategoryId;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.Description = request.Description;
            expense.PaymentMethod = request.PaymentMethod;
            expense.UpdatedAt = DateTime.UtcNow;

            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();

            var category = await _context.ExpenseCategories.FirstAsync(c => c.Id == request.CategoryId);

            var newValues = System.Text.Json.JsonSerializer.Serialize(new
            {
                expense.CategoryId,
                expense.Amount,
                expense.Date,
                expense.Description,
                expense.PaymentMethod
            });

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                AdminId = adminId,
                ActionType = "ExpenseUpdated",
                Description = $"Expense updated: {category.Name} - {request.Amount}",
                TransactionId = expense.Id,
                OldValues = oldValues,
                NewValues = newValues,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new ExpenseResponse
            {
                Id = expense.Id,
                CategoryId = expense.CategoryId,
                CategoryName = category.Name,
                Amount = expense.Amount,
                Date = expense.Date,
                Description = expense.Description,
                PaymentMethod = expense.PaymentMethod,
                CreatedAt = expense.CreatedAt,
                UpdatedAt = expense.UpdatedAt
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.Error(ex, "Error updating expense {ExpenseId} for admin {AdminId}", expenseId, adminId);
            throw;
        }
    }

    public async Task DeleteExpenseAsync(Guid adminId, Guid expenseId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var expense = await _context.Expenses
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == expenseId && e.AdminId == adminId);

            if (expense == null)
            {
                throw new KeyNotFoundException("Expense not found");
            }

            var oldValues = System.Text.Json.JsonSerializer.Serialize(new
            {
                expense.Id,
                expense.CategoryId,
                expense.Amount,
                expense.Date,
                expense.Description,
                expense.PaymentMethod
            });

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                AdminId = adminId,
                ActionType = "ExpenseDeleted",
                Description = $"Expense deleted: {expense.Category.Name} - {expense.Amount}",
                TransactionId = expense.Id,
                OldValues = oldValues,
                NewValues = null,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.Error(ex, "Error deleting expense {ExpenseId} for admin {AdminId}", expenseId, adminId);
            throw;
        }
    }
}
