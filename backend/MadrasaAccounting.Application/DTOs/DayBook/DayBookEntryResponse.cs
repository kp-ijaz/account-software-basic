namespace MadrasaAccounting.Application.DTOs.DayBook;

public class DayBookEntryResponse
{
    public Guid TransactionId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Income { get; set; } // 0 if expense
    public decimal Expense { get; set; } // 0 if income
    public decimal RunningBalance { get; set; }
    public string TransactionType { get; set; } = string.Empty; // "Income" or "Expense"
    public string PaymentMethod { get; set; } = string.Empty;
}
