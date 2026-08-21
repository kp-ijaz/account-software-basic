# MADRASA ACCOUNTING SOFTWARE - COMPLETE ARCHITECTURE PLAN

**Project**: Madrasa Accounting Software
**Version**: 1.0
**Date**: 2026-08-20
**Status**: Phase 1 - Architecture Planning

---

## TABLE OF CONTENTS

1. [Overall Architecture](#1-overall-architecture)
2. [Flutter Architecture](#2-flutter-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Architecture](#4-database-architecture)
5. [Accounting Logic](#5-accounting-logic)
6. [Security Architecture](#6-security-architecture)
7. [API Structure](#7-api-structure)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Development Timeline](#9-development-timeline)

---

## 1. OVERALL ARCHITECTURE

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────┐
│         FLUTTER APPLICATION             │
│  (Desktop / Android / Web)              │
│  • Material 3 UI                        │
│  • BLoC State Management                │
│  • Clean Architecture                   │
└─────────────────────────────────────────┘
              ↓ HTTPS ↓
┌─────────────────────────────────────────┐
│    ASP.NET CORE WEB API                 │
│  • REST API                             │
│  • JWT Authentication                   │
│  • Clean Architecture                   │
│  • Dependency Injection                 │
│  • Rate Limiting & Security             │
└─────────────────────────────────────────┘
              ↓ TCP ↓
┌─────────────────────────────────────────┐
│      POSTGRESQL DATABASE                │
│  • Financial Data (decimal types)       │
│  • Transaction Ledger                   │
│  • Audit Logs                           │
│  • Automatic Backups                    │
└─────────────────────────────────────────┘
```

### 1.2 Communication Flow

- **Flutter → API**: HTTPS REST API calls with JWT authentication
- **API → Database**: Entity Framework Core with secure connection
- **Database → API**: SQL queries, stored procedures for financial calculations
- **API → Flutter**: JSON responses with consistent error handling

### 1.3 Key Principles

- **Single Admin Account**: Only one user, no user management
- **Single Organization**: One Madrasa, no multi-company
- **Simple Interface**: Minimal features, maximum clarity
- **Financial Accuracy**: Decimal types, transactions, audit logs
- **Security First**: HTTPS, JWT, password hashing, rate limiting
- **No Direct DB Access**: Flutter never connects directly to PostgreSQL

---

## 2. FLUTTER ARCHITECTURE

### 2.1 Project Structure

```
madrasa_accounting_app/
├── lib/
│   ├── core/                          # Core utilities, constants, extensions
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   ├── api_constants.dart
│   │   │   └── enum_constants.dart
│   │   ├── extensions/
│   │   │   ├── string_extensions.dart
│   │   │   ├── date_extensions.dart
│   │   │   └── number_extensions.dart
│   │   ├── theme/
│   │   │   ├── app_theme.dart
│   │   │   └── app_colors.dart
│   │   ├── utils/
│   │   │   ├── logger.dart
│   │   │   ├── validators.dart
│   │   │   └── date_helper.dart
│   │   └── di/                       # Dependency Injection
│   │       └── service_locator.dart
│   │
│   ├── config/
│   │   ├── routes/
│   │   │   └── app_router.dart       # GoRouter configuration
│   │   ├── environment/
│   │   │   ├── environment.dart
│   │   │   ├── dev_environment.dart
│   │   │   ├── staging_environment.dart
│   │   │   └── prod_environment.dart
│   │   └── network/
│   │       ├── dio_client.dart
│   │       ├── api_interceptors.dart
│   │       └── network_config.dart
│   │
│   ├── data/                         # Data layer
│   │   ├── datasources/
│   │   │   ├── remote/
│   │   │   │   ├── auth_remote_datasource.dart
│   │   │   │   ├── income_remote_datasource.dart
│   │   │   │   ├── expense_remote_datasource.dart
│   │   │   │   ├── settings_remote_datasource.dart
│   │   │   │   ├── daybook_remote_datasource.dart
│   │   │   │   ├── ledger_remote_datasource.dart
│   │   │   │   ├── report_remote_datasource.dart
│   │   │   │   └── audit_remote_datasource.dart
│   │   │   └── local/
│   │   │       └── secure_storage_datasource.dart
│   │   ├── models/
│   │   │   ├── auth_models.dart
│   │   │   ├── income_models.dart
│   │   │   ├── expense_models.dart
│   │   │   ├── transaction_models.dart
│   │   │   ├── settings_models.dart
│   │   │   ├── report_models.dart
│   │   │   └── audit_models.dart
│   │   └── repositories/
│   │       ├── auth_repository_impl.dart
│   │       ├── income_repository_impl.dart
│   │       ├── expense_repository_impl.dart
│   │       ├── settings_repository_impl.dart
│   │       ├── daybook_repository_impl.dart
│   │       ├── ledger_repository_impl.dart
│   │       ├── report_repository_impl.dart
│   │       └── audit_repository_impl.dart
│   │
│   ├── domain/                       # Domain layer (business logic)
│   │   ├── entities/
│   │   │   ├── auth_entity.dart
│   │   │   ├── income_entity.dart
│   │   │   ├── expense_entity.dart
│   │   │   ├── transaction_entity.dart
│   │   │   ├── settings_entity.dart
│   │   │   ├── report_entity.dart
│   │   │   └── audit_entity.dart
│   │   ├── repositories/
│   │   │   ├── auth_repository.dart
│   │   │   ├── income_repository.dart
│   │   │   ├── expense_repository.dart
│   │   │   ├── settings_repository.dart
│   │   │   ├── daybook_repository.dart
│   │   │   ├── ledger_repository.dart
│   │   │   ├── report_repository.dart
│   │   │   └── audit_repository.dart
│   │   └── usecases/
│   │       ├── auth/
│   │       │   ├── login_usecase.dart
│   │       │   ├── logout_usecase.dart
│   │       │   └── change_password_usecase.dart
│   │       ├── income/
│   │       │   ├── create_income_usecase.dart
│   │       │   ├── get_income_list_usecase.dart
│   │       │   ├── update_income_usecase.dart
│   │       │   ├── delete_income_usecase.dart
│   │       │   └── search_income_usecase.dart
│   │       ├── expense/
│   │       │   ├── create_expense_usecase.dart
│   │       │   ├── get_expense_list_usecase.dart
│   │       │   ├── update_expense_usecase.dart
│   │       │   ├── delete_expense_usecase.dart
│   │       │   └── search_expense_usecase.dart
│   │       ├── settings/
│   │       │   ├── get_settings_usecase.dart
│   │       │   └── update_settings_usecase.dart
│   │       ├── daybook/
│   │       │   └── get_daybook_usecase.dart
│   │       ├── ledger/
│   │       │   └── get_ledger_usecase.dart
│   │       ├── reports/
│   │       │   ├── get_monthly_report_usecase.dart
│   │       │   ├── get_yearly_report_usecase.dart
│   │       │   └── get_balance_sheet_usecase.dart
│   │       └── audit/
│   │           └── get_audit_logs_usecase.dart
│   │
│   ├── presentation/                 # Presentation layer
│   │   ├── pages/
│   │   │   ├── splash_page.dart
│   │   │   ├── login_page.dart
│   │   │   ├── dashboard_page.dart
│   │   │   ├── income_page.dart
│   │   │   ├── expense_page.dart
│   │   │   ├── daybook_page.dart
│   │   │   ├── ledger_page.dart
│   │   │   ├── reports_page.dart
│   │   │   ├── settings_page.dart
│   │   │   ├── audit_log_page.dart
│   │   │   └── error_page.dart
│   │   ├── widgets/
│   │   │   ├── common/
│   │   │   │   ├── app_drawer.dart
│   │   │   │   ├── app_bar_widget.dart
│   │   │   │   ├── loading_widget.dart
│   │   │   │   ├── error_widget.dart
│   │   │   │   └── empty_widget.dart
│   │   │   ├── forms/
│   │   │   │   ├── income_form_widget.dart
│   │   │   │   └── expense_form_widget.dart
│   │   │   └── charts/
│   │   │       └── income_expense_chart.dart
│   │   └── bloc/                     # BLoC state management
│   │       ├── auth/
│   │       │   ├── auth_bloc.dart
│   │       │   ├── auth_event.dart
│   │       │   └── auth_state.dart
│   │       ├── income/
│   │       │   ├── income_bloc.dart
│   │       │   ├── income_event.dart
│   │       │   └── income_state.dart
│   │       ├── expense/
│   │       │   ├── expense_bloc.dart
│   │       │   ├── expense_event.dart
│   │       │   └── expense_state.dart
│   │       ├── dashboard/
│   │       │   ├── dashboard_bloc.dart
│   │       │   ├── dashboard_event.dart
│   │       │   └── dashboard_state.dart
│   │       ├── daybook/
│   │       │   ├── daybook_bloc.dart
│   │       │   ├── daybook_event.dart
│   │       │   └── daybook_state.dart
│   │       ├── ledger/
│   │       │   ├── ledger_bloc.dart
│   │       │   ├── ledger_event.dart
│   │       │   └── ledger_state.dart
│   │       ├── settings/
│   │       │   ├── settings_bloc.dart
│   │       │   ├── settings_event.dart
│   │       │   └── settings_state.dart
│   │       ├── reports/
│   │       │   ├── reports_bloc.dart
│   │       │   ├── reports_event.dart
│   │       │   └── reports_state.dart
│   │       └── audit/
│   │           ├── audit_bloc.dart
│   │           ├── audit_event.dart
│   │           └── audit_state.dart
│   │
│   └── main.dart                     # Application entry point
│
├── test/                             # Unit and widget tests
├── pubspec.yaml                      # Dependencies
└── README.md
```

### 2.2 Key Dependencies

```yaml
# State Management & BLoC
flutter_bloc: ^9.0.0
bloc: ^8.0.0

# Navigation
go_router: ^10.0.0

# Networking
dio: ^5.0.0
retrofit: ^4.0.0

# Data Serialization
json_serializable: ^6.0.0
json_annotation: ^4.0.0

# Secure Storage
flutter_secure_storage: ^9.0.0

# Dependency Injection
get_it: ^7.0.0

# PDF Generation
pdf: ^3.8.0
printing: ^5.10.0

# UI
cupertino_icons: ^1.0.0
intl: ^0.18.0

# Environment Configuration
envied: ^0.3.0

# Logging
logger: ^1.3.0
```

### 2.3 State Management Strategy

- Use **BLoC** for all major features
- Each feature has its own BLoC (Auth, Income, Expense, Dashboard, etc.)
- **Events** represent user actions
- **States** represent UI states (Loading, Success, Error, Empty)
- Use **GetIt** for dependency injection
- Proper disposal of streams and controllers

---

## 3. BACKEND ARCHITECTURE

### 3.1 Project Structure

```
MadrasaAccounting.API/
├── MadrasaAccounting.API/          # Main API project
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── IncomeController.cs
│   │   ├── ExpenseController.cs
│   │   ├── DayBookController.cs
│   │   ├── LedgerController.cs
│   │   ├── ReportsController.cs
│   │   ├── SettingsController.cs
│   │   └── AuditLogController.cs
│   ├── Middleware/
│   │   ├── AuthenticationMiddleware.cs
│   │   ├── ErrorHandlingMiddleware.cs
│   │   └── RateLimitingMiddleware.cs
│   ├── Startup/
│   │   ├── Program.cs
│   │   └── Startup.cs
│   └── appsettings.json
│
├── MadrasaAccounting.Application/  # Application layer
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── LoginRequest.cs
│   │   │   ├── LoginResponse.cs
│   │   │   ├── ChangePasswordRequest.cs
│   │   │   └── AuthTokenResponse.cs
│   │   ├── Income/
│   │   │   ├── CreateIncomeRequest.cs
│   │   │   ├── UpdateIncomeRequest.cs
│   │   │   ├── IncomeResponse.cs
│   │   │   └── IncomeListResponse.cs
│   │   ├── Expense/
│   │   │   ├── CreateExpenseRequest.cs
│   │   │   ├── UpdateExpenseRequest.cs
│   │   │   ├── ExpenseResponse.cs
│   │   │   └── ExpenseListResponse.cs
│   │   ├── Common/
│   │   │   ├── ApiResponse.cs
│   │   │   ├── PaginatedResponse.cs
│   │   │   └── ErrorResponse.cs
│   │   └── Reports/
│   │       ├── DayBookResponse.cs
│   │       ├── LedgerResponse.cs
│   │       ├── MonthlyReportResponse.cs
│   │       ├── YearlyReportResponse.cs
│   │       └── BalanceSheetResponse.cs
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   ├── IAuthService.cs
│   │   │   ├── IIncomeService.cs
│   │   │   ├── IExpenseService.cs
│   │   │   ├── IDayBookService.cs
│   │   │   ├── ILedgerService.cs
│   │   │   ├── IReportService.cs
│   │   │   ├── ISettingsService.cs
│   │   │   ├── IAuditLogService.cs
│   │   │   └── ITokenService.cs
│   │   └── Implementations/
│   │       ├── AuthService.cs
│   │       ├── IncomeService.cs
│   │       ├── ExpenseService.cs
│   │       ├── DayBookService.cs
│   │       ├── LedgerService.cs
│   │       ├── ReportService.cs
│   │       ├── SettingsService.cs
│   │       ├── AuditLogService.cs
│   │       └── TokenService.cs
│   ├── Validators/
│   │   ├── LoginRequestValidator.cs
│   │   ├── CreateIncomeValidator.cs
│   │   ├── UpdateIncomeValidator.cs
│   │   ├── CreateExpenseValidator.cs
│   │   ├── UpdateExpenseValidator.cs
│   │   └── ChangePasswordValidator.cs
│   └── Profiles/
│       └── MappingProfile.cs        # AutoMapper profiles
│
├── MadrasaAccounting.Domain/       # Domain layer
│   ├── Entities/
│   │   ├── Admin.cs
│   │   ├── IncomeCategory.cs
│   │   ├── ExpenseCategory.cs
│   │   ├── Income.cs
│   │   ├── Expense.cs
│   │   ├── Transaction.cs
│   │   ├── TransactionEntry.cs
│   │   ├── Settings.cs
│   │   └── AuditLog.cs
│   ├── Enums/
│   │   ├── PaymentMethod.cs
│   │   └── AuditActionType.cs
│   └── Interfaces/
│       └── IUnitOfWork.cs
│
├── MadrasaAccounting.Infrastructure/ # Infrastructure layer
│   ├── Data/
│   │   ├── Context/
│   │   │   └── MadrasaDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── AdminRepository.cs
│   │   │   ├── IncomeRepository.cs
│   │   │   ├── ExpenseRepository.cs
│   │   │   ├── SettingsRepository.cs
│   │   │   ├── AuditLogRepository.cs
│   │   │   └── GenericRepository.cs
│   │   ├── Migrations/
│   │   │   └── [Migration files]
│   │   └── Seed/
│   │       └── DataSeeder.cs
│   ├── Security/
│   │   ├── PasswordHasher.cs
│   │   ├── JwtTokenGenerator.cs
│   │   └── TokenValidation.cs
│   ├── Logging/
│   │   └── SerilogConfiguration.cs
│   └── CORS/
│       └── CorsConfiguration.cs
│
└── MadrasaAccounting.Tests/        # Unit tests
    ├── AuthServiceTests.cs
    ├── IncomeServiceTests.cs
    ├── ExpenseServiceTests.cs
    ├── ReportServiceTests.cs
    └── ValidationTests.cs
```

### 3.2 Key Technologies

- **Framework**: ASP.NET Core 8.0
- **Database ORM**: Entity Framework Core 8.0
- **Dependency Injection**: Built-in ASP.NET Core DI
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **AutoMapper**: For DTO mapping
- **Testing**: xUnit

### 3.3 Layered Architecture

```
┌─────────────────────────────────────┐
│      Controllers (API Endpoints)    │  ← HTTP Requests
├─────────────────────────────────────┤
│     Services (Business Logic)       │  ← Core Logic
├─────────────────────────────────────┤
│     Repositories (Data Access)      │  ← Data Operations
├─────────────────────────────────────┤
│     Domain Entities                 │  ← Models
├─────────────────────────────────────┤
│     PostgreSQL Database             │  ← Persistence
└─────────────────────────────────────┘
```

---

## 4. DATABASE ARCHITECTURE

### 4.1 Entity Relationship Diagram

```
┌──────────────────┐
│      Admin       │
├──────────────────┤
│ id (PK)          │
│ username         │
│ email            │
│ password_hash    │
│ created_at       │
│ updated_at       │
└──────────────────┘
       ↓ 1
       │
       ├──────────────────────────────────────┐
       │                                      │
       ↓ N                                    ↓ N
┌──────────────────┐    ┌────────────────────────────┐
│ Income           │    │ Expense                    │
├──────────────────┤    ├────────────────────────────┤
│ id (PK)          │    │ id (PK)                    │
│ admin_id (FK)    │    │ admin_id (FK)              │
│ category_id (FK) │    │ category_id (FK)           │
│ amount (decimal) │    │ amount (decimal)           │
│ date             │    │ date                       │
│ description      │    │ description                │
│ payment_method   │    │ payment_method             │
│ created_at       │    │ created_at                 │
│ updated_at       │    │ updated_at                 │
└──────────────────┘    └────────────────────────────┘
       ↓ N                       ↓ N
       │                         │
       ↓                         ↓
┌──────────────────────┐  ┌────────────────────────┐
│  IncomeCategory      │  │  ExpenseCategory       │
├──────────────────────┤  ├────────────────────────┤
│ id (PK)              │  │ id (PK)                │
│ admin_id (FK)        │  │ admin_id (FK)          │
│ name                 │  │ name                   │
│ is_default           │  │ is_default             │
│ created_at           │  │ created_at             │
└──────────────────────┘  └────────────────────────┘

┌─────────────────────┐
│     Settings        │
├─────────────────────┤
│ id (PK)             │
│ admin_id (FK)       │
│ madrasa_name        │
│ address             │
│ phone               │
│ currency            │
│ financial_year_start│
│ logo_path           │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌──────────────────────┐
│     AuditLog         │
├──────────────────────┤
│ id (PK)              │
│ admin_id (FK)        │
│ action_type          │
│ description          │
│ transaction_id (FK)  │
│ old_values           │
│ new_values           │
│ timestamp            │
└──────────────────────┘
```

### 4.2 Core Tables

#### Admin Table
- **Purpose**: Single admin account
- **Fields**:
  - `id` (UUID, PK)
  - `username` (VARCHAR, UNIQUE, NOT NULL)
  - `email` (VARCHAR, UNIQUE, NOT NULL)
  - `password_hash` (VARCHAR, NOT NULL)
  - `is_active` (BOOLEAN, DEFAULT true)
  - `last_login` (TIMESTAMP)
  - `created_at` (TIMESTAMP, DEFAULT NOW())
  - `updated_at` (TIMESTAMP, DEFAULT NOW())

#### Income Table
- **Purpose**: Record all income transactions
- **Fields**:
  - `id` (UUID, PK)
  - `admin_id` (UUID, FK)
  - `income_category_id` (UUID, FK)
  - `amount` (DECIMAL(18,2), NOT NULL)
  - `date` (DATE, NOT NULL)
  - `description` (TEXT)
  - `payment_method` (ENUM: Cash, Bank)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- **Indexes**: (admin_id, date), (admin_id, income_category_id)

#### Expense Table
- **Purpose**: Record all expense transactions
- **Fields**:
  - `id` (UUID, PK)
  - `admin_id` (UUID, FK)
  - `expense_category_id` (UUID, FK)
  - `amount` (DECIMAL(18,2), NOT NULL)
  - `date` (DATE, NOT NULL)
  - `description` (TEXT)
  - `payment_method` (ENUM: Cash, Bank)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- **Indexes**: (admin_id, date), (admin_id, expense_category_id)

#### IncomeCategory Table
- **Purpose**: Categories for income
- **Default Categories**:
  - Student Fees
  - Donations
  - Zakat
  - Sadaqah
  - Sponsorship
  - Building Fund
  - Other Income

#### ExpenseCategory Table
- **Purpose**: Categories for expenses
- **Default Categories**:
  - Teacher Salary
  - Electricity
  - Water
  - Food
  - Maintenance
  - Stationery
  - Events
  - Building Maintenance
  - Miscellaneous

#### Settings Table
- **Purpose**: Madrasa configuration
- **Fields**:
  - `id` (UUID, PK)
  - `admin_id` (UUID, FK, UNIQUE)
  - `madrasa_name` (VARCHAR)
  - `address` (TEXT)
  - `phone` (VARCHAR)
  - `currency` (VARCHAR, DEFAULT 'AED')
  - `financial_year_start` (DATE)
  - `logo_path` (VARCHAR, NULL)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

#### AuditLog Table
- **Purpose**: Track all important actions
- **Fields**:
  - `id` (UUID, PK)
  - `admin_id` (UUID, FK)
  - `action_type` (VARCHAR) - Login, Logout, IncomeCreated, IncomeUpdated, IncomeDeleted, ExpenseCreated, ExpenseUpdated, ExpenseDeleted, SettingsUpdated, PasswordChanged
  - `description` (TEXT)
  - `transaction_id` (UUID, FK, NULL)
  - `old_values` (JSONB, NULL)
  - `new_values` (JSONB, NULL)
  - `timestamp` (TIMESTAMP)
  - `ip_address` (VARCHAR, NULL)
- **Indexes**: (admin_id, timestamp), (action_type, timestamp)

### 4.3 Data Integrity Constraints

- **Primary Keys**: All tables have UUID primary keys
- **Foreign Keys**: Enforce referential integrity
- **NOT NULL**: All required fields have NOT NULL constraint
- **Check Constraints**: 
  - Income amount > 0
  - Expense amount > 0
- **UNIQUE Constraints**:
  - Admin.username
  - Admin.email
  - Settings.admin_id
- **Triggers**: Automatic `updated_at` timestamp updates

### 4.4 Indexes for Performance

```sql
-- Admin indexes
CREATE INDEX idx_admin_username ON Admin(username);
CREATE INDEX idx_admin_email ON Admin(email);

-- Income indexes
CREATE INDEX idx_income_admin_date ON Income(admin_id, date);
CREATE INDEX idx_income_category ON Income(income_category_id);

-- Expense indexes
CREATE INDEX idx_expense_admin_date ON Expense(admin_id, date);
CREATE INDEX idx_expense_category ON Expense(expense_category_id);

-- AuditLog indexes
CREATE INDEX idx_audit_admin_timestamp ON AuditLog(admin_id, timestamp);
CREATE INDEX idx_audit_action_type ON AuditLog(action_type);
```

---

## 5. ACCOUNTING LOGIC

### 5.1 Core Calculations

#### Balance Calculation
```
Current Balance = Opening Balance + Total Income - Total Expenses
```

**Rules**:
- Opening balance starts at 0
- All calculations happen on the backend
- Never manually editable balances
- Always use DECIMAL type
- Always use database transactions

#### Daily Balance
```
Daily Balance = Previous Day Balance + Today's Income - Today's Expenses
```

#### Monthly Balance
```
Monthly Balance = Sum of all daily balances in the month
```

#### Yearly Balance
```
Yearly Balance = Sum of all monthly balances in the year
```

### 5.2 Transaction Processing

All financial transactions follow this sequence:

```
1. Receive Request (Income/Expense)
2. Validate Input (Amount > 0, Required fields, Format)
3. BEGIN DATABASE TRANSACTION
4. Create Income/Expense Record
5. Calculate New Balance
6. Create AuditLog Entry
7. COMMIT TRANSACTION
8. Return Response

If any step fails:
- ROLLBACK TRANSACTION
- Log Error
- Return Error Response
```

### 5.3 Query Examples

#### Get Total Income for Period
```sql
SELECT COALESCE(SUM(amount), 0) as total_income
FROM Income
WHERE admin_id = @adminId 
AND date >= @startDate 
AND date <= @endDate;
```

#### Get Total Expenses for Period
```sql
SELECT COALESCE(SUM(amount), 0) as total_expenses
FROM Expense
WHERE admin_id = @adminId 
AND date >= @startDate 
AND date <= @endDate;
```

#### Get Running Balance (Ledger)
```sql
SELECT 
    date,
    description,
    income_amount,
    expense_amount,
    SUM(income_amount - expense_amount) OVER (ORDER BY date) as running_balance
FROM (
    SELECT date, description, amount as income_amount, 0 as expense_amount FROM Income
    UNION ALL
    SELECT date, description, 0 as income_amount, amount as expense_amount FROM Expense
) transactions
WHERE admin_id = @adminId
ORDER BY date;
```

### 5.4 No Manual Balance Edits

- Balances are **computed from transactions only**
- No balance edit endpoints
- No direct database balance updates
- If correction needed: delete original transaction and create new one (both logged)

---

## 6. SECURITY ARCHITECTURE

### 6.1 Authentication Flow

```
┌─────────────────┐
│  Flutter App    │
└────────┬────────┘
         │ 1. Login (username/email, password)
         ↓
┌──────────────────────────────────┐
│   ASP.NET Core API               │
│ 1. Validate Credentials          │
│ 2. Hash password and compare     │
│ 3. Generate JWT Token            │
│ 4. Log Login in AuditLog        │
└────────┬─────────────────────────┘
         │ 2. Return JWT Token
         ↓
┌─────────────────┐
│  Flutter App    │
│ Store Token in  │
│ Secure Storage  │
└────────┬────────┘
         │ 3. All API calls include JWT in header
         ↓
┌──────────────────────────────────┐
│   ASP.NET Core API               │
│ Verify JWT Signature             │
│ Check Token Expiration           │
│ Validate Claims                  │
└──────────────────────────────────┘
```

### 6.2 Password Security

- **Hashing**: Use ASP.NET Core Identity's default (PBKDF2 with 10,000 iterations)
- **Strength Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 digit
  - At least 1 special character
- **Never store plaintext passwords**
- **No password hints or recovery** (single admin account)

### 6.3 JWT Configuration

- **Algorithm**: HS256 (HMAC-SHA256)
- **Expiration**: 24 hours for access token
- **Refresh**: Yes, implement refresh token for extended sessions
- **Secret**: Minimum 32 characters, stored in environment variables
- **Claims**:
  - `sub` (subject): admin_id
  - `email`: admin email
  - `iat` (issued at): timestamp
  - `exp` (expiration): timestamp

### 6.4 HTTPS and Transport Security

- **Production**: HTTPS only (TLS 1.3 or higher)
- **Development**: HTTP allowed for local testing
- **Certificate**: Use Render's automatic HTTPS or self-signed for dev

### 6.5 Rate Limiting

```
Endpoints with Rate Limiting:
- Login: 5 attempts per minute per IP
- Password Change: 3 attempts per minute per IP
- All other endpoints: 100 requests per minute per user
```

### 6.6 Input Validation

**Server-side validation** for all inputs:
- Amount: Must be decimal > 0
- Date: Must be valid date
- Description: Max 500 characters, no script tags
- Categories: Must exist in database
- Payment Method: Must be Cash or Bank

### 6.7 SQL Injection Prevention

- Use **Entity Framework Core** parameterized queries
- Never concatenate SQL strings
- Use LINQ for all queries
- No raw SQL except in stored procedures (which are parameterized)

### 6.8 CORS Configuration

```
Allowed Origins (Production):
- https://your-flutter-app-domain.com

Allowed Methods:
- GET, POST, PUT, DELETE

Allowed Headers:
- Content-Type, Authorization

Credentials: Include
```

### 6.9 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### 6.10 Error Handling

**Never expose**:
- Stack traces
- SQL errors
- Database names
- File paths
- Internal server errors

**Example error response**:
```json
{
  "success": false,
  "message": "Unable to save the transaction. Please try again.",
  "errors": []
}
```

### 6.11 Logging Security

- Log all authentication events
- Log all financial transaction modifications
- **Never log**: passwords, tokens, sensitive data
- Use Serilog with structured logging
- Store logs securely, not in version control

### 6.12 Environment Variables

```
Required Environment Variables:
- DATABASE_URL or CONNECTION_STRING
- JWT_SECRET
- JWT_EXPIRATION_HOURS
- API_CORS_ORIGINS
- ENVIRONMENT (Development, Staging, Production)
- LOG_LEVEL
```

Never commit `.env` files to Git.

---

## 7. API STRUCTURE

### 7.1 API Base URL

- **Development**: `http://localhost:5000/api`
- **Staging**: `https://staging-api.madrasa.com/api`
- **Production**: `https://api.madrasa.com/api`

### 7.2 Authentication Endpoints

```
POST /auth/login
  Body: { username/email, password }
  Response: { accessToken, refreshToken, expiresIn }
  
POST /auth/logout
  Headers: Authorization: Bearer <token>
  Response: { success: true }
  
POST /auth/change-password
  Headers: Authorization: Bearer <token>
  Body: { currentPassword, newPassword, confirmPassword }
  Response: { success: true }
  
POST /auth/refresh-token
  Body: { refreshToken }
  Response: { accessToken, expiresIn }
```

### 7.3 Income Endpoints

```
POST /income
  Create new income
  Body: { categoryId, amount, date, description, paymentMethod }
  
GET /income?page=1&pageSize=10
  List income (paginated)
  
GET /income/{id}
  Get income details
  
PUT /income/{id}
  Update income
  Body: { categoryId, amount, date, description, paymentMethod }
  
DELETE /income/{id}
  Delete income
  
GET /income/search?q=value&category=&startDate=&endDate=
  Search income
```

### 7.4 Expense Endpoints

```
POST /expense
  Create new expense
  Body: { categoryId, amount, date, description, paymentMethod }
  
GET /expense?page=1&pageSize=10
  List expenses (paginated)
  
GET /expense/{id}
  Get expense details
  
PUT /expense/{id}
  Update expense
  Body: { categoryId, amount, date, description, paymentMethod }
  
DELETE /expense/{id}
  Delete expense
  
GET /expense/search?q=value&category=&startDate=&endDate=
  Search expenses
```

### 7.5 Day Book Endpoints

```
GET /daybook?page=1&pageSize=50
  Get all transactions chronologically
  Query: startDate, endDate, paymentMethod
  Response: Paginated list of transactions with running balance
```

### 7.6 Ledger Endpoints

```
GET /ledger?page=1&pageSize=50
  Get ledger with running balance
  Query: startDate, endDate, category, transactionType (income/expense)
  Response: Paginated ledger entries
```

### 7.7 Reports Endpoints

```
GET /reports/monthly/{year}/{month}
  Get monthly report
  
GET /reports/yearly/{year}
  Get yearly report
  
GET /reports/balance-sheet
  Get balance sheet
  
GET /reports/income-summary/{year}
  Get income summary
  
GET /reports/expense-summary/{year}
  Get expense summary
```

### 7.8 Settings Endpoints

```
GET /settings
  Get current settings
  
PUT /settings
  Update settings
  Body: { madrasaName, address, phone, currency, financialYearStart, logo }
  
POST /settings/logo
  Upload logo
  Body: Form data with image file
```

### 7.9 Categories Endpoints

```
GET /categories/income
  Get all income categories
  
GET /categories/expense
  Get all expense categories
```

### 7.10 Audit Log Endpoints

```
GET /audit-log?page=1&pageSize=50
  Get audit logs (paginated)
  Query: actionType, startDate, endDate
  
GET /audit-log/{id}
  Get specific audit log entry
```

### 7.11 Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully",
  "timestamp": "2026-08-20T10:30:00Z",
  "errors": []
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "message": "An error occurred",
  "timestamp": "2026-08-20T10:30:00Z",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1 Recommended Infrastructure

```
┌──────────────────────────────────────────────────────────┐
│                    Production Environment                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐                                    │
│  │  Flutter App     │ (Desktop / Android / Web)         │
│  │  (User Device)   │                                    │
│  └────────┬─────────┘                                    │
│           │ HTTPS                                       │
│           ↓                                              │
│  ┌──────────────────────────────────────────┐            │
│  │  Render.com                              │            │
│  │  ┌────────────────────────────────────┐  │            │
│  │  │  ASP.NET Core API                  │  │            │
│  │  │  • Auto-scaling                    │  │            │
│  │  │  • SSL/TLS Certificate             │  │            │
│  │  │  • Environment variables           │  │            │
│  │  │  • Logs & Monitoring               │  │            │
│  │  └────────────────────────────────────┘  │            │
│  └────────┬─────────────────────────────────┘            │
│           │ TCP                                          │
│           ↓                                              │
│  ┌──────────────────────────────────────────┐            │
│  │  Supabase PostgreSQL                     │            │
│  │  ┌────────────────────────────────────┐  │            │
│  │  │  PostgreSQL 15+                    │  │            │
│  │  │  • Automatic Daily Backups         │  │            │
│  │  │  • 30-day Retention                │  │            │
│  │  │  • Point-in-time Recovery          │  │            │
│  │  │  • Connection Pooling              │  │            │
│  │  │  • Monitoring & Alerts             │  │            │
│  │  └────────────────────────────────────┘  │            │
│  └──────────────────────────────────────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 8.2 Deployment Steps

#### Backend Deployment (Render)
1. Create Render account
2. Connect GitHub repository
3. Create new Web Service
4. Set environment variables:
   - `DATABASE_URL`: Supabase connection string
   - `JWT_SECRET`: Generate strong secret
   - `ENVIRONMENT`: Production
5. Deploy
6. Verify API health check
7. Configure custom domain

#### Database Deployment (Supabase)
1. Create Supabase project
2. Create PostgreSQL database
3. Configure connection pooling
4. Run migrations:
   ```bash
   dotnet ef database update --context MadrasaDbContext
   ```
5. Configure automatic backups
6. Create database user for application

#### Flutter Deployment
1. **Desktop** (Windows):
   ```bash
   flutter build windows --release
   ```
2. **Android**:
   ```bash
   flutter build apk --release
   ```
   or Google Play distribution
3. **Web**:
   ```bash
   flutter build web --release
   ```
   Deploy to Firebase Hosting or Vercel

### 8.3 Environment Variables

```bash
# .env.production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/madrasa
JWT_SECRET=<generate-strong-secret-min-32-chars>
JWT_EXPIRATION_HOURS=24
API_CORS_ORIGINS=https://your-domain.com
ENVIRONMENT=Production
LOG_LEVEL=Information
API_PORT=5000
ASPNETCORE_URLS=https://+:5000
```

### 8.4 Backup Strategy

**Automated**:
- Supabase automatic daily backups
- 30-day retention policy
- Point-in-time recovery available

**Manual**:
```bash
# Backup command
pg_dump postgresql://user:password@db.supabase.co:5432/madrasa > backup_$(date +%Y%m%d).sql

# Restore command
psql postgresql://user:password@db.supabase.co:5432/madrasa < backup_$(date +%Y%m%d).sql
```

**Off-site Storage**:
- Upload backups to Google Drive or AWS S3
- Automated backup script runs weekly
- Retention: Keep last 3 months of backups

### 8.5 Monitoring & Logging

- **Serilog** configured to output to:
  - Console (development)
  - File (development & production)
  - Seq or similar logging service (production)
- **Error Tracking**: Integrate with Sentry or similar
- **Performance Monitoring**: Application Insights

---

## 9. DEVELOPMENT TIMELINE

### Phase 1: Planning and Architecture ✓
- Completion: This document
- Duration: 1-2 hours
- Deliverable: Complete architecture plan

### Phase 2: Project Foundation
- Duration: 4-6 hours
- Tasks:
  - Create Flutter project with clean architecture
  - Create ASP.NET Core API project
  - Configure DI, logging, error handling
  - Set up database connection
  - Verify both builds successfully

### Phase 3: Database Implementation
- Duration: 4-6 hours
- Tasks:
  - Create PostgreSQL schema
  - Create EF Core entities
  - Create migrations
  - Seed default data
  - Verify database integrity

### Phase 4: Secure Admin Authentication
- Duration: 6-8 hours
- Tasks:
  - Implement password hashing
  - Implement JWT generation
  - Create login/logout endpoints
  - Create change password endpoint
  - Implement rate limiting
  - Complete authentication tests

### Phase 5: Settings Management
- Duration: 3-4 hours
- Tasks:
  - Create settings endpoints
  - Create Flutter UI
  - Implement save/load

### Phase 6: Income Module
- Duration: 6-8 hours
- Tasks:
  - Create CRUD endpoints
  - Create validators
  - Create Flutter BLoC & UI
  - Implement search/filter

### Phase 7: Expense Module
- Duration: 6-8 hours
- Tasks:
  - Mirror income module
  - Create CRUD endpoints
  - Create Flutter BLoC & UI

### Phase 8: Day Book and Ledger
- Duration: 8-10 hours
- Tasks:
  - Create complex queries
  - Implement pagination
  - Create Flutter UI
  - Test running balances

### Phase 9: Dashboard
- Duration: 6-8 hours
- Tasks:
  - Create summary endpoints
  - Implement charts
  - Create Flutter UI

### Phase 10: Reports and Balance Sheet
- Duration: 8-10 hours
- Tasks:
  - Create report endpoints
  - Implement PDF generation
  - Create Flutter report UI

### Phase 11: Audit Logging
- Duration: 4-6 hours
- Tasks:
  - Implement audit service
  - Log all actions
  - Create audit UI

### Phase 12: Security Review
- Duration: 4-6 hours
- Tasks:
  - Security audit
  - Penetration testing
  - Fix vulnerabilities

### Phase 13: Performance Review
- Duration: 4-6 hours
- Tasks:
  - Load testing
  - Query optimization
  - Add indexes

### Phase 14: Testing
- Duration: 8-10 hours
- Tasks:
  - Unit tests
  - Integration tests
  - UI tests

### Phase 15: UI/UX Review
- Duration: 4-6 hours
- Tasks:
  - User testing
  - UX improvements
  - Polish UI

### Phase 16: Production Deployment
- Duration: 4-6 hours
- Tasks:
  - Deploy to Render
  - Set up database
  - Configure domain
  - Test in production

### Phase 17: Final Review
- Duration: 2-3 hours
- Tasks:
  - Security checklist
  - Accounting validation
  - Performance check

### Phase 18: Documentation
- Duration: 3-4 hours
- Tasks:
  - Create README
  - Create API docs
  - Create deployment guide

**Total Estimated Duration**: 100-130 hours

---

## 10. KEY ARCHITECTURAL DECISIONS

### 10.1 Why This Architecture?

1. **Three-Tier Separation**
   - Clean separation of concerns
   - Easy to test each layer
   - Easy to modify one layer without affecting others

2. **BLoC for State Management**
   - Industry standard for Flutter
   - Reactive programming
   - Easy to test
   - Clear separation of UI and logic

3. **JWT Authentication**
   - Stateless authentication
   - Scalable
   - Standard industry practice
   - Easy to implement

4. **PostgreSQL with Decimal Types**
   - Guaranteed accuracy for financial data
   - ACID compliance
   - No floating-point errors
   - Industry standard for accounting

5. **Render + Supabase**
   - Simple deployment
   - Automatic scaling
   - Automatic backups
   - Cost-effective

### 10.2 Constraints and Assumptions

- **One Admin Account**: No user management complexity
- **Single Organization**: No multi-company features
- **PostgreSQL Only**: No database flexibility needed
- **Simple UI**: No complex animations or real-time features
- **Financial Accuracy**: All calculations validated

---

## APPROVAL CHECKLIST

Before proceeding to Phase 2, confirm:

- [ ] Architecture document reviewed
- [ ] Database design approved
- [ ] API structure validated
- [ ] Security approach accepted
- [ ] Deployment plan approved
- [ ] Technology stack confirmed
- [ ] Team capacity available for Phase 2

---

**Next Step**: Proceed to Phase 2 — Project Foundation
