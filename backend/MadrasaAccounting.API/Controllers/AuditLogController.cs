using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;
    private readonly ILogger<AuditLogController> _logger;

    public AuditLogController(IAuditLogService auditLogService, ILogger<AuditLogController> logger)
    {
        _auditLogService = auditLogService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetAuditLogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? actionTypeFilter = null,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _auditLogService.GetAuditLogsAsync(adminId, pageNumber, pageSize, startDate, endDate, actionTypeFilter, searchTerm);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving audit logs");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve audit logs. Please try again."
            });
        }
    }

    [HttpGet("today")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetTodayAuditLogs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _auditLogService.GetTodayAuditLogsAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving today's audit logs");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve today's audit logs. Please try again."
            });
        }
    }

    [HttpGet("week")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisWeekAuditLogs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _auditLogService.GetThisWeekAuditLogsAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this week's audit logs");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this week's audit logs. Please try again."
            });
        }
    }

    [HttpGet("month")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisMonthAuditLogs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _auditLogService.GetThisMonthAuditLogsAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this month's audit logs");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this month's audit logs. Please try again."
            });
        }
    }
}
