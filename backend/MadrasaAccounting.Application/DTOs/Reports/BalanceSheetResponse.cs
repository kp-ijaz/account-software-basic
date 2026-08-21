namespace MadrasaAccounting.Application.DTOs.Reports;

public class BalanceSheetResponse
{
    public DateTime AsOfDate { get; set; }

    // Assets
    public decimal CashBalance { get; set; }
    public decimal BankBalance { get; set; }
    public decimal TotalAssets => CashBalance + BankBalance;

    // Liabilities
    public decimal PendingPayments { get; set; } // Currently 0 (not implemented)
    public decimal TotalLiabilities => PendingPayments;

    // Equity/Current Balance
    public decimal CurrentBalance { get; set; }

    // Balance verification
    public decimal TotalAssetsAndLiabilities => TotalAssets + TotalLiabilities;
    public bool IsBalanced => Math.Abs(TotalAssets - CurrentBalance) < 0.01m; // Allow 0.01 rounding difference
}
