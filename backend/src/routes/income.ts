import { Router } from 'express';
import {
  createIncome,
  getIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
} from '../controllers/incomeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get summary (must be before /:id to avoid routing conflict)
router.get('/summary', getIncomeSummary);

// Get all income
router.get('/', getIncomes);

// Create income
router.post('/', createIncome);

// Get single income
router.get('/:id', getIncome);

// Update income
router.put('/:id', updateIncome);

// Delete income
router.delete('/:id', deleteIncome);

export default router;
