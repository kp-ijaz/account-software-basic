using FluentValidation;
using MadrasaAccounting.Application.DTOs.Expense;

namespace MadrasaAccounting.Application.Validators.Expense;

public class UpdateExpenseValidator : AbstractValidator<UpdateExpenseRequest>
{
    public UpdateExpenseValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Category is required");

        RuleFor(x => x.Amount)
            .NotEmpty()
            .WithMessage("Amount is required")
            .GreaterThan(0)
            .WithMessage("Amount must be greater than zero")
            .PrecisionScale(18, 2, ignoreTrailingZeros: true)
            .WithMessage("Amount must have maximum 2 decimal places");

        RuleFor(x => x.Date)
            .NotEmpty()
            .WithMessage("Date is required")
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Date cannot be in the future");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty()
            .WithMessage("Payment method is required")
            .Must(x => x == "Cash" || x == "Bank")
            .WithMessage("Payment method must be 'Cash' or 'Bank'");
    }
}
