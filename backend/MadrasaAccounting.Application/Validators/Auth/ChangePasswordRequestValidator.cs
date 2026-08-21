using FluentValidation;
using MadrasaAccounting.Application.DTOs.Auth;

namespace MadrasaAccounting.Application.Validators.Auth;

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required")
            .Length(8, 128).WithMessage("New password must be between 8 and 128 characters")
            .Must(ValidatePasswordStrength).WithMessage("Password must contain uppercase, lowercase, digit, and special character")
            .NotEqual(x => x.CurrentPassword).WithMessage("New password must be different from current password");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password is required")
            .Equal(x => x.NewPassword).WithMessage("Passwords do not match");
    }

    private bool ValidatePasswordStrength(string password)
    {
        if (string.IsNullOrEmpty(password))
            return false;

        bool hasUpperCase = password.Any(char.IsUpper);
        bool hasLowerCase = password.Any(char.IsLower);
        bool hasDigit = password.Any(char.IsDigit);
        bool hasSpecialChar = password.Any(c => !char.IsLetterOrDigit(c));

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    }
}
