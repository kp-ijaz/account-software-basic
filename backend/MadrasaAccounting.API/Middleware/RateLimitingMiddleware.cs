using System.Collections.Concurrent;

namespace MadrasaAccounting.API.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly ConcurrentDictionary<string, RequestHistory> RequestHistories = new();
    private const int LoginLimitPerMinute = 5;
    private const int PasswordChangeLimitPerMinute = 3;
    private const int GeneralLimitPerMinute = 100;

    public RateLimitingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var path = context.Request.Path.Value ?? string.Empty;

        // Get rate limit based on endpoint
        int limit = GeneralLimitPerMinute;
        if (path.Contains("/auth/login", StringComparison.OrdinalIgnoreCase))
            limit = LoginLimitPerMinute;
        else if (path.Contains("/auth/change-password", StringComparison.OrdinalIgnoreCase))
            limit = PasswordChangeLimitPerMinute;

        // Check rate limit
        if (!IsRequestAllowed(clientId, path, limit))
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                message = "Too many requests. Please try again later.",
                errors = new[] { "Rate limit exceeded" },
                timestamp = DateTime.UtcNow
            });
            return;
        }

        await _next(context);
    }

    private static string GetClientIdentifier(HttpContext context)
    {
        // Try to get IP from X-Forwarded-For header first (for proxy scenarios)
        if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            var ips = forwardedFor.ToString().Split(',');
            if (ips.Length > 0 && !string.IsNullOrWhiteSpace(ips[0]))
            {
                return ips[0].Trim();
            }
        }

        // Fall back to connection remote IP
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static bool IsRequestAllowed(string clientId, string path, int limit)
    {
        var key = $"{clientId}:{path}";
        var now = DateTime.UtcNow;

        var initialQueue = new Queue<DateTime>();
        initialQueue.Enqueue(now);

        RequestHistories.AddOrUpdate(key,
            new RequestHistory { Timestamps = initialQueue },
            (k, history) =>
            {
                // Remove timestamps older than 1 minute
                while (history.Timestamps.Count > 0 && (now - history.Timestamps.Peek()).TotalMinutes > 1)
                {
                    history.Timestamps.Dequeue();
                }

                // Check if limit exceeded
                if (history.Timestamps.Count >= limit)
                {
                    return history;
                }

                history.Timestamps.Enqueue(now);
                return history;
            });

        var requestHistory = RequestHistories[key];
        return requestHistory.Timestamps.Count <= limit;
    }

    private class RequestHistory
    {
        public Queue<DateTime> Timestamps { get; set; } = new();
    }
}

public static class RateLimitingExtensions
{
    public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RateLimitingMiddleware>();
    }
}
