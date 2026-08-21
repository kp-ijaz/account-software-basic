using FluentValidation;
using MadrasaAccounting.Application.DTOs.Income;

namespace MadrasaAccounting.Application.Validators.Income;

public class UpdateIncomeValidator : AbstractValidator<UpdateIncomeRequest>
{
    public UpdateIncomeValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.Amount)
            .NotEmpty().WithMessage("Amount is required")
            .GreaterThan(0).WithMessage("Amount must be greater than zero");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Date cannot be in the future");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Payment method is required")
            .Must(IsValidPaymentMethod).WithMessage("Payment method must be 'Cash' or 'Bank'");
    }

    private bool IsValidPaymentMethod(string? method)
    {
        return method switch
        {
            "Cash" or "Bank" => true,
            _ => false
        };
    }
}
