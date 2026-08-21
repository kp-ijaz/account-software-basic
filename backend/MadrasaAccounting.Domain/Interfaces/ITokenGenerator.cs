using System.Security.Claims;

namespace MadrasaAccounting.Domain.Interfaces;

public class TokenResult
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; } // Seconds
    public string ExpiresAt { get; set; } = string.Empty;
}

public interface ITokenGenerator
{
    TokenResult GenerateToken(Guid adminId, string email);
    bool ValidateToken(string token);
    ClaimsPrincipal? GetClaimsFromToken(string token);
}
