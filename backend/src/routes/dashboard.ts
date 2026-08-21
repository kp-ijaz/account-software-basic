import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get dashboard data
router.get('/', getDashboard);

export default router;
