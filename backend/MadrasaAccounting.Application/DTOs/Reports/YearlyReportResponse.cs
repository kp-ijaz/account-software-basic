namespace MadrasaAccounting.Application.DTOs.Reports;

public class YearlyReportResponse
{
    public int Year { get; set; }
    public List<YearlyMonthDataResponse> MonthlyData { get; set; } = new();
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal AnnualBalance => TotalIncome - TotalExpense;
}

public class YearlyMonthDataResponse
{
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
    public decimal Balance => Income - Expense;
}
