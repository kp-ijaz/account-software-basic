using MadrasaAccounting.Application.DTOs.Income;
using MadrasaAccounting.Domain.Entities;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MadrasaAccounting.Application.Services;

public class IncomeService : IIncomeService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger<IncomeService> _logger;

    public IncomeService(MadrasaDbContext context, ILogger<IncomeService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IncomeResponse> CreateIncomeAsync(Guid adminId, CreateIncomeRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Validate category exists
            var category = await _context.IncomeCategories
                .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.AdminId == adminId);

            if (category == null)
                throw new InvalidOperationException("Category not found");

            // Create income record
            var income = new Income
            {
                AdminId = adminId,
                CategoryId = request.CategoryId,
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                PaymentMethod = request.PaymentMethod,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            // Create audit log
            var auditLog = new AuditLog
            {
                AdminId = adminId,
                ActionType = "IncomeCreated",
                Description = $"Income created: {category.Name} - {request.Amount}",
                TransactionId = income.Id,
                NewValues = JsonConvert.SerializeObject(income),
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            _logger.LogInformation("Income created successfully. AdminId: {AdminId}, IncomeId: {IncomeId}", adminId, income.Id);

            return MapToResponse(income, category.Name);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error creating income for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while creating income", ex);
        }
    }

    public async Task<IncomeResponse> GetIncomeByIdAsync(Guid adminId, Guid incomeId)
    {
        try
        {
            var income = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == incomeId && i.AdminId == adminId);

            if (income == null)
                throw new InvalidOperationException("Income not found");

            return MapToResponse(income, income.Category?.Name ?? "Unknown");
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving income: {IncomeId}", incomeId);
            throw new Exception("An error occurred while retrieving income", ex);
        }
    }

    public async Task<IncomePaginatedResponse> GetIncomeListAsync(Guid adminId, int pageNumber = 1, int pageSize = 10, DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            IQueryable<Income> query = _context.Incomes
                .Where(i => i.AdminId == adminId)
                .Include(i => i.Category);

            if (startDate.HasValue)
                query = query.Where(i => i.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.Date <= endDate.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(i => i.Date)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new IncomePaginatedResponse
            {
                Items = items.Select(i => MapToResponse(i, i.Category?.Name ?? "Unknown")).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving income list for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while retrieving income list", ex);
        }
    }

    public async Task<IncomePaginatedResponse> SearchIncomeAsync(Guid adminId, string searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.Incomes
                .Where(i => i.AdminId == adminId)
                .Include(i => i.Category)
                .Where(i => i.Description.Contains(searchTerm) || i.Category!.Name.Contains(searchTerm));

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(i => i.Date)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new IncomePaginatedResponse
            {
                Items = items.Select(i => MapToResponse(i, i.Category?.Name ?? "Unknown")).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching income for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while searching income", ex);
        }
    }

    public async Task<IncomeResponse> UpdateIncomeAsync(Guid adminId, Guid incomeId, UpdateIncomeRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var income = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == incomeId && i.AdminId == adminId);

            if (income == null)
                throw new InvalidOperationException("Income not found");

            // Validate category exists
            var category = await _context.IncomeCategories
                .FirstOrDefaultAsync(c => c.Id == request.CategoryId && c.AdminId == adminId);

            if (category == null)
                throw new InvalidOperationException("Category not found");

            // Store old values for audit
            var oldValues = JsonConvert.SerializeObject(new { income.Amount, income.Date, income.Description, income.PaymentMethod });

            // Update income
            income.CategoryId = request.CategoryId;
            income.Amount = request.Amount;
            income.Date = request.Date;
            income.Description = request.Description;
            income.PaymentMethod = request.PaymentMethod;
            income.UpdatedAt = DateTime.UtcNow;

            _context.Incomes.Update(income);
            await _context.SaveChangesAsync();

            // Create audit log
            var auditLog = new AuditLog
            {
                AdminId = adminId,
                ActionType = "IncomeUpdated",
                Description = $"Income updated: {category.Name} - {request.Amount}",
                TransactionId = incomeId,
                OldValues = oldValues,
                NewValues = JsonConvert.SerializeObject(new { income.Amount, income.Date, income.Description, income.PaymentMethod }),
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            _logger.LogInformation("Income updated successfully. AdminId: {AdminId}, IncomeId: {IncomeId}", adminId, incomeId);

            return MapToResponse(income, category.Name);
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating income: {IncomeId}", incomeId);
            throw new Exception("An error occurred while updating income", ex);
        }
    }

    public async Task DeleteIncomeAsync(Guid adminId, Guid incomeId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var income = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == incomeId && i.AdminId == adminId);

            if (income == null)
                throw new InvalidOperationException("Income not found");

            var categoryName = income.Category?.Name ?? "Unknown";

            // Delete income
            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();

            // Create audit log
            var auditLog = new AuditLog
            {
                AdminId = adminId,
                ActionType = "IncomeDeleted",
                Description = $"Income deleted: {categoryName} - {income.Amount}",
                TransactionId = incomeId,
                OldValues = JsonConvert.SerializeObject(income),
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            _logger.LogInformation("Income deleted successfully. AdminId: {AdminId}, IncomeId: {IncomeId}", adminId, incomeId);
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error deleting income: {IncomeId}", incomeId);
            throw new Exception("An error occurred while deleting income", ex);
        }
    }

    private IncomeResponse MapToResponse(Income income, string categoryName)
    {
        return new IncomeResponse
        {
            Id = income.Id,
            CategoryId = income.CategoryId,
            CategoryName = categoryName,
            Amount = income.Amount,
            Date = income.Date,
            Description = income.Description ?? string.Empty,
            PaymentMethod = income.PaymentMethod,
            CreatedAt = income.CreatedAt,
            UpdatedAt = income.UpdatedAt
        };
    }
}
