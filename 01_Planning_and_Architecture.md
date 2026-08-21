# Phase 1 — Planning and Architecture

You are a Senior Software Architect, Flutter Developer, ASP.NET Core Developer, PostgreSQL Database Architect, UI/UX Designer, and Cybersecurity Engineer.

We are going to build a simple Accounting Software specifically for a Madrasa.

IMPORTANT: This is ONLY Phase 1.

Do NOT start implementing the complete application yet.

Your task in this phase is to analyze the requirements and create the complete technical architecture.

## Project Goal

The software will be used by ONE Madrasa and ONE Admin user.

It should allow the Admin to:
- Record income
- Record expenses
- View day book
- View ledger
- View monthly reports
- View yearly reports
- View simple balance sheet
- Manage Madrasa settings
- View audit logs

The application must be simple and easy to use.

It must NOT become a complex ERP.

## Technology
Frontend: Flutter, Dart, Material 3, BLoC/Cubit, Clean Architecture
Backend: ASP.NET Core Web API, Entity Framework Core
Database: PostgreSQL
Authentication: Single Admin account

## Your Tasks

Before writing implementation code, create:

### 1. Overall Architecture
Define:
Flutter App → ASP.NET Core API → PostgreSQL

Explain how each layer communicates.

### 2. Flutter Architecture
Design the Clean Architecture folder structure, including core, features, data, domain, presentation, bloc, repositories, services, routing, theme, and network.

### 3. Backend Architecture
Define Controllers, Services, Repositories, DTOs, Entities, Validators, Middleware, Authentication, Database, and Logging.

### 4. Database Architecture
Identify the minimum required tables. Potential entities:
- Admin
- IncomeCategories
- ExpenseCategories
- Transactions
- TransactionEntries
- Settings
- AuditLogs

Explain relationships.

### 5. Accounting Logic
Define how Income, Expense, Balance, Ledger, Monthly Report, Yearly Report, and Balance Sheet will be calculated.

Do NOT allow manually editable calculated balances.

Money must use decimal/numeric types.

### 6. Security Architecture
Define password hashing, authentication, token handling, HTTPS, rate limiting, input validation, database security, environment variables, audit logging, error handling, and backup strategy.

### 7. API Structure
Define the API endpoints that will eventually be required. Do not implement them yet.

### 8. Deployment Architecture
Plan:
Flutter → HTTPS → ASP.NET Core API → PostgreSQL

Recommended:
Backend → Render
Database → Supabase PostgreSQL

### 9. Project Development Order
Create a recommended implementation order for all remaining phases.

## Important
Do NOT generate the full application.
Do NOT create all screens.
Do NOT create all APIs.
Do NOT create unnecessary features.

Only complete the architecture and planning for Phase 1.

At the end provide:
- Architecture summary
- Folder structure
- Database entity plan
- API plan
- Security plan
- Deployment plan
- Recommended next phase

Then STOP and wait for my approval.
