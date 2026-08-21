# MERN Stack - Quick Start Implementation Guide

## 🚀 Start Building the Madrasa Accounting Software (MERN Stack)

This guide will get you from **zero to running** in under 1 hour.

---

## Prerequisites

Ensure you have installed:
- **Node.js 18+** → `node --version`
- **npm 9+** → `npm --version`
- **PostgreSQL 14+** → `psql --version`
- **Git** → `git --version`

---

## Part 1: Database Setup (10 minutes)

### 1.1 Start PostgreSQL
```bash
# macOS with Homebrew
brew services start postgresql

# Or verify it's running
psql -U postgres -c "SELECT version();"
```

### 1.2 Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Execute these commands:
CREATE DATABASE madrasa_accounting;
CREATE USER madrasa_admin WITH PASSWORD 'SecurePass123!';
ALTER ROLE madrasa_admin SET client_encoding TO 'utf8';
ALTER ROLE madrasa_admin SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE madrasa_accounting TO madrasa_admin;

# Exit
\q
```

### 1.3 Verify Connection
```bash
psql -U madrasa_admin -d madrasa_accounting -c "SELECT version();"
# Should return PostgreSQL version
```

---

## Part 2: Backend Setup (15 minutes)

### 2.1 Initialize Backend Project
```bash
cd /Users/royextechnologies/Royex\ projects/Accounting\ software

# Create backend folder
mkdir backend
cd backend

# Initialize Node project
npm init -y

# Update package.json
cat > package.json << 'EOF'
{
  "name": "madrasa-accounting-backend",
  "version": "1.0.0",
  "description": "Madrasa Accounting Software Backend",
  "main": "dist/app.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec node --loader ts-node/esm src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "migrate": "npx prisma migrate dev",
    "migrate:deploy": "npx prisma migrate deploy",
    "seed": "ts-node src/seed.ts",
    "studio": "npx prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "axios": "^1.5.0",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.1.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/node": "^20.8.0",
    "@types/jsonwebtoken": "^9.0.4",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "prisma": "^5.0.0"
  }
}
EOF
```

### 2.2 Install Dependencies
```bash
npm install

# This installs all backend dependencies
```

### 2.3 Create Directory Structure
```bash
mkdir -p src/{middleware,controllers,services,routes,types,utils,config}
mkdir -p logs prisma/migrations
```

### 2.4 Create Environment File
```bash
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://madrasa_admin:SecurePass123!@localhost:5432/madrasa_accounting"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=24h

CORS_ORIGIN=http://localhost:3000

BCRYPT_ROUNDS=12
LOG_LEVEL=debug
EOF
```

### 2.5 Create TypeScript Config
```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

### 2.6 Initialize Prisma
```bash
npx prisma init

# This creates prisma/schema.prisma
```

### 2.7 Create Prisma Schema
```bash
cat > prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

model Settings {
  id                String    @id @default(cuid())
  madrasaName       String    @default("Madrasa")
  logo              String?
  address           String?
  phone             String?
  currency          String    @default("USD")
  financialYearStart Int      @default(1)
  openingBalance    Decimal   @db.Decimal(15, 2) @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model IncomeCategory {
  id            String    @id @default(cuid())
  name          String    @unique
  description   String?
  isDefault     Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([name])
}

model ExpenseCategory {
  id            String    @id @default(cuid())
  name          String    @unique
  description   String?
  isDefault     Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([name])
}

model Transaction {
  id                String      @id @default(cuid())
  type              String      // INCOME or EXPENSE
  date              DateTime
  description       String
  amount            Decimal     @db.Decimal(15, 2)
  paymentMethod     String      // CASH or BANK
  reference         String?
  
  incomeCategoryId  String?
  incomeCategory    IncomeCategory?   @relation(fields: [incomeCategoryId], references: [id], onDelete: SetNull)
  
  expenseCategoryId String?
  expenseCategory   ExpenseCategory?  @relation(fields: [expenseCategoryId], references: [id], onDelete: SetNull)
  
  notes             String?
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  auditLogs         AuditLog[]
  
  @@index([date])
  @@index([type])
  @@index([incomeCategoryId])
  @@index([expenseCategoryId])
}

model AuditLog {
  id            String    @id @default(cuid())
  action        String    // LOGIN, LOGOUT, CREATE, UPDATE, DELETE
  description   String
  userId        String?
  tableName     String?
  recordId      String?
  
  oldValues     Json?
  newValues     Json?
  
  transactionId String?
  transaction   Transaction? @relation(fields: [transactionId], references: [id], onDelete: SetNull)
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime  @default(now())
  
  @@index([action])
  @@index([createdAt])
  @@index([userId])
}
EOF
```

### 2.8 Run Prisma Migration
```bash
npm run migrate

# Follow prompts to name migration "init"
# This creates the database schema
```

### 2.9 Create Core Backend Files

#### src/config/env.ts
```bash
cat > src/config/env.ts << 'EOF'
import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
};

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}
if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

export default env;
EOF
```

#### src/config/database.ts
```bash
cat > src/config/database.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export default prisma;
EOF
```

#### src/utils/logger.ts
```bash
cat > src/utils/logger.ts << 'EOF'
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

class Logger {
  private ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  info(message: string) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    this.logToFile(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, err?: Error) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, err?.message);
    this.logToFile(`[ERROR] ${new Date().toISOString()} - ${message} ${err?.message}`);
  }

  warn(message: string) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    this.logToFile(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  private logToFile(message: string) {
    this.ensureLogsDir();
    const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, message + '\n');
  }
}

export default new Logger();
EOF
```

#### src/utils/errorHandler.ts
```bash
cat > src/utils/errorHandler.ts << 'EOF'
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
EOF
```

#### src/app.ts
```bash
cat > src/app.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import logger from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', environment: env.NODE_ENV });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`📡 API: http://localhost:${PORT}/api`);
});

export default app;
EOF
```

### 2.10 Test Backend Startup
```bash
npm run dev

# Expected output:
# ✅ Server running on port 5000
# 📡 API: http://localhost:5000/api

# Visit: http://localhost:5000/api/health
```

✅ **Backend is running!**

---

## Part 3: Frontend Setup (15 minutes)

### 3.1 Create React Project
```bash
cd /Users/royextechnologies/Royex\ projects/Accounting\ software

npm create vite@latest frontend -- --template react-ts

# Follow prompts
cd frontend
npm install
```

### 3.2 Install Frontend Dependencies
```bash
npm install \
  @mui/material @emotion/react @emotion/styled @mui/icons-material \
  react-router-dom \
  axios \
  react-redux @reduxjs/toolkit redux-persist \
  react-hook-form zod @hookform/resolvers \
  recharts jspdf html2canvas \
  clsx date-fns

npm install -D @types/react-dom
```

### 3.3 Create Environment File
```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Madrasa Accounting Software
VITE_APP_VERSION=1.0.0
EOF
```

### 3.4 Create Folder Structure
```bash
mkdir -p src/{components,pages,store,services,hooks,types,utils,styles}
mkdir -p src/components/{common,auth,dashboard,income,expense,daybook,ledger,reports,settings,audit}
```

### 3.5 Create Vite Config
```bash
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
EOF
```

### 3.6 Create Redux Store
```bash
mkdir -p src/store/slices

cat > src/store/slices/authSlice.ts << 'EOF'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; username: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<{ user: { email: string; username: string }; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
EOF

cat > src/store/index.ts << 'EOF'
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
EOF
```

### 3.7 Create React App Structure
```bash
cat > src/App.tsx << 'EOF'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { theme } from './styles/theme';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<div>Welcome to Madrasa Accounting</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
EOF

cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.tsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
EOF

cat > src/styles/global.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
}
EOF

cat > src/styles/theme.ts << 'EOF'
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#66bb6a',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#1976d2',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
});
EOF
```

### 3.8 Test Frontend Startup
```bash
npm run dev

# Expected output:
# VITE v... ready in ... ms
# Local: http://localhost:3000
```

✅ **Frontend is running!**

---

## Part 4: Verification

### 4.1 Check Everything Works

**Backend Health:**
```bash
curl http://localhost:5000/api/health
# Response: { "status": "OK", "timestamp": "..." }
```

**Database:**
```bash
# Terminal 3
cd backend
npm run studio

# Opens Prisma Studio at http://localhost:5555
```

**Frontend:**
- Open http://localhost:3000 in browser
- Should see welcome page

---

## Part 5: What's Next?

### Immediate Next Steps:

1. ✅ **Phase 1 Complete:** Architecture and foundation
2. ✅ **Phase 2 Complete:** Project setup
3. **Phase 3 Coming:** Authentication implementation
4. **Phase 4 Coming:** Income/Expense modules
5. **Phase 5 Coming:** Dashboard & Reports

---

## Folder Structure Summary

```
Accounting software/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── MERN_ARCHITECTURE_PLAN.md
├── MERN_PHASE_2_FOUNDATION.md
└── MERN_QUICK_START.md
```

---

## Troubleshooting

### Port already in use
```bash
# Change PORT in backend .env to 5001
# Update frontend vite.config.ts proxy
```

### Database connection error
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check .env DATABASE_URL format
```

### npm install issues
```bash
npm install --legacy-peer-deps
```

---

**🎉 You now have a working MERN foundation for Madrasa Accounting Software!**

Next: Start Phase 3 - Authentication & Login System

---

Created: 2026-08-21
Ready to build!
