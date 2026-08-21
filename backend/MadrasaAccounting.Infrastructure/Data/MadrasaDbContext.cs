using MadrasaAccounting.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MadrasaAccounting.Infrastructure.Data;

public class MadrasaDbContext : DbContext
{
    public MadrasaDbContext(DbContextOptions<MadrasaDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<IncomeCategory> IncomeCategories => Set<IncomeCategory>();
    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<Income> Incomes => Set<Income>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Settings> Settings => Set<Settings>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Admin Configuration
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).ValueGeneratedOnAdd();

            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Income Category Configuration
        modelBuilder.Entity<IncomeCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.AdminId, e.Name }).IsUnique();
        });

        // Expense Category Configuration
        modelBuilder.Entity<ExpenseCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.AdminId, e.Name }).IsUnique();
        });

        // Income Configuration
        modelBuilder.Entity<Income>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)").IsRequired();
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PaymentMethod).IsRequired();
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasCheckConstraint("CK_Income_Amount_Positive", "\"Amount\" > 0");

            entity.HasIndex(e => new { e.AdminId, e.Date });
            entity.HasIndex(e => e.CategoryId);
        });

        // Expense Configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)").IsRequired();
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PaymentMethod).IsRequired();
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasCheckConstraint("CK_Expense_Amount_Positive", "\"Amount\" > 0");

            entity.HasIndex(e => new { e.AdminId, e.Date });
            entity.HasIndex(e => e.CategoryId);
        });

        // Settings Configuration
        modelBuilder.Entity<Settings>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MadrasaName).HasMaxLength(255);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("AED");
            entity.Property(e => e.LogoPath).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AdminId).IsUnique();
        });

        // Audit Log Configuration
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActionType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.OldValues).HasColumnType("jsonb").IsRequired(false);
            entity.Property(e => e.NewValues).HasColumnType("jsonb").IsRequired(false);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.Timestamp).ValueGeneratedOnAdd();

            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.AdminId, e.Timestamp });
            entity.HasIndex(e => e.ActionType);
        });
    }
}
