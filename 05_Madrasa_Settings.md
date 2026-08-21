# Phase 5 — Madrasa Settings

Implement ONLY the Settings module.

The Admin should be able to configure:
- Madrasa Name
- Logo
- Address
- Phone Number
- Currency
- Financial Year

## Backend
Create:
- DTO
- Repository
- Service
- Controller
- Validation

Protect the API with authentication.

## Flutter
Create:
- Settings screen
- Settings BLoC/Cubit
- Form validation
- Save functionality
- Logo upload if required

The UI must be extremely simple.

Use:
- Clean form
- Large fields
- Clear Save button
- Success/error messages

## Security
Validate all settings on the backend.

If logo upload is implemented:
- Validate file type
- Validate file size
- Generate safe file names
- Do not trust uploaded file names

Test:
- Load settings
- Update settings
- Invalid values
- Unauthorized request

Then STOP.
