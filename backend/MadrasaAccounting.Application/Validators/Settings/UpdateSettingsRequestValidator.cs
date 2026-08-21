using FluentValidation;
using MadrasaAccounting.Application.DTOs.Settings;
using System.Text.RegularExpressions;

namespace MadrasaAccounting.Application.Validators.Settings;

public class UpdateSettingsRequestValidator : AbstractValidator<UpdateSettingsRequest>
{
    public UpdateSettingsRequestValidator()
    {
        RuleFor(x => x.MadrasaName)
            .NotEmpty().WithMessage("Madrasa name is required")
            .Length(2, 255).WithMessage("Madrasa name must be between 2 and 255 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\.]+$").WithMessage("Madrasa name contains invalid characters");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters")
            .Matches(@"^[\d\+\-\(\)\s]*$", RegexOptions.IgnoreCase).WithMessage("Phone number contains invalid characters");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required")
            .Length(3, 3).WithMessage("Currency code must be exactly 3 characters")
            .Matches(@"^[A-Z]{3}$").WithMessage("Currency must be a valid ISO 4217 code");

        RuleFor(x => x.FinancialYearStart)
            .Must(BeValidDate).WithMessage("Financial year start must be a valid date")
            .LessThan(DateTime.UtcNow).WithMessage("Financial year start cannot be in the future");
    }

    private bool BeValidDate(DateTime? date)
    {
        if (date == null)
            return true;

        return date.Value > DateTime.MinValue && date.Value < DateTime.MaxValue;
    }
}
