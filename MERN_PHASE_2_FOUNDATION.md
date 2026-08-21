# Phase 2: MERN Project Foundation Setup

## Objective
Create a working MERN project foundation with all configurations, dependencies, and project structure ready for development.

---

## Step 1: Backend Setup (Node.js + Express + TypeScript)

### 1.1 Create Backend Project
```bash
cd /path/to/project
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express cors helmet dotenv zod axios jsonwebtoken bcryptjs
npm install -D typescript @types/express @types/node ts-node nodemon

# Prisma setup
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### 1.2 TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
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
  "exclude": ["node_modules"]
}
```

### 1.3 Environment Configuration
Create `.env`:
```
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/madrasa_accounting"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

CORS_ORIGIN=http://localhost:3000

BCRYPT_ROUNDS=12

LOG_LEVEL=debug
```

### 1.4 Project Structure Setup
```bash
mkdir -p src/{middleware,controllers,services,routes,types,utils,config}
```

### 1.5 Package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "migrate": "npx prisma migrate dev",
    "migrate:deploy": "npx prisma migrate deploy",
    "prisma:studio": "npx prisma studio"
  }
}
```

---

## Step 2: Frontend Setup (React + TypeScript + Vite)

### 2.1 Create React Project
```bash
cd /path/to/project
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom axios react-redux @reduxjs/toolkit redux-persist
npm install react-hook-form zod @hookform/resolvers recharts jspdf html2canvas
npm install clsx date-fns
npm install -D typescript
```

### 2.2 Environment Configuration
Create `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Madrasa Accounting Software
VITE_APP_VERSION=1.0.0
```

### 2.3 Project Structure
```bash
mkdir -p src/{components,pages,store,services,hooks,types,utils,styles}
mkdir -p src/components/{common,auth,dashboard,income,expense,daybook,ledger,reports,settings,audit}
```

### 2.4 Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### 2.5 Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Step 3: Database Setup (PostgreSQL)

### 3.1 Create Database
```bash
# Using psql
psql -U postgres

# In psql prompt
CREATE DATABASE madrasa_accounting;
CREATE USER madrasa_admin WITH PASSWORD 'secure_password_here';
ALTER ROLE madrasa_admin SET client_encoding TO 'utf8';
ALTER ROLE madrasa_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE madrasa_admin SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE madrasa_accounting TO madrasa_admin;
\q
```

### 3.2 Prisma Schema (prisma/schema.prisma)
See MERN_ARCHITECTURE_PLAN.md for full schema

### 3.3 Initial Migration
```bash
cd backend
npx prisma migrate dev --name init
```

---

## Step 4: Backend Core Setup

### 4.1 Config Files

#### src/config/env.ts
```typescript
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
};

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!env.JWT_SECRET) throw new Error('JWT_SECRET is required');

export default env;
```

#### src/config/database.ts
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export default prisma;
```

### 4.2 Utility Files

#### src/utils/logger.ts
```typescript
import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');

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
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, err);
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
```

#### src/utils/errorHandler.ts
```typescript
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

export const catchAsyncErrors = (fn: Function) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2]);
};
```

#### src/utils/jwt.ts
```typescript
import jwt from 'jsonwebtoken';
import env from '../config/env';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
```

### 4.3 Middleware

#### src/middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'No authentication token provided');
    }

    const { userId } = verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
```

#### src/middleware/errorHandler.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';

export const errorHandlerMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.error(`API Error: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: [],
    });
  }

  logger.error(`Unexpected error: ${err.message}`, err as Error);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
    errors: [],
  });
};
```

### 4.4 Express App Setup (src/app.ts)
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import logger from './utils/logger';

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

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));

// Error handling
app.use(errorHandlerMiddleware);

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

---

## Step 5: Frontend Core Setup

### 5.1 Redux Store Setup

#### src/store/slices/authSlice.ts
```typescript
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setAuthenticated(
      state,
      action: PayloadAction<{
        user: { email: string; username: string };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
```

#### src/store/index.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5.2 API Service

#### src/services/api.ts
```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Include cookies
});

export default API;
```

### 5.3 React Router Setup

#### src/App.tsx
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/common/Layout';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            {/* Other routes */}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
```

#### src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App.tsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
```

### 5.4 Material-UI Theme Setup

#### src/styles/theme.ts
```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green
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
    info: {
      main: '#2196f3',
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
```

---

## Step 6: Verification Checklist

### Backend
- [ ] Backend folder structure created
- [ ] All dependencies installed
- [ ] .env file configured
- [ ] PostgreSQL database created
- [ ] Prisma schema initialized
- [ ] TypeScript config set up
- [ ] Logger utility created
- [ ] JWT utility created
- [ ] Error handler middleware created
- [ ] Express app starts without errors

### Frontend
- [ ] Frontend folder structure created
- [ ] All dependencies installed
- [ ] .env file configured
- [ ] Redux store set up
- [ ] React Router configured
- [ ] Material-UI theme created
- [ ] Vite proxy configured
- [ ] React app starts without errors

### Database
- [ ] PostgreSQL running
- [ ] Database created
- [ ] User created with proper permissions
- [ ] Connection string in .env is correct

---

## Step 7: Running the Project

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Should output: Server running on port 5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Should output: Local: http://localhost:3000
```

### Terminal 3: Database (Optional - for Prisma Studio)
```bash
cd backend
npm run prisma:studio
# Opens: http://localhost:5555
```

---

## Common Issues & Fixes

### Issue: Database connection fails
**Fix:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify connection string in .env
# Format: postgresql://user:password@host:port/database
```

### Issue: Port 5000 already in use
**Fix:**
```bash
# Change PORT in .env to another port (e.g., 5001)
# Update Vite proxy in vite.config.ts
```

### Issue: npm ERR! code ERESOLVE
**Fix:**
```bash
npm install --legacy-peer-deps
```

### Issue: Prisma client out of sync
**Fix:**
```bash
cd backend
npm install
npx prisma generate
```

---

## Next Steps

After this phase is complete and verified:

1. ✅ **Phase 2 Complete:** Foundation set up
2. **Phase 3 Starting:** Database schema with Prisma migrations
3. **Phase 4:** Authentication implementation

**Ready for Phase 3?** ✅

---

**Created:** 2026-08-21
**Status:** Ready for Implementation
