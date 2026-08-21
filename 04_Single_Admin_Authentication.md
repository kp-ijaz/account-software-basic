# Phase 4 — Single Admin Authentication

This is Phase 4 of the Madrasa Accounting Software.

The database is already implemented.

Now implement ONLY the authentication system.

There is exactly ONE Admin.

Do NOT implement:
- Staff
- Roles
- Permissions
- Registration
- Multiple users
- User management

## Authentication
Implement:
- Admin login
- Logout
- Change password
- Token expiration

Use secure password hashing.
Never store plain-text passwords.

## Security
Implement:
- JWT or equivalent secure authentication
- Token expiration
- Secure password hashing
- Login rate limiting
- Brute-force protection
- Secure error responses
- HTTPS-ready configuration
- Environment variables for secrets

Never hardcode:
- Password
- JWT secret
- Database password

## API
Create:
POST /api/auth/login
POST /api/auth/change-password
POST /api/auth/logout
GET /api/auth/me

Protect all private endpoints.
Only login should be publicly accessible.

## Flutter
Create:
- Login screen
- Login BLoC/Cubit
- Secure token storage
- Logout
- Auth state handling
- Protected routes

Store authentication tokens using secure storage.
Do not store passwords.

## Testing
Test:
- Correct login
- Incorrect password
- Empty credentials
- Expired token
- Missing token
- Logout
- Change password
- Repeated failed login attempts

Fix all security issues.

At the end report:
- Authentication architecture
- API endpoints
- Security measures
- Flutter authentication flow
- Tests performed

Then STOP.
