import rateLimit from 'express-rate-limit';

// General API rate limiter: 1000 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

// Login rate limiter: 20 attempts per 15 minutes per IP (production-safe)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Password change rate limiter: 3 attempts per hour
export const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password change attempts, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter: 10 uploads per hour
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many upload attempts, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});
