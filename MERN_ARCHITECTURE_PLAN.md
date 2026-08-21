# MERN Stack Architecture - Madrasa Accounting Software

## Complete Technical Specification

---

## 1. TECHNOLOGY STACK

### Frontend
- **Framework:** React 18.x
- **UI Library:** Material-UI (MUI) v5 + shadcn/ui components
- **State Management:** Redux Toolkit + Redux Persist
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (accounting dashboards)
- **PDF Generation:** jsPDF + html2canvas
- **Authentication:** JWT stored in secure httpOnly cookies
- **Desktop:** Electron (wrap React app)
- **Desktop Store:** electron-store

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.x
- **Database Driver:** pg (node-postgres)
- **ORM:** Prisma (type-safe database queries)
- **Validation:** Zod + express validator
- **Authentication:** jsonwebtoken (JWT)
- **Middleware:** 
  - cors
  - helmet (security headers)
  - express-rate-limit
  - morgan (logging)
- **Logging:** winston
- **Email:** nodemailer (audit logs if needed)
- **Environment:** dotenv
- **Testing:** Jest + Supertest

### Database
- **Type:** PostgreSQL 14+
- **Connection Pool:** pg-pool
- **Migrations:** Prisma migrations
- **Backups:** pg_dump automated

### DevOps & Deployment
- **Version Control:** Git
- **Backend Deployment:** Render.com OR Railway
- **Frontend Deployment:** Vercel OR Netlify
- **Database Hosting:** Supabase OR Render Postgres
- **CI/CD:** GitHub Actions
- **Docker:** Containerization for both services

---

## 2. FOLDER STRUCTURE

### Frontend (React + TypeScript)
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── IncomeChart.tsx
│   │   │   ├── ExpenseChart.tsx
│   │   │   └── RecentTransactions.tsx
│   │   ├── income/
│   │   │   ├── IncomeForm.tsx
│   │   │   ├── IncomeList.tsx
│   │   │   └── IncomeTable.tsx
│   │   ├── expense/
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   └── ExpenseTable.tsx
│   │   ├── daybook/
│   │   │   ├── DayBookTable.tsx
│   │   │   └── DayBookFilters.tsx
│   │   ├── ledger/
│   │   │   ├── LedgerTable.tsx
│   │   │   └── LedgerFilters.tsx
│   │   ├── reports/
│   │   │   ├── MonthlyReport.tsx
│   │   │   ├── YearlyReport.tsx
│   │   │   ├── BalanceSheet.tsx
│   │   │   └── ReportPDF.tsx
│   │   ├── settings/
│   │   │   ├── MadrasaSettings.tsx
│   │   │   ├── LogoUpload.tsx
│   │   │   └── FinancialYearSettings.tsx
│   │   └── audit/
│   │       ├── AuditLog.tsx
│   │       └── AuditFilters.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── IncomePage.tsx
│   │   ├── ExpensePage.tsx
│   │   ├── DayBookPage.tsx
│   │   ├── LedgerPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── AuditPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── incomeSlice.ts
│   │   │   ├── expenseSlice.ts
│   │   │   ├── settingsSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── incomeService.ts
│   │   ├── expenseService.ts
│   │   ├── reportService.ts
│   │   ├── auditService.ts
│   │   └── settingsService.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useIncome.ts
│   │   ├── useExpense.ts
│   │   ├── usePagination.ts
│   │   └── useApi.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── transaction.ts
│   │   ├── reports.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── dates.ts
│   │   └── currency.ts
│   ├── styles/
│   │   ├── theme.ts
│   │   └── global.css
│   ├── App.tsx
│   └── index.tsx
├── electron/
│   ├── main.ts
│   ├── preload.ts
│   └── ipc.ts
├── .env.example
├── .env.local
├── tsconfig.json
├── package.json
└── README.md
```

### Backend (Node.js + Express + Prisma)
```
backend/
├── src/
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   └── cors.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── incomeController.ts
│   │   ├── expenseController.ts
│   │   ├── dayBookController.ts
│   │   ├── ledgerController.ts
│   │   ├── reportController.ts
│   │   ├── auditController.ts
│   │   └── settingsController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── incomeService.ts
│   │   ├── expenseService.ts
│   │   ├── reportService.ts
│   │   ├── auditService.ts
│   │   ├── settingsService.ts
│   │   └── transactionService.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── income.ts
│   │   ├── expense.ts
│   │   ├── daybook.ts
│   │   ├── ledger.ts
│   │   ├── reports.ts
│   │   ├── audit.ts
│   │   ├── settings.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── transaction.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errorHandler.ts
│   │   ├── validators.ts
│   │   ├── jwt.ts
│   │   └── crypto.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── constants.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env.example
├── .env.production
├── tsconfig.json
├── package.json
├── Dockerfile
└── README.md
```

---

## 3. DATABASE SCHEMA (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Admin User
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

// Settings
model Settings {
  id                String    @id @default(cuid())
  madrasaName       String
  logo              String?   // URL or base64
  address           String?
  phone             String?
  currency          String    @default("USD")
  financialYearStart Int     @default(1)  // 1-12
  openingBalance    Decimal   @db.Decimal(15, 2)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// Income Categories
model IncomeCategory {
  id            String    @id @default(cuid())
  name          String    @unique
  description   String?
  isDefault     Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([name])
}

// Expense Categories
model ExpenseCategory {
  id            String    @id @default(cuid())
  name          String    @unique
  description   String?
  isDefault     Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([name])
}

// Transactions (Income & Expense)
model Transaction {
  id                String      @id @default(cuid())
  type              TransactionType  // INCOME or EXPENSE
  date              DateTime
  description       String
  amount            Decimal     @db.Decimal(15, 2)
  paymentMethod     PaymentMethod
  reference         String?     // Check number, receipt number
  
  incomeCategoryId  String?
  incomeCategory    IncomeCategory?   @relation(fields: [incomeCategoryId], references: [id])
  
  expenseCategoryId String?
  expenseCategory   ExpenseCategory?  @relation(fields: [expenseCategoryId], references: [id])
  
  notes             String?
  attachments       String[]    // File URLs if any
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  auditLogs         AuditLog[]
  
  @@index([date])
  @@index([type])
  @@index([incomeCategoryId])
  @@index([expenseCategoryId])
}

// Audit Log
model AuditLog {
  id            String    @id @default(cuid())
  action        AuditAction
  description   String
  userId        String?
  tableName     String?
  recordId      String?
  
  oldValues     Json?
  newValues     Json?
  
  transactionId String?
  transaction   Transaction? @relation(fields: [transactionId], references: [id], onDelete: SetNull)
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime  @default(now())
  
  @@index([action])
  @@index([createdAt])
  @@index([userId])
}

// Enums
enum TransactionType {
  INCOME
  EXPENSE
}

enum PaymentMethod {
  CASH
  BANK
}

enum AuditAction {
  LOGIN
  LOGOUT
  PASSWORD_CHANGED
  INCOME_CREATED
  INCOME_UPDATED
  INCOME_DELETED
  EXPENSE_CREATED
  EXPENSE_UPDATED
  EXPENSE_DELETED
  SETTINGS_UPDATED
  AUDIT_LOG_VIEWED
}
```

---

## 4. API STRUCTURE (Express Routes)

### Authentication
```
POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout
POST   /api/auth/refresh        - Refresh token
POST   /api/auth/change-password - Change password
```

### Income
```
GET    /api/income              - List income (paginated)
GET    /api/income/:id          - Get single income
POST   /api/income              - Create income
PUT    /api/income/:id          - Update income
DELETE /api/income/:id          - Delete income
GET    /api/income-categories   - Get income categories
```

### Expense
```
GET    /api/expense             - List expense (paginated)
GET    /api/expense/:id         - Get single expense
POST   /api/expense             - Create expense
PUT    /api/expense/:id         - Update expense
DELETE /api/expense/:id         - Delete expense
GET    /api/expense-categories  - Get expense categories
```

### Day Book
```
GET    /api/daybook             - Day book entries (paginated)
GET    /api/daybook/export      - Export to PDF
```

### Ledger
```
GET    /api/ledger              - Ledger entries (paginated)
GET    /api/ledger/balance      - Current balance
GET    /api/ledger/export       - Export to PDF
```

### Reports
```
GET    /api/reports/monthly     - Monthly report
GET    /api/reports/yearly      - Yearly report
GET    /api/reports/balance-sheet - Balance sheet
GET    /api/reports/summary     - Financial summary
```

### Settings
```
GET    /api/settings            - Get settings
PUT    /api/settings            - Update settings
POST   /api/settings/logo       - Upload logo
```

### Audit
```
GET    /api/audit               - Audit logs (paginated)
GET    /api/audit/export        - Export audit logs
```

### Health
```
GET    /api/health              - Health check
GET    /api/version             - Version info
```

---

## 5. SECURITY ARCHITECTURE

### Frontend Security
- ✅ JWT stored in httpOnly, Secure, SameSite cookies
- ✅ CSRF protection
- ✅ Input validation (Zod)
- ✅ XSS prevention (React escapes by default)
- ✅ Helmet for security headers
- ✅ Rate limiting on sensitive endpoints

### Backend Security
- ✅ JWT validation on all protected routes
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ CORS properly configured
- ✅ Rate limiting (express-rate-limit)
- ✅ Request validation (Zod)
- ✅ Helmet security headers
- ✅ Morgan logging
- ✅ Error handling (no stack traces in production)
- ✅ HTTPS enforced

### Database Security
- ✅ Parameterized queries (Prisma)
- ✅ Encryption at rest (PostgreSQL)
- ✅ Connection pooling
- ✅ Regular backups
- ✅ Audit logging

---

## 6. AUTHENTICATION FLOW

```
User
  ↓
React Login Component
  ↓ (POST /api/auth/login)
Express Controller
  ↓
Hash Password Check (bcrypt)
  ↓ (Success)
JWT Token Generated
  ↓ (httpOnly Cookie)
React Receives JWT
  ↓
Redux Store Updated
  ↓
Protected Routes Check Token
  ↓ (Expired)
Refresh Endpoint Called
  ↓ (New Token)
Continue
```

---

## 7. DATA FLOW EXAMPLE (Add Income)

```
React Form
  ↓ (Input: category, amount, date, description)
Form Validation (Zod)
  ↓ (Valid)
POST /api/income
  ↓
Express Controller
  ↓
Service Layer (Business Logic)
  ↓
Prisma ORM
  ↓
PostgreSQL Transaction
  BEGIN
    INSERT Transaction (INCOME)
    INSERT AuditLog
  COMMIT
  ↓
Response with ID
  ↓
React Redux Update
  ↓
UI Refresh (Table, Dashboard)
```

---

## 8. STATE MANAGEMENT (Redux)

### Auth Slice
```typescript
{
  isAuthenticated: boolean
  user: { email: string, username: string } | null
  token: string | null
  loading: boolean
  error: string | null
}
```

### Income Slice
```typescript
{
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}
```

### Expense Slice
```typescript
{
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}
```

### UI Slice
```typescript
{
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
}
```

---

## 9. DEPLOYMENT ARCHITECTURE

### Development
```
localhost:3000 (React)  ←→  localhost:5000 (Express)
                             ↓
                         PostgreSQL (Local)
```

### Production
```
Vercel/Netlify (React)  ←→  Render (Express)
                             ↓
                         Supabase PostgreSQL
                             ↓
                         Daily Backups (AWS S3)
```

---

## 10. ENVIRONMENT VARIABLES

### Backend (.env)
```
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://user:pass@localhost:5432/madrasa_accounting
DATABASE_POOL_SIZE=10

JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h

CORS_ORIGIN=http://localhost:3000

LOG_LEVEL=debug

BCRYPT_ROUNDS=12

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Madrasa Accounting
REACT_APP_VERSION=1.0.0
```

---

## 11. TESTING STRATEGY

### Backend Tests
- Unit tests (Services, Utils)
- Integration tests (Controllers, Routes)
- Database tests (Transactions)
- Security tests (Auth, Validation)

### Frontend Tests
- Component tests (React Testing Library)
- Hook tests
- Redux store tests
- Integration tests

---

## 12. DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Backups scheduled
- [ ] Monitoring set up
- [ ] Error tracking (Sentry) optional
- [ ] Performance monitoring (optional)

---

## 13. PROJECT TIMELINE

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Architecture & Setup | 1 day |
| 2 | Backend Foundation | 2-3 days |
| 3 | Database & Prisma | 1-2 days |
| 4 | Authentication | 1-2 days |
| 5 | Frontend Setup & Layout | 1-2 days |
| 6 | Income Module | 2 days |
| 7 | Expense Module | 1 day |
| 8 | Day Book & Ledger | 2 days |
| 9 | Dashboard | 1-2 days |
| 10 | Reports & PDF | 2-3 days |
| 11 | Settings | 1 day |
| 12 | Audit Log | 1 day |
| 13 | Security Review | 1-2 days |
| 14 | Testing | 2-3 days |
| 15 | UI/UX Polish | 1-2 days |
| 16 | Deployment | 1-2 days |

**Total: 21-31 days**

---

## 14. TECH CHOICES RATIONALE

| Choice | Why |
|--------|-----|
| **React 18** | Modern, component-based, large ecosystem |
| **Material-UI** | Professional, accessible, theming support |
| **Redux Toolkit** | Simpler Redux, best practices built-in |
| **Prisma** | Type-safe, auto-migrations, excellent DX |
| **Express** | Lightweight, flexible, industry standard |
| **TypeScript** | Type safety, better IDE support, catches bugs early |
| **Zod** | Runtime validation, type inference |
| **Electron** | Desktop cross-platform support |
| **PostgreSQL** | Reliability, ACID compliance, perfect for accounting |

---

## NEXT STEPS

1. ✅ **Phase 1 Complete:** Architecture finalized
2. **Phase 2 Starting:** Backend & Frontend project setup
3. Follow the 16-phase plan to completion

**Approval needed before proceeding to Phase 2.**

---

**Ready to start Phase 2: Project Foundation & Setup?** ✅
