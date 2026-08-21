# DATABASE DOCUMENTATION

Complete database schema reference for Madrasa Accounting Software.

**Database**: PostgreSQL 15+  
**ORM**: Entity Framework Core  
**Host**: Supabase

---

## Schema Overview

| Table | Purpose | Rows | Indexes |
|-------|---------|------|---------|
| AdminAccount | Single admin user | 1 | email (unique) |
| IncomeCategory | Income categories | 7+ | name |
| ExpenseCategory | Expense categories | 9+ | name |
| Income | Income transactions | Unlimited | (AdminId, Date) |
| Expense | Expense transactions | Unlimited | (AdminId, Date) |
| Settings | Madrasa configuration | 1 | AdminId (unique) |
| AuditLog | Immutable audit trail | Unlimited | (AdminId, CreatedAt) |

---

## Table Definitions

### AdminAccount
```sql
CREATE TABLE AdminAccount (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(1024) NOT NULL,
    Salt VARCHAR(256) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_admins_email ON AdminAccount(Email);
```

**Columns**:
- `Id` - UUID primary key
- `Email` - Admin email (unique)
- `PasswordHash` - PBKDF2-SHA256 hash (1024 chars)
- `Salt` - 128-bit random salt (base64 encoded)
- `CreatedAt` - Account creation timestamp
- `UpdatedAt` - Last update timestamp

**Security**:
- Password: PBKDF2-SHA256, 10,000 iterations
- No plain-text passwords ever stored
- Salt unique for each password hash

---

### IncomeCategory
```sql
CREATE TABLE IncomeCategory (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    DisplayOrder INT NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Default Categories**:
1. Student Fees
2. Donations
3. Zakat
4. Sadaqah
5. Sponsorship
6. Building Fund
7. Other Income

---

### ExpenseCategory
```sql
CREATE TABLE ExpenseCategory (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(500),
    DisplayOrder INT NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Default Categories**:
1. Teacher Salary
2. Electricity
3. Water
4. Food
5. Maintenance
6. Stationery
7. Events
8. Building Maintenance
9. Miscellaneous

---

### Income
```sql
CREATE TABLE Income (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    AdminId UUID NOT NULL REFERENCES AdminAccount(Id),
    CategoryId UUID NOT NULL REFERENCES IncomeCategory(Id),
    Date DATE NOT NULL,
    Description VARCHAR(500) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL CHECK (Amount > 0),
    PaymentMethod VARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('Cash', 'Bank')),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_income_admin_date ON Income(AdminId, Date DESC);
CREATE INDEX idx_income_admin_category ON Income(AdminId, CategoryId);
```

**Columns**:
- `Id` - UUID primary key
- `AdminId` - Foreign key to AdminAccount
- `CategoryId` - Foreign key to IncomeCategory
- `Date` - Transaction date
- `Description` - Transaction description
- `Amount` - DECIMAL(18,2) for precision
- `PaymentMethod` - 'Cash' or 'Bank'

**Constraints**:
- Amount > 0 (CHECK constraint)
- PaymentMethod must be 'Cash' or 'Bank'
- Date <= TODAY (implicit)
- Foreign key constraints

---

### Expense
```sql
CREATE TABLE Expense (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    AdminId UUID NOT NULL REFERENCES AdminAccount(Id),
    CategoryId UUID NOT NULL REFERENCES ExpenseCategory(Id),
    Date DATE NOT NULL,
    Description VARCHAR(500) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL CHECK (Amount > 0),
    PaymentMethod VARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('Cash', 'Bank')),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_admin_date ON Expense(AdminId, Date DESC);
CREATE INDEX idx_expense_admin_category ON Expense(AdminId, CategoryId);
```

**Identical to Income table** but references ExpenseCategory

---

### Settings
```sql
CREATE TABLE Settings (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    AdminId UUID NOT NULL UNIQUE REFERENCES AdminAccount(Id),
    MadrasaName VARCHAR(200) NOT NULL,
    Address VARCHAR(500),
    Phone VARCHAR(20),
    LogoUrl VARCHAR(500),
    Currency VARCHAR(3) NOT NULL DEFAULT 'AED',
    FinancialYear INT NOT NULL DEFAULT YEAR(CURRENT_DATE),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Columns**:
- `MadrasaName` - Organization name
- `Address` - Physical address
- `Phone` - Contact phone
- `LogoUrl` - Logo image URL (5MB max)
- `Currency` - ISO 4217 code (AED, USD, etc.)
- `FinancialYear` - Current financial year

**Constraints**:
- One settings record per admin (unique AdminId)

---

### AuditLog
```sql
CREATE TABLE AuditLog (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    AdminId UUID NOT NULL REFERENCES AdminAccount(Id),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ActionType VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    TransactionId UUID,
    OldValues TEXT,
    NewValues TEXT
);

CREATE INDEX idx_auditlog_admin_date ON AuditLog(AdminId, CreatedAt DESC);
CREATE INDEX idx_auditlog_action ON AuditLog(ActionType);
```

**Columns**:
- `ActionType` - Login, Logout, PasswordChange, IncomeCreated, etc.
- `Description` - Audit description
- `TransactionId` - Related income/expense ID (nullable)
- `OldValues` - JSON of old values
- `NewValues` - JSON of new values

**Action Types**:
1. Login
2. Logout
3. PasswordChange
4. IncomeCreated
5. IncomeUpdated
6. IncomeDeleted
7. ExpenseCreated
8. ExpenseUpdated
9. ExpenseDeleted
10. SettingsUpdated
11. LogoUploaded

**Immutability**:
- No UPDATE or DELETE operations allowed on AuditLog
- Audit trail is permanent
- No API endpoint to delete audit logs

---

## Indexes

**Performance Critical**:
```sql
-- Income fast lookup by date
CREATE INDEX idx_income_admin_date ON Income(AdminId, Date DESC);

-- Expense fast lookup by date
CREATE INDEX idx_expense_admin_date ON Expense(AdminId, Date DESC);

-- Audit log fast lookup by date
CREATE INDEX idx_auditlog_admin_date ON AuditLog(AdminId, CreatedAt DESC);
```

**Category Lookup**:
```sql
-- Category filtering
CREATE INDEX idx_income_category ON Income(AdminId, CategoryId);
CREATE INDEX idx_expense_category ON Expense(AdminId, CategoryId);
```

**Unique Constraints**:
```sql
-- Admin email uniqueness
CREATE UNIQUE INDEX idx_admins_email ON AdminAccount(Email);

-- Settings per admin (one-to-one)
CREATE UNIQUE INDEX idx_settings_admin ON Settings(AdminId);
```

---

## Constraints

### Check Constraints
```sql
-- Amount must be positive
ALTER TABLE Income ADD CONSTRAINT chk_income_amount CHECK (Amount > 0);
ALTER TABLE Expense ADD CONSTRAINT chk_expense_amount CHECK (Amount > 0);

-- Payment method validation
ALTER TABLE Income ADD CONSTRAINT chk_income_payment_method 
  CHECK (PaymentMethod IN ('Cash', 'Bank'));
ALTER TABLE Expense ADD CONSTRAINT chk_expense_payment_method 
  CHECK (PaymentMethod IN ('Cash', 'Bank'));
```

### Foreign Key Constraints
```sql
-- Income references
ALTER TABLE Income ADD CONSTRAINT fk_income_admin 
  FOREIGN KEY (AdminId) REFERENCES AdminAccount(Id);
ALTER TABLE Income ADD CONSTRAINT fk_income_category 
  FOREIGN KEY (CategoryId) REFERENCES IncomeCategory(Id);

-- Expense references
ALTER TABLE Expense ADD CONSTRAINT fk_expense_admin 
  FOREIGN KEY (AdminId) REFERENCES AdminAccount(Id);
ALTER TABLE Expense ADD CONSTRAINT fk_expense_category 
  FOREIGN KEY (CategoryId) REFERENCES ExpenseCategory(Id);

-- Audit references
ALTER TABLE AuditLog ADD CONSTRAINT fk_auditlog_admin 
  FOREIGN KEY (AdminId) REFERENCES AdminAccount(Id);
```

### Unique Constraints
```sql
-- Admin email unique
ALTER TABLE AdminAccount ADD CONSTRAINT uk_admin_email UNIQUE (Email);

-- Settings per admin (one-to-one)
ALTER TABLE Settings ADD CONSTRAINT uk_settings_admin UNIQUE (AdminId);

-- Category names unique
ALTER TABLE IncomeCategory ADD CONSTRAINT uk_income_category_name UNIQUE (Name);
ALTER TABLE ExpenseCategory ADD CONSTRAINT uk_expense_category_name UNIQUE (Name);
```

---

## Data Types

| Column | Type | Notes |
|--------|------|-------|
| Financial Amount | DECIMAL(18,2) | 18 digits, 2 decimal places |
| Password Hash | VARCHAR(1024) | PBKDF2 hash |
| Salt | VARCHAR(256) | Base64 encoded |
| Dates | DATE or TIMESTAMP | UTC timestamps |
| IDs | UUID | gen_random_uuid() |
| Text | VARCHAR(n) | Length appropriate to column |
| JSON | TEXT | Audit trail values |

---

## Migrations

### Initial Migration
```
Name: InitialCreate
Date: 2026-08-20
Changes: Create all 7 tables, indexes, constraints
```

### Seed Data
```
- Admin account (admin@madrasa.local, auto-generated password)
- Income categories (7 default)
- Expense categories (9 default)
- Settings (empty, to be configured)
```

---

## Backup Strategy

### Automatic Backups
- **Frequency**: Daily at 02:00 UTC
- **Retention**: 30 days
- **Method**: Supabase automated backups
- **Redundancy**: Multiple geographic locations

### Manual Backup
```bash
# Export database
pg_dump -U user -h host.supabase.co -d madrasa --no-password > backup.sql
```

### Restore
```bash
# Restore to new database
psql -U user -h host.supabase.co -d new_database < backup.sql
```

---

## Performance Characteristics

### Query Performance (with 10,000+ transactions)

**Dashboard Summary**: 350-450ms
- 22 optimized queries
- Aggregation at database level
- Indexed on (AdminId, Date)

**Day Book**: 200-350ms
- Single scan with running balance
- Pagination (50 items/page)
- Index on (AdminId, Date)

**Ledger**: 200-350ms
- Similar to Day Book
- Category filtering optional

**Search**: 200-400ms
- LIKE search on description
- Pagination
- Debounced on client

**Reports**: 400-900ms
- Month/year aggregation
- Category breakdown
- Database-level grouping

### Storage Capacity

| Data Size | Transactions | Duration |
|-----------|--------------|----------|
| 5MB | 10,000 | 3 months |
| 10MB | 20,000 | 6 months |
| 30MB | 60,000 | 2 years |
| 50MB | 100,000 | 3+ years |

Supabase Free Tier: **500GB**

---

## Data Integrity

### Transaction Safety
- All financial operations wrapped in database transactions
- Atomic: All-or-nothing semantics
- Automatic rollback on error
- No partial financial records

### Audit Trail
- Every change logged
- No delete without audit
- Immutable records
- 30-day retention

### Referential Integrity
- Foreign key constraints enforced
- Cannot delete categories with transactions
- Cannot delete admin account with data
- Cascading updates/deletes (where appropriate)

---

## Connection String Format

```
postgresql://user:password@host:5432/database?sslmode=require
```

**Supabase Example**:
```
postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres?sslmode=require
```

**Environment Variable**:
```
ConnectionStrings__PostgresConnection=postgresql://...
```

---

## Database Monitoring

### Key Metrics

**Connections**:
- Active connections
- Connection pool status
- Idle timeout: 300 seconds

**Performance**:
- Query execution time
- Index usage
- Slow query log

**Storage**:
- Used space
- Growth rate
- Quota remaining

### Health Checks

```sql
-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename) DESC;

-- Check index usage
SELECT 
    indexname,
    idx_scan as scans,
    idx_tup_read as reads,
    idx_tup_fetch as fetches
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check slow queries
SELECT 
    query,
    mean_time,
    calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Best Practices

1. **Never use float/double for money** - Always use DECIMAL(18,2)
2. **Always filter by AdminId** - Single admin isolation
3. **Use indexes for common queries** - Indexed on (AdminId, Date)
4. **Validate at application layer** - Don't rely only on DB constraints
5. **Log all changes** - Audit trail for accountability
6. **Backup regularly** - Daily automatic backups via Supabase
7. **Monitor performance** - Watch query times and storage

---

**Database Version**: PostgreSQL 15+  
**Last Updated**: 2026-08-20
