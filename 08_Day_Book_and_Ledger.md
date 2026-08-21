# Phase 8 — Day Book and Ledger

Implement ONLY:
1. Day Book
2. Ledger

Do not implement dashboard or reports yet.

# Day Book

Display:
- Date
- Description
- Category
- Income
- Expense
- Balance

Filters:
- Today
- This Week
- This Month
- Custom Date

Search.
Pagination.

## Important
Do not load all transactions into Flutter.

Use server-side:
- Filtering
- Pagination
- Sorting
- Balance calculation where appropriate

Example:
GET /api/daybook?page=1&pageSize=50

# Ledger

Display:
- Date
- Description
- Debit
- Credit
- Balance

Filters:
- Date
- Category
- Income
- Expense

Implement correct running balance.

Test:
- Income only
- Expense only
- Income + expense
- Multiple same-day transactions
- Different months
- Different years
- Empty results

Verify totals against the database.

Then STOP.
