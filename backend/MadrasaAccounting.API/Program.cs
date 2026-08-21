using MadrasaAccounting.API.Middleware;
using MadrasaAccounting.Application.Services;
using MadrasaAccounting.Application.Validators.Auth;
using MadrasaAccounting.Application.Validators.Expense;
using MadrasaAccounting.Domain.Interfaces;
using MadrasaAccounting.Infrastructure.Data;
using MadrasaAccounting.Infrastructure.Security;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Serilog;

// Setup Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "logs/madrasa-accounting-.txt",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

try
{
    Log.Information("Starting Madrasa Accounting API...");

    var builder = WebApplication.CreateBuilder(args);

    // Add Serilog
    builder.Host.UseSerilog();

    // Add services
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Add Database
    var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
    builder.Services.AddDbContext<MadrasaDbContext>(options =>
        options.UseNpgsql(connectionString, npgsqlOptions =>
            npgsqlOptions.MigrationsAssembly("MadrasaAccounting.Infrastructure")
        )
    );

    // Add CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFlutterApp", policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    });

    // Add AutoMapper
    builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

    // Add Fluent Validation
    builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

    // Add Security Services
    var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
    var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "MadrasaAccountingAPI";
    var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "MadrasaAccountingApp";
    var jwtExpiration = int.Parse(builder.Configuration["JwtSettings:ExpirationHours"] ?? "24");

    builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
    builder.Services.AddSingleton<ITokenGenerator>(new JwtTokenGenerator(jwtSecret, jwtIssuer, jwtAudience, jwtExpiration));

    // Add Authentication
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,
                ValidateAudience = true,
                ValidAudience = jwtAudience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

    // Add Authorization
    builder.Services.AddAuthorization();

    // Add Application Services
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ISettingsService, SettingsService>();
    builder.Services.AddScoped<IIncomeService, IncomeService>();
    builder.Services.AddScoped<IExpenseService, ExpenseService>();
    builder.Services.AddScoped<IDayBookService, DayBookService>();
    builder.Services.AddScoped<ILedgerService, LedgerService>();
    builder.Services.AddScoped<IDashboardService, DashboardService>();
    builder.Services.AddScoped<IReportsService, ReportsService>();
    builder.Services.AddScoped<IAuditLogService, AuditLogService>();

    var app = builder.Build();

    // Apply migrations automatically on startup
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<MadrasaDbContext>();
        dbContext.Database.Migrate();
        Log.Information("Database migrations applied successfully.");
    }

    // Seed database with default data
    await app.Services.SeedDatabaseAsync();
    Log.Information("Database seeding completed successfully.");

    // Configure middleware pipeline
    app.UseMiddleware<ErrorHandlingMiddleware>();
    app.UseRateLimiting();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("AllowFlutterApp");
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    Log.Information("Madrasa Accounting API started successfully.");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    await Log.CloseAndFlushAsync();
}
