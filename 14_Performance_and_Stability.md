# Phase 14 — Performance and Stability Testing

Perform a complete performance and stability review.

Do NOT add unnecessary features.

Test the application with a large dataset.

Use at least:
10,000+ transactions

Test:
- Dashboard
- Day Book
- Ledger
- Search
- Filters
- Monthly Reports
- Yearly Reports
- Balance Sheet
- PDF generation

Check for:
- Slow queries
- N+1 queries
- Memory leaks
- Excessive API requests
- Unnecessary Flutter rebuilds
- Large database responses
- UI freezing

Implement:
- Pagination
- Database indexes
- Efficient queries
- Server-side aggregation
- Debounced search
- Lazy loading

Use `AsNoTracking()` for suitable read-only EF Core queries.

Fix all performance issues.

Then STOP.
