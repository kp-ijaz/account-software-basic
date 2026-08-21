using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _reportsService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IReportsService reportsService, ILogger<ReportsController> logger)
    {
        _reportsService = reportsService;
        _logger = logger;
    }

    [HttpGet("monthly")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetMonthlyReport(
        [FromQuery] int month,
        [FromQuery] int year)
    {
        try
        {
            if (month < 1 || month > 12)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Month must be between 1 and 12"
                });
            }

            if (year < 2000 || year > DateTime.UtcNow.Year)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid year"
                });
            }

            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _reportsService.GetMonthlyReportAsync(adminId, month, year);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving monthly report");
            return BadRequest(new
            {
                success = false,
                message = "Unable to generate monthly report. Please try again."
            });
        }
    }

    [HttpGet("yearly")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetYearlyReport([FromQuery] int year)
    {
        try
        {
            if (year < 2000 || year > DateTime.UtcNow.Year)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid year"
                });
            }

            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _reportsService.GetYearlyReportAsync(adminId, year);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving yearly report");
            return BadRequest(new
            {
                success = false,
                message = "Unable to generate yearly report. Please try again."
            });
        }
    }

    [HttpGet("balance-sheet")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetBalanceSheet()
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _reportsService.GetBalanceSheetAsync(adminId);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving balance sheet");
            return BadRequest(new
            {
                success = false,
                message = "Unable to generate balance sheet. Please try again."
            });
        }
    }
}
