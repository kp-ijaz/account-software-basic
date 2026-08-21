# Phase 2 — Project Foundation

This is Phase 2 of the Madrasa Accounting Software.

Phase 1 architecture has already been completed.

Now create the actual project foundation.

Do NOT implement accounting features yet.

## Technology
Frontend:
- Flutter
- Dart
- Material 3
- BLoC/Cubit
- Clean Architecture

Backend:
- ASP.NET Core Web API
- Entity Framework Core

Database:
- PostgreSQL

## Tasks

### Flutter
Create the Flutter project.

Set up:
- Clean Architecture
- BLoC/Cubit
- GoRouter
- Dio
- Theme
- Core utilities
- Error handling
- API configuration
- Secure storage foundation

Create a clean folder structure.

### Backend
Create ASP.NET Core Web API.

Set up:
- Dependency Injection
- Controllers
- Services
- Repositories
- DTOs
- Middleware
- Global exception handling
- Logging
- Configuration

### Database
Configure PostgreSQL connection.
Configure Entity Framework Core.
Create the initial DbContext.
Do not create the complete database schema yet.

### Environment Configuration
Create development configuration.
Create `.env.example`.
Do NOT create or commit real secrets.
Production secrets must be environment variables.

### API
Configure:
- Swagger
- CORS
- HTTPS
- Basic health check

### UI
Create only the application shell:
- App theme
- Main navigation structure
- Placeholder Dashboard
- Placeholder pages

Do NOT implement real accounting functionality.

## Quality Requirements
After implementation:
- Flutter must build successfully.
- ASP.NET Core must build successfully.
- API must start successfully.
- PostgreSQL connection must work.
- Swagger must open.
- Flutter must run without errors.

Fix all errors before finishing.

At the end provide:
- Files created
- Files modified
- Commands to run Flutter
- Commands to run backend
- Database setup instructions
- Problems found
- Problems fixed

Then STOP.
