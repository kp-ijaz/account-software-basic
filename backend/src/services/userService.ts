import bcryptjs from 'bcryptjs';
import prisma from '../config/database';
import { ApiError } from '../utils/errorHandler';
import env from '../config/env';
import logger from '../utils/logger';

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  username: string;
}

class UserService {
  /**
   * Create a new user with hashed password
   */
  async createUser(input: CreateUserInput): Promise<UserWithoutPassword> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { username: input.username }],
        },
      });

      if (existingUser) {
        throw new ApiError(
          400,
          'User with this email or username already exists'
        );
      }

      // Validate password
      if (input.password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(
        input.password,
        env.BCRYPT_ROUNDS
      );

      // Create user
      const user = await prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          passwordHash,
        },
      });

      logger.info(`User created: ${user.email}`);

      // Return user without password
      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error creating user', error as Error);
      throw new ApiError(500, 'Failed to create user');
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      logger.error('Error finding user by email', error as Error);
      return null;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      logger.error('Error finding user by ID', error as Error);
      return null;
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    try {
      return await bcryptjs.compare(password, passwordHash);
    } catch (error) {
      logger.error('Error verifying password', error as Error);
      return false;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Validate new password
      if (newPassword.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
      }

      if (currentPassword === newPassword) {
        throw new ApiError(400, 'New password must be different from current password');
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Verify current password
      const isPasswordValid = await this.verifyPassword(
        currentPassword,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcryptjs.hash(
        newPassword,
        env.BCRYPT_ROUNDS
      );

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      logger.info(`Password changed for user: ${user.email}`);

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'PASSWORD_CHANGED',
          description: `Password changed for user ${user.email}`,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error changing password', error as Error);
      throw new ApiError(500, 'Failed to change password');
    }
  }

  /**
   * Remove password from user object
   */
  private sanitizeUser(user: any): UserWithoutPassword {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UserService();
