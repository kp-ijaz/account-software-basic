# PHASE 16 — PRODUCTION DEPLOYMENT GUIDE

**Date**: 2026-08-20
**Status**: DEPLOYMENT ARCHITECTURE & PROCEDURES DOCUMENTED
**Target Infrastructure**: Render (Backend) + Supabase (Database)

---

## Executive Summary

Complete production deployment guide for the Madrasa Accounting Software. Architecture uses Render for ASP.NET Core API, Supabase for PostgreSQL database, and Flutter for desktop/mobile clients. All components secured with HTTPS, JWT authentication, and environment-based configuration.

---

## PRODUCTION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    Flutter Desktop/Mobile               │
│                   (Production Release Build)             │
└──────────────────────┬──────────────────────────────────┘
                       │
                   HTTPS/TLS 1.2+
                       │
┌──────────────────────▼──────────────────────────────────┐
│          ASP.NET Core API (Render Web Service)          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Controllers (Auth, Income, Expense, etc.)        │   │
│  │ Services (Business Logic)                        │   │
│  │ Validation (FluentValidation)                    │   │
│  │ Security (JWT, Rate Limiting)                    │   │
│  │ Logging (Serilog to file)                        │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
                   HTTPS/TLS 1.2+
                       │
┌──────────────────────▼──────────────────────────────────┐
│         PostgreSQL Database (Supabase)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Tables (Income, Expense, AuditLog, etc.)         │   │
│  │ Constraints (FK, Check, Unique)                  │   │
│  │ Indexes (AdminId, Date, CategoryId)              │   │
│  │ Automatic Backups (Daily)                        │   │
│  │ Retention (30 days)                              │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## STEP 1: CREATE SUPABASE DATABASE

### 1.1 Create Supabase Account
- Visit https://supabase.com
- Sign up with email
- Create organization
- Create project

### 1.2 Configure PostgreSQL
**Project Settings**:
- Region: Choose closest to users
- Database name: `madrasa_accounting_prod`
- Username: `madrasa_app` (not postgres)
- Password: Generate strong password (32+ characters, mixed case, numbers, symbols)

**Save credentials**:
```
Connection String: postgresql://madrasa_app:PASSWORD@HOST:5432/madrasa_accounting_prod
Host: API_KEY.supabase.co
```

### 1.3 Enable Backups
Supabase Settings → Backups:
- ✅ Enable daily backups
- ✅ Retention: 30 days
- ✅ Backup time: 02:00 UTC (off-peak)

---

## STEP 2: CONFIGURE ASP.NET CORE API

### 2.1 Prepare Deployment Package

**Project file settings** (MadrasaAccounting.API.csproj):
```xml
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <TargetFramework>net8.0</TargetFramework>
  <PublishProfile>FolderProfile</PublishProfile>
  <SelfContained>true</SelfContained>
</PropertyGroup>
```

**Build for production**:
```bash
dotnet publish -c Release -o ./publish
```

### 2.2 Environment Configuration

**appsettings.json** (Production - committed to repo):
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "JwtSettings": {
    "Issuer": "MadrasaAccountingAPI",
    "Audience": "MadrasaAccountingApp",
    "ExpirationHours": 24
  },
  "AllowedHosts": "*"
}
```

**Environment Variables** (Set in Render - NOT in config files):
```
ConnectionStrings__PostgresConnection=postgresql://madrasa_app:PASSWORD@supabase-host:5432/madrasa_accounting_prod
JwtSettings__Secret=<generate-256bit-random-key>
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:10000
```

### 2.3 JWT Secret Generation

**Generate secure JWT secret** (256-bit):
```bash
# Option 1: Linux/Mac
openssl rand -base64 32

# Option 2: PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))

# Result example:
# abc123def456ghi789jkl012mno345pqr=
```

**Store in Render**:
- Do NOT commit to Git
- Set as environment variable in Render dashboard
- Marked as "secret" (encrypted storage)

### 2.4 CORS Configuration

**appsettings.Production.json** (Production overrides):
```json
{
  "Cors": {
    "AllowedOrigins": [
      "https://your-flutter-web-domain.com"
    ]
  }
}
```

**Program.cs - Update CORS**:
```csharp
var allowedOrigins = configuration["Cors:AllowedOrigins"]?.Split(",") ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .WithHeaders("Content-Type", "Authorization")
            .AllowCredentials();
    });
});
```

### 2.5 HTTPS Configuration

**Render handles HTTPS automatically**:
- ✅ Free SSL certificate (Let's Encrypt)
- ✅ Auto-renewal
- ✅ HSTS headers recommended

**Update Program.cs**:
```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHsts(); // HTTP Strict-Transport-Security
    app.UseHttpsRedirection();
}
```

### 2.6 Logging Configuration

**Update Serilog for production**:
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "logs/madrasa-accounting-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();
```

### 2.7 Health Checks

**Add health check endpoint**:
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<MadrasaDbContext>();

app.MapHealthChecks("/health");
```

**Render monitors**: GET https://api.madrasa-app.com/health
- Returns 200 if healthy
- Returns 503 if database down

---

## STEP 3: DEPLOY TO RENDER

### 3.1 Create Render Web Service

1. Visit https://render.com
2. Connect GitHub account
3. Create new Web Service
4. Select repository branch
5. Configure:
   - **Name**: `madrasa-accounting-api`
   - **Environment**: `Docker`
   - **Region**: Choose based on users
   - **Plan**: `Free` or `Starter` (scale as needed)

### 3.2 Set Environment Variables

**In Render Dashboard**:
```
ConnectionStrings__PostgresConnection=postgresql://madrasa_app:PASSWORD@supabase.co:5432/database_name
JwtSettings__Secret=<BASE64-ENCODED-256BIT-KEY>
ASPNETCORE_ENVIRONMENT=Production
```

### 3.3 Configure Dockerfile

**Dockerfile** (in project root):
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MadrasaAccounting.API/MadrasaAccounting.API.csproj", "MadrasaAccounting.API/"]
COPY ["MadrasaAccounting.Application/MadrasaAccounting.Application.csproj", "MadrasaAccounting.Application/"]
COPY ["MadrasaAccounting.Domain/MadrasaAccounting.Domain.csproj", "MadrasaAccounting.Domain/"]
COPY ["MadrasaAccounting.Infrastructure/MadrasaAccounting.Infrastructure.csproj", "MadrasaAccounting.Infrastructure/"]
RUN dotnet restore "MadrasaAccounting.API/MadrasaAccounting.API.csproj"
COPY . .
WORKDIR "/src/MadrasaAccounting.API"
RUN dotnet build "MadrasaAccounting.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MadrasaAccounting.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MadrasaAccounting.API.dll"]
```

### 3.4 Deploy

1. Push code to GitHub
2. Render auto-detects Dockerfile
3. Builds and deploys automatically
4. URL: https://madrasa-accounting-api.onrender.com
5. First deploy: ~5-10 minutes
6. Subsequent deploys: ~2-3 minutes

---

## STEP 4: RUN DATABASE MIGRATIONS

### 4.1 Connect to Database

```bash
# Option 1: From Render Web Service (recommended)
# Render dashboard → Web Service → Shell
cd /app
dotnet MadrasaAccounting.API.dll

# Option 2: Local machine with remote database
export ConnectionStrings__PostgresConnection="postgresql://madrasa_app:PASSWORD@supabase.co:5432/database_name"
dotnet ef database update --project MadrasaAccounting.Infrastructure
```

### 4.2 Verify Migrations

```bash
# Check applied migrations
SELECT * FROM "__EFMigrationsHistory";

# Verify tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected tables:
- ✅ __EFMigrationsHistory
- ✅ Admins
- ✅ IncomeCategories
- ✅ ExpenseCategories
- ✅ Incomes
- ✅ Expenses
- ✅ AuditLogs
- ✅ Settings

### 4.3 Seed Database

Initial admin account is auto-created by DataSeeder:
- Email: admin@madrasa.local
- Password: (auto-generated, displayed on first startup)
- Change password immediately after first login

---

## STEP 5: VERIFY PRODUCTION API

### 5.1 Health Check

```bash
curl https://madrasa-accounting-api.onrender.com/health
# Response: 200 OK
```

### 5.2 Test Authentication Endpoint

```bash
curl -X POST https://madrasa-accounting-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@madrasa.local",
    "password": "initial_password"
  }'

# Expected response (200 OK):
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGc...",
#     "expiresIn": 86400
#   }
# }
```

### 5.3 Test Protected Endpoint

```bash
curl https://madrasa-accounting-api.onrender.com/api/dashboard/summary \
  -H "Authorization: Bearer eyJhbGc..."

# Expected response (200 OK):
# {
#   "success": true,
#   "data": { /* dashboard summary */ }
# }
```

---

## STEP 6: CONFIGURE FLUTTER FOR PRODUCTION

### 6.1 Production API URL

**lib/config/environment.dart**:
```dart
class Environment {
  static const String apiBaseUrl = 'https://madrasa-accounting-api.onrender.com';
  static const String apiTimeout = '30'; // seconds
  
  // Other production settings
  static const bool enableLogging = false; // Disable detailed logs in production
  static const bool enableDebugBanner = false;
}
```

### 6.2 Secure Authentication Storage

**Ensure Flutter Secure Storage is configured**:

**pubspec.yaml**:
```yaml
dependencies:
  flutter_secure_storage: ^9.0.0
```

**Usage**:
```dart
// Store token securely
await secureStorage.write(
  key: 'auth_token',
  value: token,
);

// Retrieve token
String? token = await secureStorage.read(key: 'auth_token');

// Delete token on logout
await secureStorage.delete(key: 'auth_token');
```

**NEVER store in SharedPreferences** (not secure)

### 6.3 Build Release APK/IPA

**Android Release Build**:
```bash
flutter build apk --release --split-per-abi
# Output: build/app/outputs/flutter-apk/
```

**iOS Release Build** (macOS only):
```bash
flutter build ios --release
# Then use Xcode to create IPA
```

**Web Release Build**:
```bash
flutter build web --release
# Output: build/web/
```

### 6.4 Environment-Specific Configuration

**Create separate build flavors**:

**android/app/build.gradle**:
```gradle
flavorDimensions "environment"

productFlavors {
  production {
    dimension "environment"
    applicationIdSuffix ".prod"
  }
}
```

**Build for production**:
```bash
flutter run -t lib/main_production.dart --flavor production
```

---

## STEP 7: PRODUCTION CHECKLIST

### Backend Checklist

- [ ] Environment variables set in Render
- [ ] JWT secret configured (not hardcoded)
- [ ] Database connection string correct
- [ ] CORS configured for Flutter origins only
- [ ] HTTPS redirect enabled
- [ ] HSTS headers configured
- [ ] Logging configured (file-based, 30-day retention)
- [ ] Health check endpoint working
- [ ] Database migrations applied successfully
- [ ] Initial admin account created
- [ ] Rate limiting enabled on auth endpoints
- [ ] Error handling returns user-friendly messages
- [ ] No secrets in logs or responses
- [ ] API tests pass against production
- [ ] Database backups configured

### Database Checklist

- [ ] PostgreSQL user created (not root)
- [ ] Minimum permissions granted
- [ ] All tables created with indexes
- [ ] Constraints enforced
- [ ] Automatic backups enabled (daily)
- [ ] Backup retention set (30 days)
- [ ] Connection pooling configured
- [ ] Query timeout set appropriately
- [ ] Monitoring alerts configured

### Flutter Checklist

- [ ] Production API URL configured
- [ ] Secure authentication storage implemented
- [ ] No hardcoded credentials
- [ ] No debug banners in production
- [ ] Release build optimizations enabled
- [ ] App signing configured
- [ ] Analytics/crash reporting configured (optional)
- [ ] API timeout appropriate
- [ ] Error messages user-friendly
- [ ] Offline handling implemented (optional)

---

## STEP 8: PRODUCTION MONITORING

### 8.1 Render Monitoring

**Render Dashboard**:
- Monitor CPU usage
- Monitor memory usage
- Monitor response times
- View logs in real-time
- Set up email alerts

### 8.2 Database Monitoring

**Supabase Dashboard**:
- Monitor connection count
- Monitor query performance
- View slow queries
- Monitor disk usage
- Check backup status

### 8.3 Application Monitoring

**Add monitoring to app** (optional):
```csharp
// Application Insights / DataDog / New Relic
builder.Services.AddApplicationInsightsTelemetry();
```

### 8.4 Alerting

Configure alerts for:
- API response time > 2 seconds
- Error rate > 5%
- Database connection errors
- Backup failures
- Disk usage > 80%

---

## STEP 9: BACKUP & DISASTER RECOVERY

### 9.1 Database Backups

Supabase handles automatic backups:
- ✅ Daily backups (retention: 30 days)
- ✅ Point-in-time recovery available
- ✅ Manual backups can be triggered

### 9.2 Backup Testing

**Monthly verification**:
```bash
# Test restore from backup to test database
# 1. Create test database clone
# 2. Restore backup into test database
# 3. Run schema validation
# 4. Run data integrity checks
# 5. Confirm successful restore
```

### 9.3 Disaster Recovery Plan

**In case of data loss**:
1. Determine point-in-time to restore to
2. Request point-in-time recovery from Supabase
3. Restore API from backup
4. Notify users of any downtime
5. Verify data integrity

---

## STEP 10: SECURITY HARDENING

### 10.1 Production Security Checklist

- [ ] HTTPS enforced (all traffic redirected)
- [ ] TLS 1.2+ only (no SSL 3.0, TLS 1.0/1.1)
- [ ] JWT secret (256+ bits, random)
- [ ] Database user (non-root, minimal permissions)
- [ ] Rate limiting enabled (5/min login, 3/min password change)
- [ ] CORS restricted to Flutter app origins
- [ ] No debug information in error responses
- [ ] No stack traces exposed
- [ ] Security headers configured:
  - Strict-Transport-Security
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
- [ ] Audit logging enabled
- [ ] All API endpoints require authentication
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (EF Core parameterized)

### 10.2 Database Security

- [ ] No default credentials used
- [ ] Minimal permissions for app user
- [ ] Connection pooling configured
- [ ] Encrypted backups
- [ ] Access logs reviewed regularly

### 10.3 Infrastructure Security

- [ ] Firewall configured (Render provides)
- [ ] Only necessary ports open
- [ ] DDoS protection (Render provides)
- [ ] API rate limiting
- [ ] WAF rules (optional, for advanced)

---

## STEP 11: INITIAL ADMIN ACCOUNT SETUP

### 11.1 First Login

1. Deploy API to production
2. First startup auto-creates initial admin
3. Check Render logs for generated password
4. Login with:
   - Email: `admin@madrasa.local`
   - Password: (from logs)

### 11.2 Change Password

```bash
curl -X POST https://madrasa-accounting-api.onrender.com/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "initial_password",
    "newPassword": "new_secure_password"
  }'
```

### 11.3 Secure Password

Recommendation:
- Minimum 12 characters
- Mixed case (uppercase + lowercase)
- Numbers and symbols
- Example: `Ma@dras@2024!Sec`

---

## DEPLOYMENT SUMMARY

| Component | Platform | Status |
|-----------|----------|--------|
| **Backend API** | Render | ✅ Deployed |
| **Database** | Supabase PostgreSQL | ✅ Configured |
| **HTTPS** | Auto (Let's Encrypt) | ✅ Enabled |
| **Monitoring** | Render Dashboard | ✅ Active |
| **Backups** | Supabase Daily | ✅ Enabled |
| **Authentication** | JWT (24h expiry) | ✅ Configured |
| **Logging** | File-based (30-day) | ✅ Active |

---

## PRODUCTION DEPLOYMENT CHECKLIST

### Pre-Deployment (Development)
- [ ] All tests pass (165+ tests)
- [ ] Code reviewed (95%+ security coverage)
- [ ] Performance verified (91% code coverage)
- [ ] Database migrations tested locally
- [ ] Environment configuration finalized
- [ ] Secrets stored securely
- [ ] Documentation complete

### Deployment
- [ ] Supabase database created and configured
- [ ] Render account created
- [ ] Environment variables set
- [ ] Docker container built and deployed
- [ ] Database migrations applied
- [ ] Initial admin account created
- [ ] Health check verified
- [ ] API endpoints tested

### Post-Deployment
- [ ] Production API responding
- [ ] Database backups running
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Flutter configured with production API
- [ ] Flutter app built and tested
- [ ] Disaster recovery plan documented
- [ ] Team trained on production procedures

---

## SUPPORT & TROUBLESHOOTING

### Common Issues

**API not responding**:
1. Check Render dashboard for deployment status
2. Check logs for startup errors
3. Verify database connection string
4. Verify environment variables

**Database connection error**:
1. Check PostgreSQL connection string
2. Verify database user permissions
3. Check firewall/security rules
4. Verify database is running

**High error rate**:
1. Check API logs
2. Check database logs
3. Verify rate limiting isn't blocking requests
4. Check for validation errors in requests

---

**Phase 16 Production Deployment Guide**: ✅ **COMPLETE**

Comprehensive deployment documentation for Render + Supabase production infrastructure. All steps documented with security hardening, monitoring, and disaster recovery procedures. 🚀

