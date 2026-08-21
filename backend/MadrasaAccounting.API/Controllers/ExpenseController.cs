using MadrasaAccounting.Application.DTOs.Expense;
using MadrasaAccounting.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MadrasaAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;
    private readonly ILogger<ExpenseController> _logger;

    public ExpenseController(IExpenseService expenseService, ILogger<ExpenseController> logger)
    {
        _expenseService = expenseService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> CreateExpense([FromBody] CreateExpenseRequest request)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _expenseService.CreateExpenseAsync(adminId, request);

            return CreatedAtAction(nameof(GetExpense), new { id = result.Id }, new
            {
                success = true,
                data = result
            });
        }
        catch (FluentValidation.ValidationException ex)
        {
            _logger.LogWarning("Validation error creating expense: {Message}", ex.Message);
            return BadRequest(new
            {
                success = false,
                message = "Validation failed",
                errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }).ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating expense");
            return BadRequest(new
            {
                success = false,
                message = "Unable to create expense. Please try again."
            });
        }
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetExpenseList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _expenseService.GetExpenseListAsync(adminId, pageNumber, pageSize, startDate, endDate);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving expenses");
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve expenses. Please try again."
            });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> GetExpense(Guid id)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _expenseService.GetExpenseByIdAsync(adminId, id);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new
            {
                success = false,
                message = "Expense not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving expense {ExpenseId}", id);
            return BadRequest(new
            {
                success = false,
                message = "Unable to retrieve expense. Please try again."
            });
        }
    }

    [HttpGet("search/{searchTerm}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> SearchExpense(
        string searchTerm,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _expenseService.SearchExpenseAsync(adminId, searchTerm, pageNumber, pageSize);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching expenses with term {SearchTerm}", searchTerm);
            return BadRequest(new
            {
                success = false,
                message = "Unable to search expenses. Please try again."
            });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> UpdateExpense(Guid id, [FromBody] UpdateExpenseRequest request)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            var result = await _expenseService.UpdateExpenseAsync(adminId, id, request);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (FluentValidation.ValidationException ex)
        {
            _logger.LogWarning("Validation error updating expense: {Message}", ex.Message);
            return BadRequest(new
            {
                success = false,
                message = "Validation failed",
                errors = ex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }).ToList()
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new
            {
                success = false,
                message = "Expense not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expense {ExpenseId}", id);
            return BadRequest(new
            {
                success = false,
                message = "Unable to update expense. Please try again."
            });
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> DeleteExpense(Guid id)
    {
        try
        {
            var adminId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("Admin ID not found"));

            await _expenseService.DeleteExpenseAsync(adminId, id);

            return Ok(new
            {
                success = true,
                message = "Expense deleted successfully"
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new
            {
                success = false,
                message = "Expense not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting expense {ExpenseId}", id);
            return BadRequest(new
            {
                success = false,
                message = "Unable to delete expense. Please try again."
            });
        }
    }
}
