/**
 * Validation Middleware Tests
 * Tests all input validation functions
 */

import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateAmount,
  validateDateFormat,
  validateStringLength,
} from '../middleware/validation';

describe('Input Validation', () => {
  describe('Email Validation', () => {
    test('should accept valid email', () => {
      expect(validateEmail('admin@madrasa.local')).toBe(true);
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
    });

    test('should reject email exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toBe(false);
    });

    test('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    test('should accept strong password', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject password less than 8 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    test('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    test('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    test('should reject password without number', () => {
      const result = validatePassword('NoNumbers!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    test('should reject password without special character', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&*)');
    });

    test('should return multiple errors for very weak password', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('Phone Number Validation', () => {
    test('should accept valid phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1 (234) 567-8900')).toBe(true);
      expect(validatePhone('+971501234567')).toBe(true); // UAE number
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    test('should reject phone exceeding max length', () => {
      const longPhone = '+1234567890'.repeat(5);
      expect(validatePhone(longPhone)).toBe(false);
    });
  });

  describe('Amount Validation', () => {
    test('should accept valid positive amounts', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(100.5)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
      expect(validateAmount('100.50')).toBe(true);
      expect(validateAmount(999999999.99)).toBe(true);
    });

    test('should reject zero and negative amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-100)).toBe(false);
      expect(validateAmount('-100.50')).toBe(false);
    });

    test('should reject amount exceeding maximum', () => {
      expect(validateAmount(1000000000)).toBe(false);
    });

    test('should reject non-numeric values', () => {
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('100abc')).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });

    test('should reject undefined and null', () => {
      expect(validateAmount(undefined)).toBe(false);
      expect(validateAmount(null)).toBe(false);
    });
  });

  describe('Date Format Validation', () => {
    test('should accept valid dates in YYYY-MM-DD format', () => {
      expect(validateDateFormat('2026-08-22')).toBe(true);
      expect(validateDateFormat('2026-01-01')).toBe(true);
      expect(validateDateFormat('2026-12-31')).toBe(true);
    });

    test('should reject invalid date formats', () => {
      expect(validateDateFormat('08-22-2026')).toBe(false);
      expect(validateDateFormat('2026/08/22')).toBe(false);
      expect(validateDateFormat('22-08-2026')).toBe(false);
    });

    test('should reject invalid dates', () => {
      expect(validateDateFormat('2026-13-01')).toBe(false); // Invalid month
      expect(validateDateFormat('2026-02-30')).toBe(false); // Invalid day
    });

    test('should reject empty string', () => {
      expect(validateDateFormat('')).toBe(false);
    });
  });

  describe('String Length Validation', () => {
    test('should accept strings within length constraints', () => {
      expect(validateStringLength('Hello', 1, 10)).toBe(true);
      expect(validateStringLength('A', 1, 500)).toBe(true);
      expect(validateStringLength('Lorem ipsum dolor sit', 5, 100)).toBe(true);
    });

    test('should reject strings shorter than minimum', () => {
      expect(validateStringLength('Hi', 3, 10)).toBe(false);
      expect(validateStringLength('', 1, 10)).toBe(false);
    });

    test('should reject strings longer than maximum', () => {
      expect(validateStringLength('Hello World', 1, 5)).toBe(false);
    });

    test('should use default min/max if not specified', () => {
      expect(validateStringLength('Valid')).toBe(true);
      expect(validateStringLength('')).toBe(false);
    });
  });
});
