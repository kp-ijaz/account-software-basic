# DATABASE SETUP GUIDE

**Application**: Madrasa Accounting Software
**Database**: PostgreSQL
**Version**: 1.0

---

## QUICK START

### Prerequisites

- PostgreSQL 12+ installed
- .NET 8.0 SDK installed
- Administrator access to database server

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE madrasa_accounting
  WITH
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

# Create user
CREATE USER madrasa_admin WITH PASSWORD 'your_secure_password';

# Grant permissions
ALTER ROLE madrasa_admin WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE madrasa_accounting TO madrasa_admin;

# Exit psql
\q
```

### Step 2: Update Connection String

Edit `backend/MadrasaAccounting.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=madrasa_accounting;Username=madrasa_admin;Password=your_secure_password"
  }
}
```

### Step 3: Run Migrations

```bash
cd backend

# Install dependencies
dotnet restore

# Run migrations (will create all tables)
dotnet ef database update --project MadrasaAccounting.Infrastructure

# Verify migration
dotnet ef database update --connection "Host=localhost;Port=5432;Database=madrasa_accounting;Username=madrasa_admin;Password=your_secure_password"
```

### Step 4: Start Application

```bash
# Run API with seeding
dotnet run --project MadrasaAccounting.API

# Expected output:
# Starting Madrasa Accounting API...
# Database migrations applied successfully.
# Database seeding completed successfully.
# Madrasa Accounting API started successfully.
```

### Step 5: Verify Database

```bash
# Connect to database
psql -U madrasa_admin -d madrasa_accounting -h localhost

# List all tables
\dt

# Expected tables:
# - public | Admins
# - public | IncomeCategories
# - public | ExpenseCategories
# - public | Incomes
# - public | Expenses
# - public | Settings
# - public | AuditLogs

# Check admin account
SELECT username, email, is_active FROM "Admins";

# Expected:
# username | email              | is_active
# admin    | admin@madrasa.local | t

# Check income categories (should be 7)
SELECT COUNT(*) FROM "IncomeCategories";

# Check expense categories (should be 9)
SELECT COUNT(*) FROM "ExpenseCategories";

# Exit
\q
```

---

## DETAILED SETUP

### Installation Platforms

#### Windows

1. **Install PostgreSQL**:
   ```bash
   # Using Chocolatey
   choco install postgresql
   
   # Or download from https://www.postgresql.org/download/windows/
   ```

2. **Add to PATH** (if not automatic):
   ```
   C:\Program Files\PostgreSQL\14\bin
   ```

3. **Start PostgreSQL Service**:
   ```bash
   # Services → PostgreSQL
   # Or command line:
   pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
   ```

#### macOS

```bash
# Using Homebrew
brew install postgresql

# Start service
brew services start postgresql

# Create default user
createdb
```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Creating Development Database

```bash
# Connect as postgres superuser
psql -U postgres

# Run these commands:
CREATE DATABASE madrasa_accounting_dev
  WITH ENCODING 'UTF8'
       TEMPLATE template0;

CREATE USER madrasa_dev WITH PASSWORD 'dev-password';

ALTER ROLE madrasa_dev WITH CREATEDB;

GRANT ALL PRIVILEGES ON DATABASE madrasa_accounting_dev TO madrasa_dev;

\q
```

### Creating Production Database

```bash
# Connect as postgres superuser
psql -U postgres

# Run these commands:
CREATE DATABASE madrasa_accounting
  WITH ENCODING 'UTF8'
       TEMPLATE template0
       CONNECTION LIMIT 50;

CREATE USER madrasa_prod WITH PASSWORD 'production-secure-password';

GRANT CONNECT ON DATABASE madrasa_accounting TO madrasa_prod;

GRANT USAGE ON SCHEMA public TO madrasa_prod;

GRANT CREATE ON SCHEMA public TO madrasa_prod;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO madrasa_prod;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO madrasa_prod;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO madrasa_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO madrasa_prod;

\q
```

---

## ENTITY FRAMEWORK CORE MIGRATIONS

### Initial Migration (Already Created)

The following migration has been created:

**Migration**: `20260820000000_InitialCreate`
- Creates all 7 tables
- Adds indexes
- Adds check constraints
- Adds foreign key relationships

### Running Migrations

```bash
# Navigate to backend
cd backend

# Option 1: Using dotnet ef CLI
dotnet ef database update --project MadrasaAccounting.Infrastructure

# Option 2: From API project
dotnet ef database update

# Option 3: With specific connection string
dotnet ef database update --connection "Host=localhost;Port=5432;Database=madrasa_accounting;Username=postgres;Password=password"
```

### Verifying Migrations

```bash
# List all applied migrations
dotnet ef migrations list

# Expected output:
# 20260820000000_InitialCreate (Applied)
```

### Removing Migrations (If Needed)

```bash
# Remove last migration (use carefully!)
dotnet ef migrations remove

# Drop entire database
dotnet ef database drop
```

---

## DATABASE SCHEMA

### Tables

#### Admins
```sql
CREATE TABLE "Admins" (
    "Id" uuid PRIMARY KEY,
    "Username" varchar(100) NOT NULL UNIQUE,
    "Email" varchar(255) NOT NULL UNIQUE,
    "PasswordHash" text NOT NULL,
    "IsActive" boolean DEFAULT true,
    "LastLogin" timestamp NULL,
    "CreatedAt" timestamp DEFAULT NOW(),
    "UpdatedAt" timestamp DEFAULT NOW()
);
```

#### IncomeCategories & ExpenseCategories
```sql
CREATE TABLE "IncomeCategories" (
    "Id" uuid PRIMARY KEY,
    "AdminId" uuid NOT NULL REFERENCES "Admins"("Id"),
    "Name" varchar(100) NOT NULL,
    "IsDefault" boolean DEFAULT false,
    "CreatedAt" timestamp DEFAULT NOW(),
    UNIQUE("AdminId", "Name")
);
```

#### Incomes & Expenses
```sql
CREATE TABLE "Incomes" (
    "Id" uuid PRIMARY KEY,
    "AdminId" uuid NOT NULL REFERENCES "Admins"("Id"),
    "CategoryId" uuid NOT NULL REFERENCES "IncomeCategories"("Id"),
    "Amount" numeric(18,2) NOT NULL CHECK ("Amount" > 0),
    "Date" timestamp NOT NULL,
    "Description" varchar(500),
    "PaymentMethod" text NOT NULL,
    "CreatedAt" timestamp DEFAULT NOW(),
    "UpdatedAt" timestamp DEFAULT NOW(),
    INDEX ("AdminId", "Date"),
    INDEX ("CategoryId")
);
```

#### Settings
```sql
CREATE TABLE "Settings" (
    "Id" uuid PRIMARY KEY,
    "AdminId" uuid NOT NULL UNIQUE REFERENCES "Admins"("Id"),
    "MadrasaName" varchar(255),
    "Address" varchar(500),
    "Phone" varchar(20),
    "Currency" varchar(3) DEFAULT 'AED',
    "FinancialYearStart" timestamp,
    "LogoPath" varchar(500),
    "CreatedAt" timestamp DEFAULT NOW(),
    "UpdatedAt" timestamp DEFAULT NOW()
);
```

#### AuditLogs
```sql
CREATE TABLE "AuditLogs" (
    "Id" uuid PRIMARY KEY,
    "AdminId" uuid NOT NULL REFERENCES "Admins"("Id"),
    "ActionType" varchar(50) NOT NULL,
    "Description" varchar(1000),
    "TransactionId" uuid,
    "OldValues" jsonb,
    "NewValues" jsonb,
    "IpAddress" varchar(45),
    "Timestamp" timestamp DEFAULT NOW(),
    INDEX ("AdminId", "Timestamp"),
    INDEX ("ActionType")
);
```

---

## DEFAULT DATA SEEDED

### Admin Account

| Field | Value |
|-------|-------|
| Username | admin |
| Email | admin@madrasa.local |
| Password Hash | (placeholder - to be updated in Phase 4) |
| Status | Active |

### Income Categories (7)
- Student Fees
- Donations
- Zakat
- Sadaqah
- Sponsorship
- Building Fund
- Other Income

### Expense Categories (9)
- Teacher Salary
- Electricity
- Water
- Food
- Maintenance
- Stationery
- Events
- Building Maintenance
- Miscellaneous

---

## CONFIGURATION

### appsettings.json (Development)

```json
{
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=madrasa_accounting_dev;Username=madrasa_dev;Password=dev-password"
  },
  "JwtSettings": {
    "Secret": "dev-secret-key-min-32-characters-long",
    "Issuer": "MadrasaAccountingAPI",
    "Audience": "MadrasaAccountingApp",
    "ExpirationHours": 24
  }
}
```

### appsettings.json (Production)

```json
{
  "ConnectionStrings": {
    "PostgresConnection": "Host=db.provider.com;Port=5432;Database=madrasa_accounting;Username=madrasa_prod;Password=secure-password"
  },
  "JwtSettings": {
    "Secret": "production-secret-key-min-32-characters-strong-random",
    "Issuer": "MadrasaAccountingAPI",
    "Audience": "MadrasaAccountingApp",
    "ExpirationHours": 24
  }
}
```

---

## SECURITY CONSIDERATIONS

### User Permissions

**Principle of Least Privilege**:

```sql
-- Create read-only user for monitoring
CREATE USER madrasa_monitor WITH PASSWORD 'monitor-password';
GRANT CONNECT ON DATABASE madrasa_accounting TO madrasa_monitor;
GRANT USAGE ON SCHEMA public TO madrasa_monitor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO madrasa_monitor;

-- Create backup user
CREATE USER madrasa_backup WITH PASSWORD 'backup-password';
GRANT CONNECT ON DATABASE madrasa_accounting TO madrasa_backup;
GRANT pg_dump_role TO madrasa_backup;
```

### Connection Security

**Enable SSL for Remote Connections**:

```bash
# Generate self-signed certificate
openssl req -new -x509 -days 365 -nodes -out server.crt -keyout server.key

# Place in PostgreSQL data directory
cp server.crt /var/lib/postgresql/14/main/
cp server.key /var/lib/postgresql/14/main/
chmod 600 /var/lib/postgresql/14/main/server.key

# Update postgresql.conf
echo "ssl = on" >> /etc/postgresql/14/main/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Password Security

- Minimum 16 characters
- Mix of uppercase, lowercase, digits, special characters
- Store in secure location
- Rotate every 90 days
- Never commit to version control

---

## TROUBLESHOOTING

### Connection Refused

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check connection settings
echo $PGHOST $PGPORT $PGUSER $PGDATABASE

# Try explicit connection
psql -h localhost -p 5432 -U postgres
```

### Permission Denied

```bash
# Fix user permissions
psql -U postgres -c "ALTER USER madrasa_admin WITH CREATEDB;"

# Grant specific privileges
psql -U postgres -c "GRANT ALL ON DATABASE madrasa_accounting TO madrasa_admin;"
```

### Migration Failure

```bash
# Check migration status
dotnet ef migrations list

# Reset migrations (be careful!)
dotnet ef database drop
dotnet ef database update
```

### Constraint Violations

```bash
# Check check constraints
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
WHERE con.conrelid = 'Incomes'::regclass;

# Check foreign keys
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name='Incomes';
```

---

## MAINTENANCE

### Regular Tasks

**Daily**:
- Monitor backup completion
- Check error logs
- Verify connectivity

**Weekly**:
- Review query performance
- Check disk space usage
- Test backup restore

**Monthly**:
- Analyze tables
- Vacuum database
- Update statistics

### PostgreSQL Maintenance Commands

```sql
-- Analyze tables (update statistics)
ANALYZE;

-- Vacuum database (reclaim space)
VACUUM;

-- Full vacuum (slow, need exclusive lock)
VACUUM FULL;

-- Check database size
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;

-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## NEXT STEPS

1. Follow the Quick Start section above
2. Verify database is set up correctly
3. Run migrations automatically (via Program.cs)
4. Check all tables are created
5. Proceed to Phase 4 — Secure Admin Login

---

**Created**: 2026-08-20
**Last Updated**: 2026-08-20
**Next Review**: Phase 4 start
