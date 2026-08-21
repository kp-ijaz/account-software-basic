using MadrasaAccounting.Application.DTOs.Income;
using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncomeController : ControllerBase
{
    private readonly IIncomeService _incomeService;
    private readonly ILogger<IncomeController> _logger;

    public IncomeController(IIncomeService incomeService, ILogger<IncomeController> logger)
    {
        _incomeService = incomeService;
        _logger = logger;
    }

    /// <summary>
    /// Create new income record
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeRequest request)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            var income = await _incomeService.CreateIncomeAsync(adminId, request);

            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, new
            {
                success = true,
                data = income,
                message = "Income created successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (InvalidOperationException ex)
        {
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
            _logger.LogError(ex, "Error creating income");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while creating income",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get income by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIncome(Guid id)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            var income = await _incomeService.GetIncomeByIdAsync(adminId, id);

            return Ok(new
            {
                success = true,
                data = income,
                message = "Income retrieved successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (InvalidOperationException)
        {
            return NotFound(new
            {
                success = false,
                message = "Income not found",
                errors = new[] { "Income not found" },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving income");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while retrieving income",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get paginated income list with date filtering
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIncomeList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            var result = await _incomeService.GetIncomeListAsync(adminId, pageNumber, pageSize, startDate, endDate);

            return Ok(new
            {
                success = true,
                data = result,
                message = "Income list retrieved successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving income list");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while retrieving income list",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Search income by description or category
    /// </summary>
    [HttpGet("search/{searchTerm}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchIncome(
        string searchTerm,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            var result = await _incomeService.SearchIncomeAsync(adminId, searchTerm, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result,
                message = "Income search results retrieved successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching income");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while searching income",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Update income record
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateIncome(Guid id, [FromBody] UpdateIncomeRequest request)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            var income = await _incomeService.UpdateIncomeAsync(adminId, id, request);

            return Ok(new
            {
                success = true,
                data = income,
                message = "Income updated successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (InvalidOperationException ex)
        {
            return ex.Message.Contains("not found")
                ? NotFound(new
                {
                    success = false,
                    message = ex.Message,
                    errors = new[] { ex.Message },
                    timestamp = DateTime.UtcNow
                })
                : BadRequest(new
                {
                    success = false,
                    message = ex.Message,
                    errors = new[] { ex.Message },
                    timestamp = DateTime.UtcNow
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating income");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while updating income",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Delete income record
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteIncome(Guid id)
    {
        try
        {
            var adminIdClaim = User.FindFirst("sub");
            if (adminIdClaim == null || !Guid.TryParse(adminIdClaim.Value, out var adminId))
            {
                return Unauthorized();
            }

            await _incomeService.DeleteIncomeAsync(adminId, id);

            return Ok(new
            {
                success = true,
                message = "Income deleted successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (InvalidOperationException)
        {
            return NotFound(new
            {
                success = false,
                message = "Income not found",
                errors = new[] { "Income not found" },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting income");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while deleting income",
                errors = new string[0],
                timestamp = DateTime.UtcNow
            });
        }
    }
}
