using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LedgerController : ControllerBase
{
    private readonly ILedgerService _ledgerService;
    private readonly ILogger<LedgerController> _logger;

    public LedgerController(ILedgerService ledgerService, ILogger<LedgerController> logger)
    {
        _ledgerService = ledgerService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetLedger(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? categoryFilter = null,
        [FromQuery] string? typeFilter = null)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _ledgerService.GetLedgerAsync(adminId, pageNumber, pageSize, startDate, endDate, categoryFilter, typeFilter);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ledger");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve ledger. Please try again."
            });
        }
    }

    [HttpGet("month")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisMonthLedger([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _ledgerService.GetThisMonthLedgerAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this month's ledger");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this month's ledger. Please try again."
            });
        }
    }

    [HttpGet("year")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisYearLedger([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _ledgerService.GetThisYearLedgerAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this year's ledger");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this year's ledger. Please try again."
            });
        }
    }
}
