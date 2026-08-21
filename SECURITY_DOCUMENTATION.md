# SECURITY DOCUMENTATION

Comprehensive security architecture for Madrasa Accounting Software.

**Version**: 1.0.0  
**Date**: 2026-08-20  
**Status**: Production Ready

---

## Overview

Security is paramount for financial software. This document outlines the security architecture, practices, and procedures.

### Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimal necessary permissions
3. **Fail Secure** - Errors default to deny
4. **Zero Trust** - Verify everything
5. **Audit Everything** - Complete logging
6. **Encrypt in Transit** - HTTPS/TLS
7. **Protect at Rest** - Database encryption

---

## Authentication

### Login Flow

1. **User enters credentials**
   - Email: admin@madrasa.local
   - Password: [encrypted client-side]

2. **Backend validates**
   - Credentials verified
   - Password checked against hash
   - Rate limit enforced (5/minute)

3. **Token issued**
   - JWT generated with 24-hour expiry
   - Signed with HS256 algorithm
   - Contains admin ID

4. **Client stores token**
   - Flutter Secure Storage (encrypted)
   - Not in SharedPreferences
   - Not in logs

### Password Security

**Hashing Algorithm**:
- PBKDF2-SHA256
- 10,000 iterations
- 128-bit random salt
- Each password hashed uniquely

**Password Requirements**:
- Minimum 8 characters
- Mixed case recommended (not enforced)
- Never stored in plain text
- Never transmitted in logs

**Password Reset**:
- Only via change password endpoint
- Requires current password
- Old password verified first
- Rate limited (3/minute)

### Token Management

**JWT Specifications**:
- Algorithm: HS256
- Expiry: 24 hours (1440 minutes)
- Signature: HMAC with 256-bit secret
- Claims: admin_id, exp, iat, sub

**Token Security**:
- Never transmitted in URL
- Always in Authorization header
- Never logged in plain text
- Expires automatically
- No refresh token (re-login required)

**Token Storage (Flutter)**:
```dart
// Secure storage - encrypted on device
await secureStorage.write(
  key: 'auth_token',
  value: token,
);
```

### Rate Limiting

**Login Endpoint**: 5 attempts/minute per IP
**Password Change**: 3 attempts/minute per IP
**General API**: 100 requests/minute per IP

**Response**: 429 Too Many Requests after limit exceeded

---

## Authorization

### Single Admin Account

- Only one admin account exists
- No multi-user support
- No role-based access control
- No guest/viewer accounts

### Admin ID Isolation

All queries filtered by AdminId:

```csharp
// Ensure data isolation
var income = await _context.Income
    .Where(i => i.AdminId == currentAdminId)
    .ToListAsync();
```

No admin can access another admin's data (if system expanded):
- By design, only one admin exists
- All financial data tagged with AdminId
- Database queries always filter by AdminId

---

## Data Protection

### In Transit (HTTPS/TLS)

**Protocol**: HTTPS/TLS 1.2+
**Certificate**: Let's Encrypt (auto-renewed)
**Key Strength**: RSA 2048+ or ECDSA 256+
**Cipher Suites**: Modern, secure algorithms

**HSTS Configuration**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Implementation**:
- All traffic redirected HTTP → HTTPS
- HTTPS enforced on all endpoints
- No mixed content
- Certificate pinning (optional, Flutter)

### At Rest (Database)

**Database Connection**:
- TLS encryption enforced
- Connection string: sslmode=require
- Credentials in environment variables
- No hardcoded connection strings

**Password Storage**:
- Hashed with PBKDF2-SHA256
- Salt included
- Never plain text
- Accessible only to application

**Financial Data**:
- Encrypted connection required
- Supabase managed encryption
- Automatic backups encrypted
- No data exposure in logs

### Application Memory

**Sensitive Data Handling**:
- Tokens cleared from memory after use
- Passwords never stored in memory
- Database credentials environment variables
- No sensitive data in error messages

---

## Input Validation

### Server-Side Validation

**All inputs validated server-side**:
- Never trust client-side validation alone
- FluentValidation framework
- Comprehensive rules

**Validation Examples**:

```csharp
// Amount validation
RuleFor(x => x.Amount)
    .GreaterThan(0).WithMessage("Amount must be greater than 0")
    .PrecisionScale(18, 2, true).WithMessage("Invalid decimal precision");

// Date validation
RuleFor(x => x.Date)
    .NotEmpty()
    .LessThanOrEqualTo(DateTime.Today).WithMessage("Date cannot be in future");

// Email validation
RuleFor(x => x.Email)
    .EmailAddress().WithMessage("Invalid email format");

// Description validation
RuleFor(x => x.Description)
    .NotEmpty()
    .MaximumLength(500).WithMessage("Description too long");

// Payment method validation
RuleFor(x => x.PaymentMethod)
    .Must(x => x == "Cash" || x == "Bank")
    .WithMessage("Invalid payment method");
```

### SQL Injection Prevention

**Entity Framework Core**:
- Parameterized queries (automatic)
- No string concatenation in queries
- No raw SQL except in special cases
- Input sanitization

**Example** (Protected):
```csharp
// Safe - parameterized
var income = await _context.Income
    .Where(i => i.Description.Contains(searchTerm))
    .ToListAsync();

// Unsafe - NOT used
// var sql = "SELECT * FROM Income WHERE Description = '" + input + "'";
```

### File Upload Validation

**Logo Upload** (if implemented):
- Maximum size: 5MB
- Allowed types: PNG, JPG, GIF
- Filename validation
- Content-type verification
- No executable files
- No malicious content

---

## API Security

### CORS Configuration

**Production** (Restricted):
```csharp
services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", builder =>
    {
        builder.WithOrigins("https://yourdomain.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

**Development** (Localhost):
```csharp
builder.WithOrigins("http://localhost:*", "http://127.0.0.1:*")
```

**Not used**: `AllowAnyOrigin()` in production

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Request Validation

**All requests validated**:
- Content-Type: application/json
- Content-Length: within limits
- Request body size: <1MB
- Request headers: whitelist

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "A user-friendly error message",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

### Error Message Security

**Never expose**:
- Stack traces (production)
- Database errors/structure
- Internal file paths
- API secrets
- Sensitive configuration
- SQL queries

**Example** (Insecure - NOT done):
```
NullReferenceException in IncomeService.cs line 42
at MadrasaAccounting.Application.Services.IncomeService.Create(...)
```

**Example** (Secure - What's done):
```
Unable to save the income. Please try again later.
```

**Technical Error Logging** (Server-side):
```csharp
_logger.LogError(ex, 
    "Error creating income for admin {AdminId}", 
    adminId);
```

---

## Secrets Management

### Environment Variables

**Production** (Never in Git):
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__PostgresConnection=postgresql://...
JwtSettings__Secret=abc123...def456
ASPNETCORE_URLS=https://0.0.0.0:443
```

**Development** (Local machine):
```bash
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__PostgresConnection=...
JwtSettings__Secret=dev-only-secret-123
```

### .gitignore Configuration

```
# Never commit
appsettings.Production.json
appsettings.*.json (except Development)
.env
.env.local
.env.*.local
secrets.json
*.key
*.pem
```

### Secret Storage

**Render**:
- Environment variables encrypted
- Stored in secure vault
- Rotatable
- Audit logged

**Supabase**:
- Connection string encrypted
- Accessed via environment variables
- No hardcoding

**Flutter**:
- No hardcoded API secrets
- API URL from configuration
- Tokens in Secure Storage

---

## Audit Logging

### What's Logged

**All Financial Operations**:
- Income created/updated/deleted
- Expense created/updated/deleted
- Balance sheet accessed
- Reports generated

**All Admin Operations**:
- Login/logout
- Password changes
- Settings updates
- Audit log access

### Audit Log Structure

```json
{
  "id": "audit-123",
  "adminId": "admin-456",
  "createdAt": "2026-08-20T10:30:00Z",
  "actionType": "IncomeCreated",
  "description": "Income created",
  "transactionId": "income-789",
  "oldValues": null,
  "newValues": "{\"amount\": 5000.00, \"date\": \"2026-08-20\"}"
}
```

### Immutability

- No DELETE operations allowed on audit logs
- No UPDATE operations on audit logs
- 30-day minimum retention
- No manual deletion option in UI
- Audit trail permanent

### Retention Policy

- Minimum: 30 days
- Recommended: 1 year
- Compliance: Check local regulations
- Archive: After 1 year (optional)

---

## Cryptography

### Algorithms Used

| Purpose | Algorithm | Strength | Status |
|---------|-----------|----------|--------|
| Password Hashing | PBKDF2-SHA256 | 10,000 iterations | ✅ Current |
| JWT Signature | HS256 | 256-bit key | ✅ Current |
| Transport Security | TLS 1.2+ | RSA 2048/ECDSA 256 | ✅ Current |
| Database Connection | TLS | Encrypted | ✅ Current |
| Token Storage | AES (Secure Storage) | Platform-dependent | ✅ Current |

**Not Used**:
- MD5 (deprecated)
- SHA1 (deprecated)
- DES/3DES (deprecated)
- HTTP (unencrypted)

---

## Vulnerability Management

### Security Testing

**Performed**:
- ✅ OWASP Top 10 coverage
- ✅ SQL injection testing
- ✅ Authentication testing
- ✅ Authorization testing
- ✅ Validation testing
- ✅ Secrets exposure testing

**Recommendation**:
- Annual security audit (professional)
- Quarterly vulnerability scan
- Dependency monitoring (npm, NuGet)
- Security updates within 24 hours

### OWASP Top 10 Coverage

1. **Broken Access Control** - AdminId filtering on all queries ✅
2. **Cryptographic Failures** - HTTPS/TLS, PBKDF2 hashing ✅
3. **Injection** - Parameterized queries (EF Core) ✅
4. **Insecure Design** - Security-first architecture ✅
5. **Security Misconfiguration** - Environment variables ✅
6. **Vulnerable Components** - Dependency updates ✅
7. **Authentication Failures** - JWT, rate limiting ✅
8. **Software/Data Integrity** - Database transactions ✅
9. **Logging/Monitoring Gaps** - Audit logging ✅
10. **SSRF** - Not applicable (no external requests) ✅

---

## Incident Response

### If Data Breach Suspected

1. **Immediate**:
   - Stop all systems
   - Isolate compromised systems
   - Preserve evidence
   - Notify administrator

2. **Investigation** (24-48 hours):
   - Determine scope
   - Identify root cause
   - Review audit logs
   - Check backups

3. **Recovery**:
   - Restore from clean backup
   - Change all secrets
   - Update passwords
   - Verify data integrity

4. **Post-Incident**:
   - Document findings
   - Implement fixes
   - Update security procedures
   - Test recovery procedures

---

## Security Checklist

**Before Production Deployment**:
- [ ] HTTPS enabled
- [ ] TLS 1.2+ enforced
- [ ] JWT secret generated (256-bit)
- [ ] Database credentials secured
- [ ] CORS configured (specific origin)
- [ ] Rate limiting enabled
- [ ] Error handling verified
- [ ] No hardcoded secrets in code
- [ ] Environment variables configured
- [ ] Backup tested
- [ ] Audit logging enabled
- [ ] Passwords hashed (PBKDF2)
- [ ] Security headers configured
- [ ] Database connection encrypted
- [ ] Logging configured

---

## Regular Maintenance

**Monthly**:
- Review audit logs for anomalies
- Verify backups completed
- Check security updates available

**Quarterly**:
- Security vulnerability scan
- Update dependencies
- Review access logs

**Annually**:
- Professional security audit
- Penetration testing
- Security training
- Incident response drill

---

## Compliance

**Not Banking/Payment**:
- PCI DSS not required
- Not storing payment cards
- No payment processing

**Data Protection**:
- Local regulations apply
- GDPR (if EU)
- CCPA (if California)
- Check local requirements

**Financial Records**:
- Audit trail required
- Immutable records
- Retention policy
- Export capabilities

---

## References

- [OWASP Top 10](https://owasp.org/Top10/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [PBKDF2 Specification](https://tools.ietf.org/html/rfc2898)
- [TLS Best Practices](https://wiki.mozilla.org/Security/Server_Side_TLS)

---

**Security Documentation Version**: 1.0.0  
**Last Updated**: 2026-08-20  
**Status**: ✅ Production Ready
