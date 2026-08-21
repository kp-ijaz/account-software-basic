/**
 * Jest Setup File
 * Runs before all tests
 */

// Suppress console output during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/madrasa_test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only-32-chars-min';
process.env.CORS_ORIGIN = 'http://localhost:3000';
