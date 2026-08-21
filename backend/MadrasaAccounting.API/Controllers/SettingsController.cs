using MadrasaAccounting.Application.DTOs.Settings;
using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(ISettingsService settingsService, ILogger<SettingsController> logger)
    {
        _settingsService = settingsService;
        _logger = logger;
    }

    /// <summary>
    /// Get current madrasa settings
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetSettings()
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

            var settings = await _settingsService.GetSettingsAsync(adminId);

            return Ok(new
            {
                success = true,
                data = settings,
                message = "Settings retrieved successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving settings");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while retrieving settings",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Update madrasa settings
    /// </summary>
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsRequest request)
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

            var settings = await _settingsService.UpdateSettingsAsync(adminId, request);

            return Ok(new
            {
                success = true,
                data = settings,
                message = "Settings updated successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Invalid operation: {Message}", ex.Message);
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                errors = new[] { ex.Message },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating settings");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while updating settings",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Upload madrasa logo
    /// </summary>
    [HttpPost("upload-logo")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadLogo(IFormFile file)
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

            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "No file provided",
                    errors = new[] { "Please select a file to upload" },
                    timestamp = DateTime.UtcNow
                });
            }

            using var stream = file.OpenReadStream();
            var logoPath = await _settingsService.UploadLogoAsync(adminId, stream, file.FileName);

            return Ok(new
            {
                success = true,
                data = new { logoPath = logoPath },
                message = "Logo uploaded successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid file upload: {Message}", ex.Message);
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                errors = new[] { ex.Message },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading logo");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while uploading logo",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }
}
