# Phase 6 — Income Module

Implement ONLY the Income module.

## Income Categories
Use:
- Student Fees
- Donations
- Zakat
- Sadaqah
- Sponsorship
- Building Fund
- Other Income

## Income Form
Fields:
- Date
- Category
- Description
- Amount
- Payment Method

Payment methods:
- Cash
- Bank

## Features
Implement:
- Add Income
- View Income
- Edit Income
- Delete Income
- Search
- Date filtering

## Backend
Implement:
- Entity/model
- DTOs
- Validation
- Repository
- Service
- Controller
- API endpoints

## Validation
Amount:
- Required
- Greater than zero
- Decimal

Date:
- Required

Category:
- Required
- Must exist

Payment method:
- Required

Never trust Flutter validation.
Repeat validation on the backend.

## Accounting
When an income is created, make sure the transaction is recorded correctly according to the accounting architecture.

Use database transactions.

If saving fails:
ROLLBACK

No partial financial records.

## Audit
Record:
- Created
- Updated
- Deleted

## Flutter
Implement:
- Income list
- Add income
- Edit income
- Delete confirmation
- Search
- Date filter
- Loading state
- Empty state
- Error state

Keep the UI simple.

Test the complete flow.

Then STOP.
