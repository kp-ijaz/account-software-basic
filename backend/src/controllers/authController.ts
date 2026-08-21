import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import userService from '../services/userService';
import { ApiError } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

/**
 * Login controller
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Call auth service
    const result = await authService.login({ email, password });

    // Set cookie with token
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout controller
 * POST /api/auth/logout
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Call auth service
    if (req.userId && req.userEmail) {
      await authService.logout(req.userId, req.userEmail);
    }

    // Clear cookie
    res.clearCookie('token');

    // Return response
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password controller
 * POST /api/auth/change-password
 */
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new ApiError(
        400,
        'Current password and new password are required'
      );
    }

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    // Call service
    await userService.changePassword(userId, currentPassword, newPassword);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user controller
 * GET /api/auth/me
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    // Find user
    const user = await userService.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Return user without password
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check email availability
 * POST /api/auth/check-email
 */
export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    const available = await authService.isEmailAvailable(email);

    res.status(200).json({
      success: true,
      data: { available },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check username availability
 * POST /api/auth/check-username
 */
export const checkUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;

    if (!username) {
      throw new ApiError(400, 'Username is required');
    }

    const available = await authService.isUsernameAvailable(username);

    res.status(200).json({
      success: true,
      data: { available },
    });
  } catch (error) {
    next(error);
  }
};
