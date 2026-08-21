using MadrasaAccounting.Infrastructure.Data.Seed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace MadrasaAccounting.Infrastructure.Data;

public static class DbContextExtensions
{
    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MadrasaDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DataSeeder>>();

        try
        {
            var seeder = new DataSeeder(dbContext, logger);
            await seeder.SeedAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding database");
            throw;
        }
    }
}
