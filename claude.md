# MADRASA ACCOUNTING SOFTWARE

## Complete Phased Development Specification

You are a Senior Flutter Developer, Senior ASP.NET Core Developer, PostgreSQL Database Architect, UI/UX Designer, Cybersecurity Engineer, and QA Engineer.

Build a **simple, clean, secure, and reliable Accounting Management Software specifically for a Madrasa**.

This is NOT an ERP.

This is NOT a commercial accounting platform.

This is NOT a multi-user system.

It is a lightweight accounting application designed for **one Madrasa and one administrator**.

The primary goals are:

* Simplicity
* Security
* Accounting accuracy
* Data reliability
* Easy maintenance
* Good performance
* Clean UI
* Easy deployment
* Reliable backups

The software should be easy enough for a person with basic computer knowledge to use without accounting training.

---

# 1. TECHNOLOGY STACK

## Frontend

Use:

* Flutter
* Dart
* Material 3
* BLoC / Cubit
* Clean Architecture
* Dio for API communication
* GoRouter for navigation
* Flutter Secure Storage for authentication data
* PDF generation for reports

Target platforms:

* Windows/Desktop
* Android
* Web if practical

Desktop should be the primary target.

---

# 2. BACKEND

Use:

* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL
* REST API
* Dependency Injection
* FluentValidation
* Serilog
* Swagger/OpenAPI

Use a clean and maintainable backend architecture.

---

# 3. DATABASE

Use PostgreSQL.

The database is the source of truth for all financial information.

Never use floating-point types for money.

Use:

decimal / numeric

for financial amounts.

Use proper:

* Primary keys
* Foreign keys
* Unique constraints
* Indexes
* NOT NULL constraints
* Check constraints
* CreatedAt
* UpdatedAt

Use EF Core migrations.

---

# 4. SINGLE ADMIN ACCOUNT

There is ONLY ONE ADMIN USER.

Do NOT create:

* Staff accounts
* User roles
* Permission management
* Multiple users
* User registration
* User management
* Multi-company access

The application is exclusively for one administrator.

## Login

Provide:

* Username or Email
* Password

Features:

* Login
* Logout
* Change Password

Do not provide public registration.

The initial admin account should be created securely during initial setup.

Passwords must NEVER be stored as plain text.

Use a secure password hashing mechanism such as ASP.NET Core Identity's password hashing.

---

# 5. SECURITY REQUIREMENTS

Security is extremely important because this application contains financial information.

Implement:

* HTTPS in production
* Secure password hashing
* JWT authentication or another secure token-based authentication mechanism
* Token expiration
* Secure token storage
* Server-side validation
* Rate limiting
* CORS restrictions
* Security headers
* Global exception handling
* Secure logging
* SQL injection protection
* Request validation
* File upload validation if file uploads are implemented
* Database access restrictions

Never expose:

* Database password
* Database connection string
* JWT secret
* API keys
* Passwords
* Stack traces
* Internal server errors

Production secrets must be stored using environment variables.

Never commit:

.env

production credentials

secrets

API keys

to Git.

Flutter must NEVER connect directly to PostgreSQL.

Architecture:

Flutter App
↓
HTTPS
↓
ASP.NET Core API
↓
PostgreSQL

---

# 6. ACCOUNTING PRINCIPLES

The software must maintain accurate financial records.

Do not simply store a manually editable "balance".

Financial values must be derived from transactions.

Basic calculation:

Opening Balance
+
Total Income
------------

# Total Expenses

Current Balance

Use database transactions when modifying financial records.

For example:

BEGIN TRANSACTION

Create transaction

Create transaction entry

Create audit record

COMMIT

If any operation fails:

ROLLBACK

Never leave partial financial transactions in the database.

---

# 7. CORE FEATURES

The application should contain only these main modules:

1. Login
2. Dashboard
3. Income
4. Expenses
5. Day Book
6. Ledger
7. Reports
8. Balance Sheet
9. Settings
10. Audit Log

Do NOT add unnecessary ERP features.

No:

* Inventory
* Sales
* Purchases
* Customer management
* Supplier management
* Payroll
* HR
* CRM
* Multi-branch
* Multi-company

unless specifically requested later.

---

# 8. DASHBOARD

Create a very simple dashboard.

Show:

### Today's Income

### Today's Expenses

### Current Cash Balance

### Current Bank Balance

### This Month's Income

### This Month's Expenses

### Current Month Balance

Show:

* Recent Transactions
* Simple Income vs Expense chart

Keep the dashboard lightweight.

Do not load all transactions into Flutter.

Use optimized backend queries.

---

# 9. INCOME

Allow the Admin to record income.

Default categories:

* Student Fees
* Donations
* Zakat
* Sadaqah
* Sponsorship
* Building Fund
* Other Income

Fields:

* Date
* Category
* Description
* Amount
* Payment Method

Payment methods:

* Cash
* Bank

Features:

* Add
* View
* Edit
* Delete
* Search
* Date filter

Validation:

* Amount must be greater than zero
* Date required
* Category required
* Payment method required

---

# 10. EXPENSES

Allow the Admin to record expenses.

Default categories:

* Teacher Salary
* Electricity
* Water
* Food
* Maintenance
* Stationery
* Events
* Building Maintenance
* Miscellaneous

Fields:

* Date
* Category
* Description
* Amount
* Payment Method

Payment methods:

* Cash
* Bank

Features:

* Add
* View
* Edit
* Delete
* Search
* Date filter

---

# 11. DAY BOOK

Create a simple Day Book.

Show all financial transactions chronologically.

Columns:

* Date
* Description
* Category
* Income
* Expense
* Balance

Filters:

* Today
* This Week
* This Month
* Custom Date

Features:

* Search
* Pagination
* PDF
* Print

Use backend pagination.

Do NOT load thousands of records at once.

Example:

GET /api/daybook?page=1&pageSize=50

---

# 12. LEDGER

Create a simple Ledger.

Columns:

* Date
* Description
* Debit
* Credit
* Balance

Filters:

* Date
* Category
* Income
* Expense

The running balance must be calculated correctly.

Test:

Income only

Expense only

Income + Expense

Multiple transactions on the same day

Different months

Different financial years

---

# 13. MONTHLY REPORT

Create a simple Monthly Report.

Admin selects:

Month

Year

Display:

* Total Income
* Total Expenses
* Net Balance
* Income Summary
* Expense Summary
* Day Book
* Ledger

Allow:

* PDF
* Print

Report totals must match actual database transactions.

---

# 14. YEARLY REPORT

Create a Yearly Report.

Display:

| Month | Income | Expense | Balance |
| ----- | ------ | ------- | ------- |

January

February

March

April

May

June

July

August

September

October

November

December

At the bottom:

* Total Income
* Total Expenses
* Annual Balance

Allow:

* PDF
* Print

---

# 15. SIMPLE BALANCE SHEET

Create a simple Balance Sheet suitable for the Madrasa.

## Assets

* Cash
* Bank Balance

## Liabilities

* Pending Payments, if implemented

## Current Balance

Calculate automatically from actual financial records.

Do not allow the Admin to manually modify calculated balances.

---

# 16. SETTINGS

Settings should contain:

* Madrasa Name
* Logo
* Address
* Phone
* Currency
* Financial Year

Only one company/Madrasa exists.

Do not implement multi-company functionality.

---

# 17. AUDIT LOG

Because this is financial software, record important changes.

Track:

* Login
* Logout
* Income Created
* Income Updated
* Income Deleted
* Expense Created
* Expense Updated
* Expense Deleted
* Settings Updated
* Password Changed

Store:

* Action
* Description
* Date
* Time
* Related Transaction ID

The Admin should be able to view audit history.

Do not provide a normal UI option to delete audit logs.

---

# 18. UI / UX

The application must be extremely simple.

Use:

* Material 3
* White/light background
* Green accent color
* Clean cards
* Rounded corners
* Large readable text
* Clear buttons
* Simple tables
* Consistent spacing
* Minimal icons
* Minimal animations

Desktop layout:

Sidebar:

Dashboard

Income

Expenses

Day Book

Ledger

Reports

Settings

Logout

Do not overcrowd the sidebar.

---

# 19. INCOME / EXPENSE ENTRY UX

Adding a transaction should be extremely easy.

Example:

Click:

"+ Add Income"

Show a simple form:

Date

Category

Description

Amount

Payment Method

Save

After saving:

Show:

"Income added successfully."

Do not create complicated accounting forms for the user.

The accounting logic should happen automatically in the backend.

The Admin should only need to understand:

Income

Expense

Category

Amount

Date

Payment Method

---

# 20. SEARCH AND FILTERING

Implement:

* Search
* Date filtering
* Category filtering
* Income/Expense filtering

Filtering should happen on the backend where appropriate.

Use pagination.

Do not download the entire database to Flutter.

---

# 21. PERFORMANCE

The application must remain fast even after several years of transactions.

Implement:

* Database indexes
* Pagination
* Server-side filtering
* Server-side aggregation
* Efficient queries
* Lazy loading
* Debounced search
* Minimal API requests
* Proper BLoC state management

Flutter:

* Use const widgets
* Avoid unnecessary rebuilds
* Dispose controllers
* Dispose streams
* Avoid memory leaks
* Avoid unnecessary animations
* Avoid loading huge datasets

Backend:

* Use asynchronous operations
* Use efficient EF Core queries
* Use AsNoTracking() for read-only queries where appropriate
* Avoid N+1 queries
* Use projections for reports
* Add indexes to frequently queried columns

---

# 22. ERROR HANDLING

Create centralized error handling.

Backend should return consistent API responses.

Example:

{
"success": false,
"message": "Unable to save the transaction.",
"errors": []
}

Never expose technical errors to the Admin.

Do not show:

NullReferenceException

SQL errors

Stack traces

Internal server paths

Instead show:

"Unable to save the transaction. Please try again."

Log the technical error securely on the server.

---

# 23. DATABASE BACKUP

Accounting data must be protected.

The production database must have automatic backups.

Document:

* Backup frequency
* Backup retention
* Restore process
* Manual backup
* Disaster recovery

Never keep the only copy of accounting data on the local computer.

---

# 24. DEVELOPMENT PHASES

IMPORTANT:

Do NOT build the entire project at once.

Build one phase at a time.

After every phase:

1. Run the application.
2. Build the project.
3. Run tests.
4. Check database migrations.
5. Check APIs.
6. Check security.
7. Check UI.
8. Fix all errors.
9. Verify existing features still work.
10. Only then continue.

---

# PHASE 1 — REQUIREMENTS AND ARCHITECTURE

Do not build the UI yet.

Analyze the requirements.

Create:

* Final feature list
* Architecture
* Database ER diagram
* Database entities
* API structure
* Flutter folder structure
* Backend folder structure
* Security architecture
* Deployment architecture

Confirm that the architecture supports:

Flutter

↓

ASP.NET Core API

↓

PostgreSQL

Do not add unnecessary modules.

Deliver a written architecture plan before coding.

---

# PHASE 2 — PROJECT FOUNDATION

Create:

Flutter project

ASP.NET Core API

PostgreSQL connection

Configure:

* Clean Architecture
* BLoC
* Dependency Injection
* GoRouter
* Dio
* Logging
* Environment configuration
* Error handling

Create:

Development

Staging

Production

configurations.

Make sure both frontend and backend build successfully.

---

# PHASE 3 — DATABASE

Create PostgreSQL schema.

Implement:

* Users/Admin
* Income Categories
* Expense Categories
* Transactions
* Transaction Entries
* Settings
* Audit Logs

Create:

* EF Core models
* Relationships
* Constraints
* Indexes
* Migrations
* Seed data

Run migration successfully.

Verify database integrity.

---

# PHASE 4 — SECURE ADMIN LOGIN

Implement the single Admin account.

Implement:

* Login
* Logout
* Change Password
* Token expiration
* Secure token handling

Add:

* Rate limiting
* Authentication middleware
* Secure password hashing
* Authorization middleware

Test:

Correct password

Wrong password

Expired token

Missing token

Repeated login attempts

Unauthorized API requests

Do not proceed until authentication is secure and working.

---

# PHASE 5 — SETTINGS

Implement:

* Madrasa Name
* Logo
* Address
* Phone
* Currency
* Financial Year

Create backend API and Flutter UI.

Test saving and loading settings.

---

# PHASE 6 — INCOME

Implement:

* Database
* Models
* DTOs
* Validators
* API
* Repository
* Service
* BLoC
* UI

Features:

Create

Read

Update

Delete

Search

Filter

Test all validation.

Test financial transaction creation.

---

# PHASE 7 — EXPENSES

Implement the same structure as Income.

Features:

Create

Read

Update

Delete

Search

Filter

Test financial calculations.

---

# PHASE 8 — DAY BOOK AND LEDGER

Implement:

Day Book

Ledger

Running balances

Date filters

Search

Pagination

Test:

Income

Expense

Multiple transactions

Same-day transactions

Month changes

Year changes

---

# PHASE 9 — DASHBOARD

Implement:

Today's Income

Today's Expense

Cash Balance

Bank Balance

Monthly Income

Monthly Expense

Monthly Balance

Recent Transactions

Income vs Expense chart

Use optimized backend queries.

---

# PHASE 10 — REPORTS

Implement:

Monthly Report

Yearly Report

Balance Sheet

PDF generation

Printing

Verify report totals against database totals.

---

# PHASE 11 — AUDIT LOG

Implement audit logging.

Test:

Create

Update

Delete

Login

Logout

Password change

Settings change

Make sure audit logs cannot be deleted from the normal UI.

---

# PHASE 12 — SECURITY REVIEW

Perform a complete security review.

Check:

Authentication

Password hashing

Token security

API authorization

SQL injection

Input validation

CORS

Rate limiting

Error handling

Secrets

Database permissions

File uploads

HTTPS

Audit logs

Sensitive information exposure

Fix every discovered issue.

---

# PHASE 13 — PERFORMANCE REVIEW

Test with a large amount of sample transactions.

For example:

10,000+

transactions.

Check:

Dashboard speed

Day Book speed

Ledger speed

Search

Filtering

Reports

PDF generation

Database queries

Fix slow queries.

Add indexes where required.

Do not sacrifice correctness for performance.

---

# PHASE 14 — TESTING

Create:

Unit Tests

API Tests

Database Tests

Flutter Tests

Accounting Calculation Tests

Test:

Income

Expense

Balance

Ledger

Monthly Report

Yearly Report

Balance Sheet

Authentication

Validation

Database rollback

---

# PHASE 15 — UI/UX REVIEW

Test the software as a normal Madrasa administrator.

The user must be able to:

1. Login
2. Add income
3. Add expense
4. View transactions
5. View ledger
6. View monthly report
7. View yearly report
8. Export PDF

without technical assistance.

Simplify anything confusing.

---

# PHASE 16 — PRODUCTION DEPLOYMENT

Recommended infrastructure:

Frontend:

Flutter Desktop / Android / Web

Backend:

Render

Database:

Supabase PostgreSQL

Architecture:

Flutter

↓

HTTPS

↓

ASP.NET Core API on Render

↓

PostgreSQL on Supabase

Configure:

* Production environment variables
* HTTPS
* CORS
* Database connection
* JWT secrets
* Logging
* Health checks
* Database migrations
* Automatic backups

Never expose the database directly to Flutter.

---

# PHASE 17 — FINAL PRODUCTION CHECK

Before declaring the software complete, verify:

### Security

* No hardcoded secrets
* No plain-text passwords
* HTTPS enabled
* Secure authentication
* Expiring tokens
* Rate limiting
* Input validation
* Protected APIs

### Accounting

* Income totals correct
* Expense totals correct
* Balance correct
* Ledger correct
* Monthly reports correct
* Yearly reports correct
* Balance Sheet correct

### Database

* Migrations work
* Constraints work
* Indexes exist
* Backups configured
* Restore tested

### Performance

* No unnecessary API calls
* No memory leaks
* No large unnecessary queries
* Pagination working
* Reports optimized

### UI

* Simple
* Clean
* Responsive
* Easy to understand
* No unnecessary features

---

# PHASE 18 — DOCUMENTATION

Create:

README.md

Include:

* Project overview
* Architecture
* Flutter setup
* Backend setup
* PostgreSQL setup
* Environment variables
* Database migration
* Local development
* Production deployment
* Render deployment
* Supabase setup
* Backup procedure
* Restore procedure
* Security recommendations
* Troubleshooting

Also create:

API documentation

Database documentation

Deployment documentation

Admin user guide

---

# CLAUDE DEVELOPMENT RULES

Follow these rules throughout the entire project.

1. Never generate fake implementations.

2. Never leave TODO placeholders for core functionality.

3. Never skip validation.

4. Never skip error handling.

5. Never expose secrets.

6. Never store money as float/double.

7. Never connect Flutter directly to PostgreSQL.

8. Never trust client-side validation.

9. Never calculate critical accounting data only on the client.

10. Never delete financial data without proper audit handling.

11. Use database transactions for financial operations.

12. Use pagination for large datasets.

13. Keep the UI simple.

14. Do not add unnecessary features.

15. Do not change architecture halfway through the project.

16. Do not rewrite working modules without a reason.

17. Before modifying an existing feature, understand its current implementation.

18. After every change, run relevant tests.

19. Before moving to the next phase, verify that all previous phases still work.

20. If you find an architectural or security problem, stop and fix it before continuing.

---

# PHASE COMPLETION REPORT

At the end of EVERY phase, provide:

## Completed

List what was implemented.

## Files Created

List files.

## Files Modified

List files.

## Database Changes

List migrations/schema changes.

## API Endpoints

List new endpoints.

## Tests

List tests performed.

## Security Checks

List security checks performed.

## Problems Found

List problems.

## Problems Fixed

List fixes.

## Remaining Work

List what remains.

## Verification

Confirm:

* Flutter builds
* Backend builds
* Database migration succeeds
* Tests pass
* Existing features work

Then STOP.

Wait for approval before starting the next phase.

---

# FINAL OBJECTIVE

The final product should be a:

Simple

Clean

Fast

Secure

Reliable

Madrasa-specific

Accounting Application.

The Admin should be able to open the software and immediately understand what to do.

The application should primarily provide:

Dashboard

Income

Expenses

Day Book

Ledger

Monthly Reports

Yearly Reports

Balance Sheet

Settings

Audit Log

Do not turn this into a complex accounting ERP.

Keep the user experience extremely simple while keeping the backend, database, security, and accounting calculations professional and reliable.
