# Phase 3 — Database Implementation

This is Phase 3 of the Madrasa Accounting Software.

The project foundation is already complete.

Now implement ONLY the database layer.

Do NOT implement the Flutter UI yet.
Do NOT implement all business features yet.

## Database

Use PostgreSQL with Entity Framework Core.

Create only the necessary tables.

### Required Tables

1. Admin
- Id
- Username/Email
- PasswordHash
- CreatedAt
- UpdatedAt

2. IncomeCategories
- Id
- Name
- IsActive
- CreatedAt

3. ExpenseCategories
- Id
- Name
- IsActive
- CreatedAt

4. Transactions
- Id
- TransactionDate
- Type
- Description
- Amount
- PaymentMethod
- CategoryId
- CreatedAt
- UpdatedAt

5. TransactionEntries
Create this only if required by the accounting architecture designed in Phase 1.

6. Settings
- Id
- MadrasaName
- Logo
- Address
- Phone
- Currency
- FinancialYear
- UpdatedAt

7. AuditLogs
- Id
- Action
- Description
- RelatedTransactionId
- CreatedAt

## Important
Financial amounts MUST use decimal/numeric.
Never use float/double.

Create:
- Primary keys
- Foreign keys
- Indexes
- Constraints
- Required fields

Create EF Core migrations.

Seed default categories:

Income:
- Student Fees
- Donations
- Zakat
- Sadaqah
- Sponsorship
- Building Fund
- Other Income

Expenses:
- Teacher Salary
- Electricity
- Water
- Food
- Maintenance
- Stationery
- Events
- Building Maintenance
- Miscellaneous

Run migrations.

Verify the database.

Test:
- Insert
- Update
- Delete
- Foreign keys
- Constraints

Do NOT proceed to authentication or UI.

At the end report:
- Database tables
- Relationships
- Migration name
- Seed data
- Indexes
- Constraints
- Tests performed

Then STOP.
