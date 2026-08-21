using System.Net;
using System.Text.Json;
using Serilog;

namespace MadrasaAccounting.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        Log.Error(ex, "Unhandled exception occurred");

        var response = context.Response;
        response.ContentType = "application/json";
        response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var errorResponse = new
        {
            success = false,
            message = "An unexpected error occurred. Please try again later.",
            errors = new List<string>(),
            timestamp = DateTime.UtcNow
        };

        // Log detailed error information
        if (context.RequestServices.GetService(typeof(ILogger<ErrorHandlingMiddleware>)) is ILogger<ErrorHandlingMiddleware> logger)
        {
            logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
        }

        var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        return response.WriteAsync(json);
    }
}
