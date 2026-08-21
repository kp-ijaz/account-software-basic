namespace MadrasaAccounting.Domain.Entities;

public class Settings
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AdminId { get; set; }
    public Admin? Admin { get; set; }
    public string? MadrasaName { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string Currency { get; set; } = "AED";
    public DateTime? FinancialYearStart { get; set; }
    public string? LogoPath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
