namespace MadrasaAccounting.Application.DTOs.Settings;

public class SettingsResponse
{
    public Guid Id { get; set; }
    public string MadrasaName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Currency { get; set; } = "AED";
    public DateTime? FinancialYearStart { get; set; }
    public string? LogoPath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
