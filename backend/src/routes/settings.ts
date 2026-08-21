import { Router } from 'express';
import { getSettings, updateSettings, uploadLogo } from '../controllers/settingsController';
import { authMiddleware } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get settings
router.get('/', getSettings);

// Update settings
router.put('/', updateSettings);

// Upload logo (rate limited: 10 uploads per hour)
router.post('/logo', uploadLimiter, uploadLogo);

export default router;
