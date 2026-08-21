using MadrasaAccounting.Application.DTOs.Auth;
using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login with username/email and password
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);

            return Ok(new
            {
                success = true,
                data = response,
                message = "Login successful",
                timestamp = DateTime.UtcNow
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized login attempt: {Message}", ex.Message);
            return Unauthorized(new
            {
                success = false,
                message = ex.Message,
                errors = new[] { ex.Message },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred during login. Please try again.",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Logout (optional - mainly for logging purposes)
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid token",
                    errors = new[] { "Invalid token" },
                    timestamp = DateTime.UtcNow
                });
            }

            await _authService.LogoutAsync(adminId);

            return Ok(new
            {
                success = true,
                message = "Logout successful",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred during logout",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Change admin password
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid token",
                    errors = new[] { "Invalid token" },
                    timestamp = DateTime.UtcNow
                });
            }

            await _authService.ChangePasswordAsync(adminId, request);

            return Ok(new
            {
                success = true,
                message = "Password changed successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized password change attempt: {Message}", ex.Message);
            return Unauthorized(new
            {
                success = false,
                message = ex.Message,
                errors = new[] { ex.Message },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while changing password",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Verify token (for client-side token validation)
    /// </summary>
    [HttpPost("verify-token")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult VerifyToken()
    {
        return Ok(new
        {
            success = true,
            message = "Token is valid",
            timestamp = DateTime.UtcNow
        });
    }
}
