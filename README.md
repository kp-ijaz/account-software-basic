# Madrasa Accounting Software - MERN Stack

A modern, simple, secure, and professional accounting management application designed specifically for Madrasas (Islamic educational institutions).

Built with **MERN Stack** (MongoDB/PostgreSQL, Express.js, React, Node.js) for superior performance, maintainability, and scalability.

## 🎯 Features

- 📊 **Dashboard** - Real-time financial overview with charts
- 💰 **Income Management** - Track income from multiple sources
- 💸 **Expense Tracking** - Organize and categorize expenses
- 📖 **Day Book & Ledger** - Complete transaction history with running balance
- 📋 **Reports** - Monthly, yearly, and balance sheet reports with PDF export
- ⚙️ **Settings** - Madrasa configuration and customization
- 🔐 **Secure Authentication** - JWT-based authentication with password hashing
- 📱 **Responsive Design** - Works on web and desktop (Electron)
- 🔍 **Audit Log** - Complete audit trail of all financial transactions
- 📊 **Financial Calculations** - Accurate accounting with database transactions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Lightning-fast build tool
- **Electron** - Desktop application wrapper

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - Modern ORM
- **PostgreSQL 14+** - Production database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers

### Database
- **PostgreSQL 14+** - Reliable, ACID-compliant database
- **Prisma Migrations** - Database versioning
- **Connection Pooling** - Optimized performance

## 📁 Project Structure

```
Accounting software/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── middleware/        # Auth, error handling
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── utils/             # Helper functions
│   │   ├── config/            # Configuration
│   │   └── app.ts             # Express setup
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── styles/            # Styling
│   │   ├── App.tsx            # Main app
│   │   └── main.tsx           # Entry point
│   ├── electron/              # Desktop app
│   ├── .env                   # Environment variables
│   └── vite.config.ts         # Build config
│
├── MERN_QUICK_START.md        # Quick setup guide
├── MERN_ARCHITECTURE_PLAN.md  # Complete architecture
├── MERN_PHASE_2_FOUNDATION.md # Foundation setup
└── MERN_CONVERSION_SUMMARY.md # Stack conversion details
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** 
- **npm 9+**
- **PostgreSQL 14+**

### Installation (Under 1 Hour)

See **[MERN_QUICK_START.md](./MERN_QUICK_START.md)** for complete step-by-step instructions.

#### Quick Setup:

1. **Setup Database**
```bash
psql -U postgres
CREATE DATABASE madrasa_accounting;
CREATE USER madrasa_admin WITH PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE madrasa_accounting TO madrasa_admin;
\q
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
# API running on http://localhost:5000
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

4. **Verify Setup**
```bash
curl http://localhost:5000/api/health
# Response: { "status": "OK", ... }
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [MERN_QUICK_START.md](./MERN_QUICK_START.md) | Step-by-step setup guide |
| [MERN_ARCHITECTURE_PLAN.md](./MERN_ARCHITECTURE_PLAN.md) | Complete technical architecture |
| [MERN_PHASE_2_FOUNDATION.md](./MERN_PHASE_2_FOUNDATION.md) | Detailed configuration guide |
| [MERN_CONVERSION_SUMMARY.md](./MERN_CONVERSION_SUMMARY.md) | Stack conversion overview |

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT token-based authentication
- Secure password hashing (bcryptjs)
- Token expiration (24 hours)
- Refresh token mechanism

✅ **API Security**
- Helmet security headers
- CORS protection
- Rate limiting
- Input validation (Zod)
- Request size limits

✅ **Database Security**
- Parameterized queries (Prisma ORM)
- Connection pooling
- Encrypted credentials
- Audit logging

✅ **Data Protection**
- No sensitive data in logs
- SQL injection prevention
- XSS protection (React escapes)
- CSRF protection ready

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login
POST   /api/auth/logout             - Logout
POST   /api/auth/refresh            - Refresh token
POST   /api/auth/change-password    - Change password
```

### Income & Expense
```
GET    /api/income                  - List income
POST   /api/income                  - Create income
PUT    /api/income/:id              - Update income
DELETE /api/income/:id              - Delete income

GET    /api/expense                 - List expense
POST   /api/expense                 - Create expense
PUT    /api/expense/:id             - Update expense
DELETE /api/expense/:id             - Delete expense
```

### Reports & Settings
```
GET    /api/reports/monthly         - Monthly report
GET    /api/reports/yearly          - Yearly report
GET    /api/reports/balance-sheet   - Balance sheet
GET    /api/settings                - Get settings
PUT    /api/settings                - Update settings
```

### Audit & Health
```
GET    /api/audit                   - Audit logs
GET    /api/health                  - Health check
```

## 🎨 Design System

- Material-UI (MUI) for consistent, professional components
- Green accent color (#2e7d32) for trust and finance
- Clean, minimalist layout suitable for accounting
- Responsive design for desktop, tablet, and mobile
- Dark mode ready

## 🧪 Testing

Backend testing with Jest:
```bash
cd backend
npm test
```

Frontend testing with React Testing Library:
```bash
cd frontend
npm test
```

## 🌐 Deployment

### Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database Studio (optional)
cd backend && npm run studio
```

### Production

**Backend:** Render, Railway, or AWS
**Frontend:** Vercel, Netlify, or AWS S3 + CloudFront
**Database:** Supabase or Render PostgreSQL
**CI/CD:** GitHub Actions

See [MERN_CONVERSION_SUMMARY.md](./MERN_CONVERSION_SUMMARY.md#deployment-architecture) for deployment details.

## 📋 Implementation Phases

| Phase | Task | Status |
|-------|------|--------|
| 1 | Architecture & Planning | ✅ Complete |
| 2 | Project Foundation | ✅ Ready |
| 3 | Database Schema | 🔄 Next |
| 4 | Authentication | 📋 Planned |
| 5 | Income Module | 📋 Planned |
| 6 | Expense Module | 📋 Planned |
| 7 | Day Book & Ledger | 📋 Planned |
| 8 | Dashboard | 📋 Planned |
| 9 | Reports & PDF | 📋 Planned |
| 10 | Audit Log | 📋 Planned |
| 11 | Security Review | 📋 Planned |
| 12 | Testing | 📋 Planned |
| 13 | UI/UX Polish | 📋 Planned |
| 14 | Production Deployment | 📋 Planned |

**Total Estimated Time:** 3-4 weeks

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env to 5001
# Update vite.config.ts proxy
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check DATABASE_URL format in .env
```

### npm Dependencies Error
```bash
npm install --legacy-peer-deps
```

### Prisma Client Out of Sync
```bash
npx prisma generate
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to repository
git push origin feature/your-feature

# Create Pull Request on GitHub
```

## 📝 Environment Variables

### Backend `.env`
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/madrasa_accounting
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Madrasa Accounting Software
VITE_APP_VERSION=1.0.0
```

## 📄 License

Private Project - All Rights Reserved

## 💬 Support

For questions or issues:
- Review the documentation files
- Check the troubleshooting section
- Contact: info@fleeto.ae

---

## Stack Conversion Details

This project was originally built with Flutter + ASP.NET Core. It has been converted to **MERN Stack** for:
- ✅ Unified JavaScript ecosystem
- ✅ Professional React + Material-UI design
- ✅ Better type safety with TypeScript
- ✅ Easier deployment and scaling
- ✅ Larger developer community
- ✅ Modern development experience

See [MERN_CONVERSION_SUMMARY.md](./MERN_CONVERSION_SUMMARY.md) for complete details.

---

**Built with ❤️ for Madrasas | MERN Stack | 2026**

🚀 **Ready to build? Start with [MERN_QUICK_START.md](./MERN_QUICK_START.md)**
