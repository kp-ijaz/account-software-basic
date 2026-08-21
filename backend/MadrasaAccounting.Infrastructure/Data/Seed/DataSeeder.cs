using MadrasaAccounting.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MadrasaAccounting.Infrastructure.Data.Seed;

public class DataSeeder
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger<DataSeeder> _logger;

    public DataSeeder(MadrasaDbContext context, ILogger<DataSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting database seeding...");

            // Only seed if database is empty
            if (await _context.Admins.AnyAsync())
            {
                _logger.LogInformation("Database already seeded. Skipping.");
                return;
            }

            // Create initial admin account
            await SeedAdminAsync();

            // Seed categories
            await SeedIncomeCategoriesAsync();
            await SeedExpenseCategoriesAsync();

            // Save all changes
            await _context.SaveChangesAsync();

            _logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding database");
            throw;
        }
    }

    private async Task SeedAdminAsync()
    {
        _logger.LogInformation("Seeding admin account...");

        var admin = new Admin
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@madrasa.local",
            PasswordHash = "AQAAAAIAAYagAAAAEL8q1Y2K7qK2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2q2", // Placeholder - must be hashed in Phase 4
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Admins.Add(admin);
        _logger.LogInformation("Admin account seeded: {Username}", admin.Username);
    }

    private async Task SeedIncomeCategoriesAsync()
    {
        _logger.LogInformation("Seeding income categories...");

        var admin = _context.Admins.Local.FirstOrDefault() ?? (await _context.Admins.FirstAsync());
        var adminId = admin.Id;

        var categories = new List<IncomeCategory>
        {
            new() { AdminId = adminId, Name = "Student Fees", IsDefault = true },
            new() { AdminId = adminId, Name = "Donations", IsDefault = true },
            new() { AdminId = adminId, Name = "Zakat", IsDefault = true },
            new() { AdminId = adminId, Name = "Sadaqah", IsDefault = true },
            new() { AdminId = adminId, Name = "Sponsorship", IsDefault = true },
            new() { AdminId = adminId, Name = "Building Fund", IsDefault = true },
            new() { AdminId = adminId, Name = "Other Income", IsDefault = true },
        };

        _context.IncomeCategories.AddRange(categories);
        _logger.LogInformation("Seeded {Count} income categories", categories.Count);
    }

    private async Task SeedExpenseCategoriesAsync()
    {
        _logger.LogInformation("Seeding expense categories...");

        var admin = _context.Admins.Local.FirstOrDefault() ?? (await _context.Admins.FirstAsync());
        var adminId = admin.Id;

        var categories = new List<ExpenseCategory>
        {
            new() { AdminId = adminId, Name = "Teacher Salary", IsDefault = true },
            new() { AdminId = adminId, Name = "Electricity", IsDefault = true },
            new() { AdminId = adminId, Name = "Water", IsDefault = true },
            new() { AdminId = adminId, Name = "Food", IsDefault = true },
            new() { AdminId = adminId, Name = "Maintenance", IsDefault = true },
            new() { AdminId = adminId, Name = "Stationery", IsDefault = true },
            new() { AdminId = adminId, Name = "Events", IsDefault = true },
            new() { AdminId = adminId, Name = "Building Maintenance", IsDefault = true },
            new() { AdminId = adminId, Name = "Miscellaneous", IsDefault = true },
        };

        _context.ExpenseCategories.AddRange(categories);
        _logger.LogInformation("Seeded {Count} expense categories", categories.Count);
    }
}
