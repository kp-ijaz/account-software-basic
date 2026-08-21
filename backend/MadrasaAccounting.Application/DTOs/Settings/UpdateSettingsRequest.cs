namespace MadrasaAccounting.Application.DTOs.Settings;

public class UpdateSettingsRequest
{
    public string MadrasaName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Currency { get; set; } = "AED";
    public DateTime? FinancialYearStart { get; set; }
}
