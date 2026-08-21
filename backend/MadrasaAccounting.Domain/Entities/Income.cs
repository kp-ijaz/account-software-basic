namespace MadrasaAccounting.Domain.Entities;

public class Income
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AdminId { get; set; }
    public Admin? Admin { get; set; }
    public Guid CategoryId { get; set; }
    public IncomeCategory? Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public required string PaymentMethod { get; set; } // Cash, Bank
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
