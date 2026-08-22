import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import env from './config/env';
import { errorHandlerMiddleware, notFoundMiddleware } from './middleware/errorHandler';
import { apiLimiter, loginLimiter, uploadLimiter } from './middleware/rateLimiter';
import { validateRequestSize, sanitizeInput } from './middleware/validation';
import logger from './utils/logger';
import authRoutes from './routes/auth';
import incomeRoutes from './routes/income';
import expenseRoutes from './routes/expense';
import dayBookRoutes from './routes/daybook';
import ledgerRoutes from './routes/ledger';
import dashboardRoutes from './routes/dashboard';
import reportRoutes from './routes/reports';
import auditRoutes from './routes/audit';
import settingsRoutes from './routes/settings';
import categoryRoutes from './routes/categories';

const app = express();

// ===== Trust Proxy (required for Vercel and rate limiting) =====
app.set('trust proxy', 1);

// ===== Security Headers Middleware =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

// ===== Compression Middleware =====
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

// ===== Request Validation Middleware =====
app.use(validateRequestSize);
app.use(sanitizeInput);

// ===== Body Parsing Middleware =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ===== Rate Limiting Middleware =====
app.use('/api/', apiLimiter);

// ===== Health Check Endpoints =====
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.get('/api/version', (req: Request, res: Response) => {
  res.json({
    version: '1.0.0',
    name: 'Madrasa Accounting Software',
    environment: env.NODE_ENV,
  });
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/daybook', dayBookRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/categories', categoryRoutes);

// ===== 404 Handler =====
app.use(notFoundMiddleware);

// ===== Error Handling Middleware =====
app.use(errorHandlerMiddleware);

export default app;
