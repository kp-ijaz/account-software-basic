using MadrasaAccounting.Application.DTOs.Auth;

namespace MadrasaAccounting.Application.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(Guid adminId);
    Task ChangePasswordAsync(Guid adminId, ChangePasswordRequest request);
}
