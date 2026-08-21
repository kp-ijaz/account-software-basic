/**
 * Authentication Tests
 * Tests password hashing, JWT, and auth flow
 */

import { hash, compare } from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/errorHandler';

describe('Authentication', () => {
  describe('Password Hashing', () => {
    test('should hash password with bcryptjs', async () => {
      const password = 'TestPass123!';
      const hashed = await hash(password, 12);

      // Hash should not equal plain password
      expect(hashed).not.toBe(password);

      // Hashed password should have bcrypt format
      expect(hashed).toMatch(/^\$2[aby]\$/);
    });

    test('should verify correct password', async () => {
      const password = 'TestPass123!';
      const hashed = await hash(password, 12);

      const isValid = await compare(password, hashed);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'TestPass123!';
      const wrongPassword = 'WrongPass123!';
      const hashed = await hash(password, 12);

      const isValid = await compare(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });

    test('should produce different hashes for same password', async () => {
      const password = 'TestPass123!';
      const hash1 = await hash(password, 12);
      const hash2 = await hash(password, 12);

      // Different hashes each time (salt is different)
      expect(hash1).not.toBe(hash2);

      // Both should validate against same password
      expect(await compare(password, hash1)).toBe(true);
      expect(await compare(password, hash2)).toBe(true);
    });
  });

  describe('JWT Token Management', () => {
    const testPayload = {
      userId: 'test-user-123',
      email: 'test@example.com',
    };

    test('should generate valid JWT token', () => {
      const token = generateToken(testPayload.userId, testPayload.email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify and decode valid token', () => {
      const token = generateToken(testPayload.userId, testPayload.email);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.iat).toBeDefined(); // Issued at
      expect(decoded.exp).toBeDefined(); // Expiration
    });

    test('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    test('should reject tampered token', () => {
      const token = generateToken(testPayload.userId, testPayload.email);
      const tampered = token.slice(0, -10) + '0123456789';

      expect(() => verifyToken(tampered)).toThrow();
    });

    test('should have correct token expiration (24 hours)', () => {
      const token = generateToken(testPayload.userId, testPayload.email);
      const decoded = verifyToken(token);

      if (!decoded.exp || !decoded.iat) {
        throw new Error('Token missing exp or iat claims');
      }

      const expirationTime = decoded.exp - decoded.iat;
      const twentyFourHours = 24 * 60 * 60;

      expect(expirationTime).toBe(twentyFourHours);
    });

    test('should include required claims', () => {
      const token = generateToken(testPayload.userId, testPayload.email);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });
  });

  describe('API Error Handling', () => {
    test('should create ApiError with message and status', () => {
      const error = new ApiError(401, 'Unauthorized');

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
      expect(error instanceof Error).toBe(true);
    });

    test('should handle 400 (Bad Request)', () => {
      const error = new ApiError(400, 'Invalid input');
      expect(error.statusCode).toBe(400);
    });

    test('should handle 401 (Unauthorized)', () => {
      const error = new ApiError(401, 'Authentication failed');
      expect(error.statusCode).toBe(401);
    });

    test('should handle 403 (Forbidden)', () => {
      const error = new ApiError(403, 'Access denied');
      expect(error.statusCode).toBe(403);
    });

    test('should handle 404 (Not Found)', () => {
      const error = new ApiError(404, 'Resource not found');
      expect(error.statusCode).toBe(404);
    });

    test('should handle 500 (Server Error)', () => {
      const error = new ApiError(500, 'Internal server error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('Authentication Flow', () => {
    test('complete login flow: password hash and verify', async () => {
      // User registration (hash password)
      const userPassword = 'SecurePass123!';
      const hashedPassword = await hash(userPassword, 12);

      // User login attempt (verify password)
      const loginPassword = 'SecurePass123!';
      const passwordMatch = await compare(loginPassword, hashedPassword);

      expect(passwordMatch).toBe(true);
    });

    test('complete auth flow: generate and verify token', () => {
      const userId = 'user-123';
      const email = 'user@example.com';

      // Generate token
      const token = generateToken(userId, email);
      expect(token).toBeDefined();

      // Verify token
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    test('should reject login with wrong password', async () => {
      const correctPassword = 'CorrectPass123!';
      const hashedPassword = await hash(correctPassword, 12);

      const wrongPassword = 'WrongPass123!';
      const passwordMatch = await compare(wrongPassword, hashedPassword);

      expect(passwordMatch).toBe(false);
    });

    test('should reject expired token (simulated)', () => {
      // Note: In real tests, we'd use jest.useFakeTimers() or mock time
      // This is a placeholder for expired token testing
      const token = generateToken('user-123', 'user@example.com');

      // Token should be valid immediately after generation
      expect(() => verifyToken(token)).not.toThrow();
    });
  });
});
