# Phase 10 — Reports and Balance Sheet

Implement the reporting system.

## Monthly Report
Admin selects:
- Month
- Year

Display:
- Total Income
- Total Expenses
- Balance
- Income Summary
- Expense Summary
- Day Book
- Ledger

## Yearly Report
Display:

| Month | Income | Expense | Balance |

Then:
- Total Income
- Total Expenses
- Annual Balance

## Balance Sheet

Display:

### Assets
- Cash
- Bank Balance

### Liabilities
- Pending Payments if implemented

### Current Balance

All calculations must come from the database.

Do not allow manual editing of calculated totals.

## Validation
Report totals must match:
Income transactions
minus
Expense transactions

Test:
- Empty month
- One transaction
- Multiple transactions
- Full year
- Different payment methods

Then STOP.
