namespace MadrasaAccounting.Application.DTOs.Ledger;

public class LedgerPaginatedResponse
{
    public List<LedgerEntryResponse> Entries { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;

    // Summary
    public decimal TotalDebit { get; set; }
    public decimal TotalCredit { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal ClosingBalance { get; set; }
}
