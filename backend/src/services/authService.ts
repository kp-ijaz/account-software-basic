import userService from './userService';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/errorHandler';
import prisma from '../config/database';
import logger from '../utils/logger';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(input: LoginInput): Promise<LoginOutput> {
    try {
      // Validate input
      if (!input.email || !input.password) {
        throw new ApiError(400, 'Email and password are required');
      }

      // Find user by email
      const user = await userService.findByEmail(input.email);

      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${input.email}`);
        throw new ApiError(401, 'Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await userService.verifyPassword(
        input.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        logger.warn(`Failed login attempt for user: ${input.email}`);
        throw new ApiError(401, 'Invalid email or password');
      }

      // Generate token
      const token = generateToken(user.id, user.email);

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN',
          description: `User logged in: ${user.email}`,
          userId: user.id,
        },
      });

      logger.info(`User logged in: ${user.email}`);

      // Return user and token (without password)
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error during login', error as Error);
      throw new ApiError(500, 'Login failed');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string, userEmail: string): Promise<void> {
    try {
      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'LOGOUT',
          description: `User logged out: ${userEmail}`,
          userId,
        },
      });

      logger.info(`User logged out: ${userEmail}`);
    } catch (error) {
      logger.error('Error during logout', error as Error);
      // Don't throw error for logout, just log it
    }
  }

  /**
   * Verify if email is available
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const user = await userService.findByEmail(email);
      return !user;
    } catch {
      return false;
    }
  }

  /**
   * Verify if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      return !user;
    } catch {
      return false;
    }
  }

  /**
   * Check database connection
   */
  async checkDatabaseConnection(): Promise<{
    connected: boolean;
    timestamp: string;
    userCount?: number;
  }> {
    try {
      // Try to count users to verify connection
      const userCount = await prisma.user.count();

      return {
        connected: true,
        timestamp: new Date().toISOString(),
        userCount,
      };
    } catch (error) {
      logger.error('Database connection check failed', error as Error);
      throw new ApiError(503, 'Database connection failed');
    }
  }

  /**
   * Create admin user (only allowed if no users exist yet)
   */
  async createAdminUser(input: {
    email: string;
    username: string;
    password: string;
  }): Promise<{
    id: string;
    email: string;
    username: string;
  }> {
    try {
      // Check if any users already exist
      const existingUserCount = await prisma.user.count();
      if (existingUserCount > 0) {
        throw new ApiError(
          403,
          'Admin user already exists. Only one admin account is allowed.'
        );
      }

      // Create user via userService
      const user = await userService.createUser(input);

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_USER_CREATED',
          description: `Admin user created: ${input.email}`,
          userId: user.id,
        },
      });

      logger.info(`Admin user created: ${input.email}`);

      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error creating admin user', error as Error);
      throw new ApiError(500, 'Failed to create admin user');
    }
  }
}

export default new AuthService();
