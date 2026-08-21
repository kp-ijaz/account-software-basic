namespace MadrasaAccounting.Application.DTOs.Dashboard;

public class DashboardSummaryResponse
{
    // Today's metrics
    public decimal TodayIncome { get; set; }
    public decimal TodayExpense { get; set; }
    public decimal TodayBalance => TodayIncome - TodayExpense;

    // This month's metrics
    public decimal ThisMonthIncome { get; set; }
    public decimal ThisMonthExpense { get; set; }
    public decimal ThisMonthBalance => ThisMonthIncome - ThisMonthExpense;

    // Current balance (all time)
    public decimal CurrentCashBalance { get; set; }
    public decimal CurrentBankBalance { get; set; }
    public decimal TotalCurrentBalance => CurrentCashBalance + CurrentBankBalance;

    // Recent transactions
    public List<RecentTransactionResponse> RecentTransactions { get; set; } = new();

    // Chart data
    public List<MonthlyChartDataResponse> MonthlyChartData { get; set; } = new();
}

public class RecentTransactionResponse
{
    public Guid TransactionId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty; // "Income" or "Expense"
    public string PaymentMethod { get; set; } = string.Empty;
}

public class MonthlyChartDataResponse
{
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
    public decimal Balance => Income - Expense;
}
