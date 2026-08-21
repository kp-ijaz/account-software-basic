import { Router } from 'express';
import {
  login,
  logout,
  changePassword,
  getCurrentUser,
  checkEmail,
  checkUsername,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { loginLimiter, passwordChangeLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// Login (rate limited: 5 attempts per 15 minutes)
router.post('/login', loginLimiter, login);

// Check email availability
router.post('/check-email', checkEmail);

// Check username availability
router.post('/check-username', checkUsername);

/**
 * Protected routes (authentication required)
 */

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Logout
router.post('/logout', authMiddleware, logout);

// Change password (rate limited: 3 attempts per hour)
router.post('/change-password', authMiddleware, passwordChangeLimiter, changePassword);

export default router;
