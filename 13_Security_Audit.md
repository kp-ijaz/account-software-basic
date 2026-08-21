# Phase 13 — Complete Security Audit

Do NOT add new features in this phase.

Perform a complete security audit of the existing application.

Check:

## Authentication
- Password hashing
- Token expiration
- Secure token storage
- Login rate limiting
- Brute-force protection

## API
- Authentication
- Authorization
- Input validation
- SQL injection
- CORS
- Request validation
- Error handling
- Rate limiting

## Database
- Credentials
- Permissions
- SQL injection
- Constraints
- Financial data integrity

## Secrets
Search the entire project for:
- Passwords
- API keys
- JWT secrets
- Database URLs
- Tokens
- Private keys

Make sure none are hardcoded.

## Flutter
Check:
- Secure token storage
- No sensitive information in logs
- No database credentials
- No secrets
- Proper logout

## Financial Security
Verify:
- Client cannot modify calculated balances
- Client cannot bypass validation
- Financial transactions use database transactions
- Partial transactions cannot be saved
- Audit records cannot be manipulated from the UI

Fix every security issue discovered.

Do not proceed until the application passes this review.

Then provide a security audit report and STOP.
