namespace MadrasaAccounting.Application.DTOs.AuditLog;

public class AuditLogResponse
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? TransactionId { get; set; }
    public string OldValues { get; set; } = string.Empty; // JSON string for changed fields
    public string NewValues { get; set; } = string.Empty; // JSON string for changed fields
}
