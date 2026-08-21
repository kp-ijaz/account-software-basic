import { Router } from 'express';
import { getDayBook, getDayBookSummary } from '../controllers/dayBookController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get summary (must be before to avoid routing conflict)
router.get('/summary', getDayBookSummary);

// Get day book
router.get('/', getDayBook);

export default router;
