using MadrasaAccounting.Application.DTOs.Settings;
using MadrasaAccounting.Domain.Entities;
using MadrasaAccounting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MadrasaAccounting.Application.Services;

public class SettingsService : ISettingsService
{
    private readonly MadrasaDbContext _context;
    private readonly ILogger<SettingsService> _logger;
    private const string LogoUploadPath = "uploads/logos";

    public SettingsService(MadrasaDbContext context, ILogger<SettingsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<SettingsResponse> GetSettingsAsync(Guid adminId)
    {
        try
        {
            var settings = await _context.Settings
                .Where(s => s.AdminId == adminId)
                .FirstOrDefaultAsync();

            if (settings == null)
            {
                // Create default settings if none exist
                settings = new Settings
                {
                    AdminId = adminId,
                    Currency = "AED",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Settings.Add(settings);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Default settings created for admin: {AdminId}", adminId);
            }

            return MapToResponse(settings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving settings for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while retrieving settings", ex);
        }
    }

    public async Task<SettingsResponse> UpdateSettingsAsync(Guid adminId, UpdateSettingsRequest request)
    {
        try
        {
            var settings = await _context.Settings
                .Where(s => s.AdminId == adminId)
                .FirstOrDefaultAsync();

            if (settings == null)
            {
                throw new InvalidOperationException("Settings not found for this admin");
            }

            // Update settings
            settings.MadrasaName = request.MadrasaName;
            settings.Address = request.Address;
            settings.Phone = request.Phone;
            settings.Currency = request.Currency;
            settings.FinancialYearStart = request.FinancialYearStart;
            settings.UpdatedAt = DateTime.UtcNow;

            _context.Settings.Update(settings);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Settings updated for admin: {AdminId}", adminId);

            return MapToResponse(settings);
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating settings for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while updating settings", ex);
        }
    }

    public async Task<string> UploadLogoAsync(Guid adminId, Stream fileStream, string fileName)
    {
        try
        {
            if (fileStream == null || fileStream.Length == 0)
                throw new ArgumentException("File stream is empty");

            // Validate file
            if (!IsValidImageFile(fileName))
                throw new ArgumentException("Invalid file type. Only PNG, JPG, and GIF are allowed");

            if (fileStream.Length > 5 * 1024 * 1024) // 5MB limit
                throw new ArgumentException("File size exceeds maximum limit of 5MB");

            // Create upload directory if it doesn't exist
            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), LogoUploadPath);
            if (!Directory.Exists(uploadDir))
                Directory.CreateDirectory(uploadDir);

            // Generate unique filename
            var uniqueFileName = $"{adminId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Path.GetFileName(fileName)}";
            var filePath = Path.Combine(uploadDir, uniqueFileName);

            // Save file
            using (var fileWrite = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(fileWrite);
            }

            // Update settings with logo path
            var settings = await _context.Settings
                .Where(s => s.AdminId == adminId)
                .FirstOrDefaultAsync();

            if (settings != null)
            {
                // Delete old logo if it exists
                if (!string.IsNullOrEmpty(settings.LogoPath))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), settings.LogoPath);
                    if (File.Exists(oldPath))
                        File.Delete(oldPath);
                }

                settings.LogoPath = Path.Combine(LogoUploadPath, uniqueFileName);
                settings.UpdatedAt = DateTime.UtcNow;

                _context.Settings.Update(settings);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Logo uploaded for admin: {AdminId}", adminId);
            }

            return Path.Combine(LogoUploadPath, uniqueFileName);
        }
        catch (ArgumentException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading logo for admin: {AdminId}", adminId);
            throw new Exception("An error occurred while uploading logo", ex);
        }
    }

    private bool IsValidImageFile(string fileName)
    {
        var validExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif" };
        var fileExtension = Path.GetExtension(fileName).ToLower();
        return validExtensions.Contains(fileExtension);
    }

    private SettingsResponse MapToResponse(Settings settings)
    {
        return new SettingsResponse
        {
            Id = settings.Id,
            MadrasaName = settings.MadrasaName ?? string.Empty,
            Address = settings.Address ?? string.Empty,
            Phone = settings.Phone ?? string.Empty,
            Currency = settings.Currency,
            FinancialYearStart = settings.FinancialYearStart,
            LogoPath = settings.LogoPath,
            CreatedAt = settings.CreatedAt,
            UpdatedAt = settings.UpdatedAt
        };
    }
}
