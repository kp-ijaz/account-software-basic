namespace MadrasaAccounting.Domain.Entities;

public class ExpenseCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AdminId { get; set; }
    public Admin? Admin { get; set; }
    public required string Name { get; set; }
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
