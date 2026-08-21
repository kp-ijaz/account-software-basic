using MadrasaAccounting.Application.DTOs.Auth;
using MadrasaAccounting.Domain.Interfaces;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MadrasaAccounting.Application.Services;

public class AuthService : IAuthService
{
    private readonly MadrasaDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        MadrasaDbContext context,
        IPasswordHasher passwordHasher,
        ITokenGenerator tokenGenerator,
        ILogger<AuthService> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            // Find admin by username or email
            var admin = await _context.Admins
                .Where(a => a.Username == request.UsernameOrEmail || a.Email == request.UsernameOrEmail)
                .FirstOrDefaultAsync();

            if (admin == null)
            {
                _logger.LogWarning("Login attempt with invalid username/email: {UsernameOrEmail}", request.UsernameOrEmail);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            if (!admin.IsActive)
            {
                _logger.LogWarning("Login attempt for inactive admin: {AdminId}", admin.Id);
                throw new UnauthorizedAccessException("Admin account is inactive");
            }

            // Verify password
            if (!_passwordHasher.VerifyPassword(request.Password, admin.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for admin: {AdminId}", admin.Id);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            // Update last login
            admin.LastLogin = DateTime.UtcNow;
            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();

            // Generate token
            var tokenResult = _tokenGenerator.GenerateToken(admin.Id, admin.Email);

            _logger.LogInformation("Admin logged in successfully: {AdminId}", admin.Id);

            return new LoginResponse
            {
                AccessToken = tokenResult.AccessToken,
                TokenType = tokenResult.TokenType,
                ExpiresIn = tokenResult.ExpiresIn,
                ExpiresAt = tokenResult.ExpiresAt,
                Admin = new AdminInfoDto
                {
                    Id = admin.Id,
                    Username = admin.Username,
                    Email = admin.Email
                }
            };
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            throw new Exception("An error occurred during login. Please try again.", ex);
        }
    }

    public async Task LogoutAsync(Guid adminId)
    {
        try
        {
            var admin = await _context.Admins.FindAsync(adminId);
            if (admin != null)
            {
                _logger.LogInformation("Admin logged out: {AdminId}", adminId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for admin: {AdminId}", adminId);
        }

        await Task.CompletedTask;
    }

    public async Task ChangePasswordAsync(Guid adminId, ChangePasswordRequest request)
    {
        try
        {
            var admin = await _context.Admins.FindAsync(adminId);
            if (admin == null)
            {
                throw new InvalidOperationException("Admin not found");
            }

            // Verify current password
            if (!_passwordHasher.VerifyPassword(request.CurrentPassword, admin.PasswordHash))
            {
                _logger.LogWarning("Failed password change attempt for admin: {AdminId}", adminId);
                throw new UnauthorizedAccessException("Current password is incorrect");
            }

            // Hash new password
            admin.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
            admin.UpdatedAt = DateTime.UtcNow;

            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin changed password: {AdminId}", adminId);
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while changing password. Please try again.", ex);
        }
    }
}
