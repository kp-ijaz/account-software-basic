namespace MadrasaAccounting.Application.DTOs.Auth;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; }
    public string ExpiresAt { get; set; } = string.Empty;
    public AdminInfoDto? Admin { get; set; }
}

public class AdminInfoDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
