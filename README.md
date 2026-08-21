# Madrasa Accounting Software

A modern, simple, and secure accounting management application designed specifically for Madrasas (Islamic educational institutions).

## Features

- 📊 Dashboard with key metrics
- 💰 Income management
- 💸 Expense tracking
- 📖 Day Book & Ledger
- 📋 Reports & Analytics
- ⚙️ Settings management
- 🔐 Secure authentication
- 📱 Responsive design (Mobile, Tablet, Desktop)

## Technology Stack

### Frontend
- Flutter
- Dart
- Material 3 Design
- BLoC/Cubit Architecture
- Clean Architecture

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL Database
- JWT Authentication

## Project Structure

```
├── flutter_app/          # Flutter frontend application
├── backend/              # ASP.NET Core backend API
└── docs/                 # Documentation
```

## Getting Started

### Prerequisites
- Flutter SDK (latest)
- .NET 6.0 or higher
- PostgreSQL 12+

### Installation

1. Clone the repository
```bash
git clone https://github.com/kp-ijaz/account-software-basic.git
cd account-software-basic
```

2. Setup Flutter App
```bash
cd flutter_app
flutter pub get
flutter run
```

3. Setup Backend
```bash
cd backend
dotnet restore
dotnet run
```

## Design System

See `DESIGN_GUIDE.md` for comprehensive design documentation including:
- Design tokens and spacing scale
- Responsive breakpoints
- Component library
- Best practices

## Security

This application implements industry-standard security practices:
- HTTPS encryption
- Secure password hashing
- JWT token authentication
- Input validation
- SQL injection protection
- Rate limiting
- CORS restrictions

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with meaningful messages
4. Push to the repository
5. Create a Pull Request

## License

Private Project

## Support

For support, contact: ijaz@royex.net

---

**Built with ❤️ for Madrasas**
