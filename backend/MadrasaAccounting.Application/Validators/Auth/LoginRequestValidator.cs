using FluentValidation;
using MadrasaAccounting.Application.DTOs.Auth;

namespace MadrasaAccounting.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.UsernameOrEmail)
            .NotEmpty().WithMessage("Username or email is required")
            .Length(1, 255).WithMessage("Username or email must be between 1 and 255 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .Length(8, 128).WithMessage("Password must be between 8 and 128 characters");
    }
}
