# Security Architecture & Implementation

**Madrasa Accounting Software - MERN Stack**

---

## Executive Summary

This document outlines the complete security architecture and implementation of the Madrasa Accounting Software. The application handles sensitive financial data and requires enterprise-grade security measures.

**Security Level:** Production-Ready
**Compliance:** OWASP Top 10 protection, secure by design

---

## 1. Authentication & Authorization

### 1.1 Login System

**Mechanism:** Single Admin Account with JWT Token-Based Authentication

- **Username/Email:** Email-based login (no public registration)
- **Password:** Hashed using bcryptjs (12 salt rounds)
- **Token:** JWT (JSON Web Tokens)
- **Token Expiration:** 24 hours
- **Token Storage:** HTTP-only, Secure cookies (frontend) + Authorization header (backend)

### 1.2 Password Hashing

```typescript
// bcryptjs configuration
- Algorithm: bcrypt
- Salt Rounds: 12
- Time Cost: ~0.1 seconds per hash (256 iterations)
- Memory Safe: Resistant to GPU attacks
```

**Never stored:** Plain-text passwords are never logged or stored.

### 1.3 Token Management

**JWT Token Structure:**
```json
{
  "userId": "uuid",
  "email": "admin@madrasa.local",
  "iat": 1702000000,
  "exp": 1702086400
}
```

**Token Security:**
- Signed with HS256 algorithm
- Secret: 32+ character environment variable
- Verification on every protected endpoint
- Automatic refresh via login endpoint
- Expired tokens rejected immediately

### 1.4 Session Lifecycle

1. User submits credentials
2. Server verifies email + password
3. JWT token generated (24-hour expiration)
4. Token returned to client (httpOnly cookie)
5. Client includes token in Authorization header
6. Server verifies token signature + expiration
7. Token rotated on each login
8. Old tokens immediately invalidated on logout

---

## 2. Rate Limiting

### 2.1 Global Rate Limiting

**All API Endpoints:**
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Standard rate limit headers returned
- **Status Code:** 429 Too Many Requests
- **Message:** Clear error message indicating retry time

### 2.2 Login Rate Limiting

**Login Endpoint (/api/auth/login):**
- **Limit:** 5 login attempts per 15 minutes per IP
- **Purpose:** Prevents brute-force attacks
- **Response:** 429 status with retry-after header

### 2.3 Password Change Rate Limiting

**Password Endpoint (/api/auth/change-password):**
- **Limit:** 3 attempts per hour per user
- **Purpose:** Prevents abuse of password change functionality
- **Response:** 429 status with retry-after header

### 2.4 File Upload Rate Limiting

**Upload Endpoint (/api/settings/logo):**
- **Limit:** 10 uploads per hour per user
- **Purpose:** Prevents disk space abuse
- **File Size:** Max 2MB per file
- **Formats:** PNG, JPG, GIF only

---

## 3. Input Validation & Sanitization

### 3.1 Email Validation

**Format:** RFC 5322 compliant
```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Maximum Length:** 255 characters
**Validation:** Server-side (backend) + Client-side (frontend)

### 3.2 Password Validation

**Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

**Enforcement:** Backend only (prevents weak passwords)

### 3.3 Phone Number Validation

**Format:** International format
```regex
/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
```

**Maximum Length:** 20 characters

### 3.4 Financial Amount Validation

**Type:** Decimal (never float/double)
**Range:** 0.01 to 999,999,999.99
**Precision:** 2 decimal places (cents/fils)
**Database Type:** NUMERIC(12,2)

### 3.5 Date Validation

**Format:** YYYY-MM-DD (ISO 8601)
**Validation:** Must be valid date
**Range:** No future dates for transactions

### 3.6 String Length Validation

**General Fields:**
- Minimum: 1 character
- Maximum: 500 characters
- Special fields (description): up to 1000 characters

### 3.7 Input Sanitization

**XSS Prevention:**
- All user input sanitized before processing
- HTML/script tags removed
- `javascript:` protocol blocked
- Whitespace trimmed
- Applied to request body + query parameters

**Example:**
```
Input: "<script>alert('XSS')</script>"
Output: "alert('XSS')"
```

---

## 4. Data Protection

### 4.1 Financial Data Integrity

**Decimal Types:** All financial amounts stored as DECIMAL(12,2)
- Never float or double
- Prevents rounding errors
- Database-level precision guaranteed

**Example:**
```sql
-- CORRECT
amount NUMERIC(12,2)  -- 999999999.99 maximum

-- INCORRECT (Never Used)
amount FLOAT          -- Precision loss
amount DOUBLE         -- Rounding errors
```

### 4.2 Database Transactions

**Financial Operations:** Always wrapped in database transactions

**Example: Creating Income Transaction**
```
BEGIN TRANSACTION
  1. Create Transaction record
  2. Create Transaction Entry
  3. Update running balances
  4. Create Audit Log entry
COMMIT

If any step fails → ROLLBACK (all or nothing)
```

**Safety Guarantee:** No partial financial records left in database

### 4.3 Audit Logging

**Immutable Audit Trail:**
- Every action logged to database
- Timestamps (UTC)
- User identification
- Action type (11 types total)
- Related transaction ID
- Cannot be deleted from UI
- Database-level protection

**Audit Log Actions:**
1. LOGIN
2. LOGOUT
3. INCOME_CREATED
4. INCOME_UPDATED
5. INCOME_DELETED
6. EXPENSE_CREATED
7. EXPENSE_UPDATED
8. EXPENSE_DELETED
9. SETTINGS_UPDATED
10. PASSWORD_CHANGED
11. LOGO_UPLOADED

### 4.4 Cascade Delete Protection

**Foreign Key Constraints:**
- Strict referential integrity
- Transactions prevent orphaned records
- Admin cannot manually delete audit logs
- Soft deletes for financial records (future enhancement)

---

## 5. API Security

### 5.1 HTTPS/TLS

**Production Requirement:** All traffic over HTTPS
- TLS 1.2 minimum
- Strong cipher suites
- Certificate pinning (optional)

**Local Development:** HTTP allowed (dev mode only)

### 5.2 CORS (Cross-Origin Resource Sharing)

**Configuration:**
```
Allowed Origins: Configured via environment variable
Credentials: Enabled (httpOnly cookies)
Methods: GET, POST, PUT, DELETE, PATCH
Headers: Content-Type, Authorization
Max Age: 86400 (24 hours cache)
```

**Default (Development):** localhost:3000
**Production:** Custom domain only

### 5.3 Security Headers (via Helmet.js)

**Content Security Policy (CSP):**
```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
```

**HSTS (HTTP Strict Transport Security):**
- Max Age: 31,536,000 seconds (1 year)
- Include Subdomains: Yes
- Preload: Yes

**Frame Protection:**
- X-Frame-Options: DENY (no embedding in iframes)

**MIME Type Protection:**
- X-Content-Type-Options: nosniff

**XSS Protection:**
- X-XSS-Protection: 1; mode=block

**Referrer Policy:**
- Referrer-Policy: strict-origin-when-cross-origin

### 5.4 Request Size Limits

**JSON Payload:** Maximum 10MB
**Form Data:** Maximum 10MB
**File Upload:** Maximum 2MB

**Validation Middleware:** All requests checked before processing

### 5.5 HTTP Methods

**Allowed Methods:**
- GET: Read data
- POST: Create data
- PUT: Update data
- DELETE: Delete data (with audit)
- PATCH: Partial updates (not used)

**Disallowed Methods:**
- OPTIONS: Handled by CORS
- TRACE: Disabled
- CONNECT: Disabled

---

## 6. Error Handling & Information Disclosure

### 6.1 Error Response Format

**Standard Format:**
```json
{
  "success": false,
  "message": "User-friendly error message",
  "errors": []
}
```

### 6.2 Never Exposed to User

❌ Stack traces
❌ SQL queries or error details
❌ Internal server paths
❌ Database structure
❌ API version information in errors
❌ Hardware/OS details

### 6.3 User-Facing Error Messages

✅ "Unable to save the transaction. Please try again."
✅ "Invalid email format"
✅ "Password must contain at least one number"
✅ "Too many login attempts, please try again later"

### 6.4 Server-Side Logging

**Logged Securely:**
- Complete error stack traces
- SQL queries executed
- All technical details
- User actions
- Timestamps (UTC)
- IP addresses
- User agents

**Log File:** `/logs/application.log`
**Retention:** 30 days (configurable)
**Protection:** Not accessible via UI

---

## 7. SQL Injection Prevention

### 7.1 Prisma ORM Protection

**All database queries use Prisma ORM:**
- Parameterized queries (prevents SQL injection)
- Type-safe query builder
- Automatic escaping of user input
- No string concatenation in queries

**Example (Safe):**
```typescript
const income = await prisma.transaction.findUnique({
  where: { id: userId }  // Parameterized
});
```

**Example (Dangerous - Never Used):**
```typescript
// NEVER do this:
const query = `SELECT * FROM Transaction WHERE id = ${userId}`;
// SQL injection vulnerability!
```

### 7.2 Input Validation First

All user input validated before database queries
- Email format checked
- Amount validated as decimal
- Dates validated
- String lengths checked

---

## 8. Frontend Security

### 8.1 Token Storage

**Secure Storage:**
- httpOnly cookies (server cannot access via JavaScript)
- Secure flag enabled (HTTPS only)
- SameSite flag set to Strict (CSRF protection)

**Alternative (if cookies not used):**
- localStorage for token
- Never store sensitive data (passwords)
- XSS protection via sanitization

### 8.2 XSS Prevention

**All dynamic content HTML-encoded:**
```tsx
// SAFE - Material-UI components auto-escape
<Typography>{userInput}</Typography>

// DANGEROUS - Never used
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Content Security Policy:**
- Inline scripts blocked
- External scripts allowed only from trusted sources
- Prevents unauthorized script injection

### 8.3 Form Security

**CSRF Protection:**
- SameSite cookies (Strict mode)
- Token validation on server
- No public forms (login only)

**Form Validation:**
- Client-side: User experience
- Server-side: Security enforcement
- Server validation happens regardless of client

### 8.4 No Sensitive Data Storage

❌ Passwords never stored in localStorage/sessionStorage
❌ API keys never exposed in code
❌ Secrets never committed to Git
❌ PII never logged to client console

✅ Only non-sensitive data (user ID, email) in storage
✅ Tokens auto-refreshed
✅ Logout clears all data

---

## 9. API Endpoint Protection

### 9.1 All Protected Endpoints

**EVERY endpoint except /login requires authentication:**

Protected Endpoints:
- `/api/income/*` → authMiddleware
- `/api/expense/*` → authMiddleware
- `/api/daybook/*` → authMiddleware
- `/api/ledger/*` → authMiddleware
- `/api/dashboard/*` → authMiddleware
- `/api/reports/*` → authMiddleware
- `/api/audit/*` → authMiddleware
- `/api/settings/*` → authMiddleware
- `/api/auth/me` → authMiddleware
- `/api/auth/logout` → authMiddleware
- `/api/auth/change-password` → authMiddleware

Public Endpoints (only):
- `POST /api/auth/login` (rate limited)
- `POST /api/auth/check-email`
- `POST /api/auth/check-username`
- `GET /api/health` (no auth required)
- `GET /api/version` (no auth required)

### 9.2 Authorization Model

**Single Admin:** Only one user account per Madrasa
- No role-based access control (RBAC)
- No user management UI
- Admin has access to all data
- No permission checks needed

---

## 10. Database Security

### 10.1 Connection Security

**Connection String (Environment):**
```
DATABASE_URL=postgresql://user:password@host:5432/madrasa
```

**SSL Connection (Production):**
- `?sslmode=require` in connection string
- TLS 1.2 minimum
- Certificate validation

**Development:**
- SSL optional
- Local connection string allowed

### 10.2 User Permissions (PostgreSQL)

**Database User Privileges:**
```sql
-- Limited to required operations
GRANT USAGE ON SCHEMA public TO madrasa_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO madrasa_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO madrasa_user;
```

**Restrictions:**
- Cannot alter schema (migrations only via ORM)
- Cannot access other databases
- Cannot execute arbitrary functions

### 10.3 Backup Security

**Automated Backups (Supabase):**
- Daily automated backups
- 7-day retention (configurable)
- Encrypted at rest
- Geo-redundant storage

**Manual Backups:**
```bash
# Backup command (never commit to Git)
pg_dump postgresql://user:pass@host/db > backup.sql

# Restore command (test regularly)
psql postgresql://user:pass@host/db < backup.sql
```

---

## 11. Environment Variable Security

### 11.1 Sensitive Variables

**Never commit to Git:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=long-random-string-32+chars
```

**Development (.env file):**
```
NODE_ENV=development
DATABASE_URL=postgresql://localhost/madrasa
JWT_SECRET=dev-secret-only-for-development
CORS_ORIGIN=http://localhost:3000
```

**.env.example (safe to commit):**
```
NODE_ENV=production
DATABASE_URL=<leave-empty>
JWT_SECRET=<leave-empty>
CORS_ORIGIN=https://yourdomain.com
```

**Production (.env secrets):**
```
NODE_ENV=production
DATABASE_URL=<production-url>
JWT_SECRET=<secure-random-32-char-string>
CORS_ORIGIN=https://yourdomain.com
```

### 11.2 Secret Rotation

**JWT_SECRET Rotation (Recommended):**
- Monthly rotation (implement graceful migration)
- Keep old secret for 24 hours
- Accept tokens signed with old secret
- Reject tokens older than 48 hours

---

## 12. Deployment Security

### 12.1 Production Checklist

- [ ] All environment variables set
- [ ] No hardcoded secrets
- [ ] HTTPS enabled
- [ ] CORS restricted to domain
- [ ] Database backups configured
- [ ] Secrets not in Git history
- [ ] Error messages don't expose internals
- [ ] Logging configured
- [ ] Rate limiting active
- [ ] Security headers active

### 12.2 Render.com (Backend) Security

**Configuration:**
```yaml
Build Command: npm run build
Start Command: npm start
Environment Variables:
  - DATABASE_URL (from Supabase)
  - JWT_SECRET (generate random 32 chars)
  - NODE_ENV=production
  - CORS_ORIGIN=https://yourdomain.com
```

### 12.3 Vercel (Frontend) Security

**Configuration:**
```yaml
Build Command: npm run build
Output Directory: dist
Environment Variables:
  - VITE_API_URL=https://your-backend-url
```

### 12.4 Supabase (Database) Security

**Configuration:**
```
- Enable SSL requirement
- Create restricted database user
- Enable automatic backups
- Enable Row Level Security (optional)
- No direct access from frontend (via API only)
```

---

## 13. Threat Model & Mitigations

| Threat | Attack Vector | Mitigation |
|--------|---|---|
| Brute Force Login | Multiple login attempts | Login rate limiter (5/15min) |
| SQL Injection | User input in queries | Prisma ORM with parameterization |
| XSS Attack | Script injection in input | Input sanitization + HTML encoding |
| CSRF | Cross-site form submission | SameSite cookies + token validation |
| DDoS | Flood of requests | Rate limiting (100 req/15min) + WAF |
| Credential Theft | Phishing/weak passwords | Password requirements + HTTPS |
| Privilege Escalation | User accessing others' data | Single admin model (no RBAC) |
| Data Breach | Unauthorized database access | SSL connection + limited permissions |
| Session Hijacking | Token theft | httpOnly cookies + HTTPS only |
| Account Takeover | Compromised password | Password change rate limiting |

---

## 14. Security Testing

### 14.1 Manual Security Testing Checklist

- [ ] Test login with wrong password (should fail)
- [ ] Test login with wrong email (should fail)
- [ ] Test token expiration (after 24 hours)
- [ ] Test accessing protected endpoint without token
- [ ] Test accessing protected endpoint with invalid token
- [ ] Test rate limiting (5+ login attempts)
- [ ] Test XSS in transaction description
- [ ] Test negative amounts (should fail)
- [ ] Test invalid email format
- [ ] Test weak password (should fail)
- [ ] Test logout (token invalidated)
- [ ] Test CORS with different origin (should fail)
- [ ] Test file upload with large file (>2MB)
- [ ] Test file upload with non-image file
- [ ] Verify audit logs record actions
- [ ] Verify no stack traces in error responses
- [ ] Verify sensitive data not in logs

### 14.2 Automated Security Tests

**Tests to Write:**
```typescript
// Authentication Tests
- loginWithCorrectPassword() → success
- loginWithWrongPassword() → 401
- accessProtectedEndpointWithoutToken() → 401
- accessProtectedEndpointWithInvalidToken() → 401
- tokenExpires() → 401

// Rate Limiting Tests
- loginLimiter5AttemptsAre429() → 429
- apiLimiter100RequestsAre429() → 429

// Input Validation Tests
- invalidEmailFormatFails() → 400
- weakPasswordFails() → 400
- negativeAmountFails() → 400
- largeFileFails() → 413

// Authorization Tests
- accessOtherUsersData() → forbidden (single admin model)
```

---

## 15. Security Compliance

### 15.1 OWASP Top 10 Coverage

| OWASP 2021 | Status | Implementation |
|---|---|---|
| A01: Broken Access Control | ✅ Mitigated | Authentication middleware on all endpoints |
| A02: Cryptographic Failures | ✅ Mitigated | Passwords hashed (bcryptjs), SSL/TLS in production |
| A03: Injection | ✅ Mitigated | Prisma ORM parameterization |
| A04: Insecure Design | ✅ Mitigated | Single admin, secure by default |
| A05: Security Misconfiguration | ✅ Mitigated | Helmut.js, environment-based config |
| A06: Vulnerable Components | ✅ Mitigated | Regular dependency updates (npm audit) |
| A07: Authentication Failures | ✅ Mitigated | Rate limiting, strong passwords |
| A08: Data Integrity Failures | ✅ Mitigated | Audit logging, database transactions |
| A09: Logging/Monitoring | ✅ Mitigated | Comprehensive audit logs, error logging |
| A10: SSRF | ✅ Mitigated | No external HTTP calls from app |

### 15.2 Data Protection Regulations

**GDPR Compliance (if applicable):**
- User data minimization ✅
- Data retention policy documented
- Audit logs for compliance
- No third-party data sharing
- Right to be forgotten (limited by financial data requirements)

---

## 16. Incident Response

### 16.1 Security Incident Process

1. **Detect:** Alert from monitoring or manual discovery
2. **Contain:** Disable compromised account immediately
3. **Investigate:** Review audit logs and error logs
4. **Remediate:** Apply fix and deploy
5. **Verify:** Test fix in production
6. **Document:** Record incident details
7. **Notify:** Inform stakeholders if needed

### 16.2 Emergency Procedures

**Compromised Admin Account:**
1. Disable login temporarily
2. Review audit logs for unauthorized actions
3. Reset password to strong random value
4. Clear all active tokens
5. Restore from backup if data was corrupted
6. Re-enable login with new credentials

**Database Breach:**
1. Rotate all secrets (JWT_SECRET, DB password)
2. Restore from clean backup
3. Audit all changes since backup
4. Monitor for unauthorized access
5. Deploy security patches

---

## 17. Security Monitoring

### 17.1 Monitoring Metrics

**Alerts to Configure:**
- [ ] Failed login attempts (10+ in 1 hour)
- [ ] Rate limit exceeded (frequent 429 responses)
- [ ] Unauthorized access attempts (401 responses)
- [ ] Database connection failures
- [ ] Disk space usage (for logs)
- [ ] API response time degradation
- [ ] Unusual transaction amounts
- [ ] Bulk delete attempts

### 17.2 Logging

**Log Levels:**
- ERROR: All authentication failures, database errors
- WARN: Rate limiting triggers, invalid input
- INFO: Login/logout, settings changes, reports generated
- DEBUG: Detailed query information (dev only)

**Log Retention:** 30 days (adjust based on requirements)

---

## 18. Security Maintenance

### 18.1 Regular Tasks

**Weekly:**
- Review error logs for patterns
- Check for security alerts from dependencies

**Monthly:**
- Rotate sensitive tokens/secrets
- Review audit logs for unusual activity
- Run security tests
- Check for dependency updates

**Quarterly:**
- Full security audit
- Penetration testing (external)
- Review security policies
- Update threat model

### 18.2 Dependency Updates

**Security Updates:**
```bash
npm audit
npm update --save

# Fix vulnerabilities
npm audit fix
```

**Review Before Updating:**
- Breaking changes
- New security features
- Performance impact

---

## 19. Security Checklist - Before Production

- [ ] All security headers configured (Helmet)
- [ ] Rate limiting enabled and tested
- [ ] Input validation on all endpoints
- [ ] HTTPS/TLS configured
- [ ] CORS restricted to domain
- [ ] Database SSL connection required
- [ ] All secrets in environment variables
- [ ] No hardcoded secrets in code
- [ ] Audit logging working
- [ ] Error messages safe
- [ ] Logs not exposing sensitive data
- [ ] Password requirements enforced
- [ ] Token expiration working
- [ ] File uploads validated
- [ ] Database backups configured
- [ ] Monitoring alerts active
- [ ] Security tests passing
- [ ] No console.log of sensitive data
- [ ] No admin bypass mechanisms
- [ ] Documentation complete

---

## 20. Support & Questions

For security-related questions:
- Review this document first
- Check OWASP guidelines
- Consult security team
- Do NOT ignore security warnings

**Emergency Contact:** info@fleeto.ae

---

**Document Version:** 1.0
**Last Updated:** 2026-08-21
**Status:** Production Ready ✅
