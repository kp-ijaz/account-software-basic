namespace MadrasaAccounting.Application.DTOs.Income;

public class CreateIncomeRequest
{
    public Guid CategoryId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty; // Cash or Bank
}
