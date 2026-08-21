using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DayBookController : ControllerBase
{
    private readonly IDayBookService _dayBookService;
    private readonly ILogger<DayBookController> _logger;

    public DayBookController(IDayBookService dayBookService, ILogger<DayBookController> logger)
    {
        _dayBookService = dayBookService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetDayBook(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _dayBookService.GetDayBookAsync(adminId, pageNumber, pageSize, startDate, endDate, searchTerm);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving day book");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve day book. Please try again."
            });
        }
    }

    [HttpGet("today")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetTodayDayBook([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _dayBookService.GetTodayDayBookAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving today's day book");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve today's day book. Please try again."
            });
        }
    }

    [HttpGet("week")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisWeekDayBook([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _dayBookService.GetThisWeekDayBookAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this week's day book");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this week's day book. Please try again."
            });
        }
    }

    [HttpGet("month")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetThisMonthDayBook([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _dayBookService.GetThisMonthDayBookAsync(adminId, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving this month's day book");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve this month's day book. Please try again."
            });
        }
    }
}
