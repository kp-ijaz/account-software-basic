using MadrasaAccounting.Application.DTOs.Settings;

namespace MadrasaAccounting.Application.Services;

public interface ISettingsService
{
    Task<SettingsResponse> GetSettingsAsync(Guid adminId);
    Task<SettingsResponse> UpdateSettingsAsync(Guid adminId, UpdateSettingsRequest request);
    Task<string> UploadLogoAsync(Guid adminId, Stream fileStream, string fileName);
}
