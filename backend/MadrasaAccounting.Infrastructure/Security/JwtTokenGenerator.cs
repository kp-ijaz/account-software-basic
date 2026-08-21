using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MadrasaAccounting.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace MadrasaAccounting.Infrastructure.Security;

public class JwtTokenGenerator : ITokenGenerator
{
    private readonly string _secret;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationHours;

    public JwtTokenGenerator(string secret, string issuer, string audience, int expirationHours = 24)
    {
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
            throw new ArgumentException("JWT secret must be at least 32 characters", nameof(secret));

        _secret = secret;
        _issuer = issuer;
        _audience = audience;
        _expirationHours = expirationHours;
    }

    public TokenResult GenerateToken(Guid adminId, string email)
    {
        if (adminId == Guid.Empty)
            throw new ArgumentException("Admin ID cannot be empty", nameof(adminId));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var now = DateTime.UtcNow;
        var expiration = now.AddHours(_expirationHours);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, adminId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim("sub", adminId.ToString()),
            new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: now,
            expires: expiration,
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new TokenResult
        {
            AccessToken = accessToken,
            TokenType = "Bearer",
            ExpiresIn = (int)(_expirationHours * 3600),
            ExpiresAt = expiration.ToString("O")
        };
    }

    public bool ValidateToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return false;

        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            var tokenHandler = new JwtSecurityTokenHandler();

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return validatedToken is JwtSecurityToken;
        }
        catch
        {
            return false;
        }
    }

    public ClaimsPrincipal? GetClaimsFromToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
