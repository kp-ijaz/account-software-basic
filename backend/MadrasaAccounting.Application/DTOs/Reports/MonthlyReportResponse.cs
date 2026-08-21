namespace MadrasaAccounting.Application.DTOs.Reports;

public class MonthlyReportResponse
{
    public int Month { get; set; }
    public int Year { get; set; }
    public string MonthName { get; set; } = string.Empty;

    // Summary
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal NetBalance => TotalIncome - TotalExpense;

    // Category summaries
    public List<CategorySummaryResponse> IncomeByCategory { get; set; } = new();
    public List<CategorySummaryResponse> ExpenseByCategory { get; set; } = new();

    // Detailed entries
    public List<DayBookEntryForReportResponse> DayBookEntries { get; set; } = new();
    public List<LedgerEntryForReportResponse> LedgerEntries { get; set; } = new();

    // Opening/Closing balance
    public decimal OpeningBalance { get; set; }
    public decimal ClosingBalance => OpeningBalance + NetBalance;
}

public class CategorySummaryResponse
{
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int TransactionCount { get; set; }
    public decimal Percentage { get; set; } // Percentage of total income/expense
}

public class DayBookEntryForReportResponse
{
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
    public decimal Balance { get; set; }
}

public class LedgerEntryForReportResponse
{
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
    public decimal Balance { get; set; }
}
