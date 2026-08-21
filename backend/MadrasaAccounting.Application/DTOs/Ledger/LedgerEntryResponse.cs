namespace MadrasaAccounting.Application.DTOs.Ledger;

public class LedgerEntryResponse
{
    public Guid TransactionId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Debit { get; set; } // Income amount
    public decimal Credit { get; set; } // Expense amount
    public decimal RunningBalance { get; set; }
    public string TransactionType { get; set; } = string.Empty; // "Income" or "Expense"
    public string PaymentMethod { get; set; } = string.Empty;
}
