import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errorHandler';

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Validate password strength
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Validate phone number (basic international format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, '')) && phone.length <= 20;
};

// Validate positive decimal amount
export const validateAmount = (amount: any): boolean => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 999999999.99;
};

// Validate date format (YYYY-MM-DD)
export const validateDateFormat = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Validate string length
export const validateStringLength = (
  str: string,
  minLength: number = 1,
  maxLength: number = 500
): boolean => {
  return str.length >= minLength && str.length <= maxLength;
};

// Middleware to validate request body size
export const validateRequestSize = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = req.get('content-length');
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    return next(new ApiError(413, 'Request payload too large'));
  }

  next();
};

// Middleware to sanitize input (basic XSS prevention)
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    sanitizeObject(req.body);
  }

  if (req.query) {
    sanitizeObject(req.query);
  }

  next();
};

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (key === 'logo' && typeof obj[key] === 'string') {
      continue;
    }

    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}
