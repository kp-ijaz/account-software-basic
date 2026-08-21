import { Router } from 'express';
import {
  createExpense,
  getExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from '../controllers/expenseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get summary (must be before /:id to avoid routing conflict)
router.get('/summary', getExpenseSummary);

// Get all expenses
router.get('/', getExpenses);

// Create expense
router.post('/', createExpense);

// Get single expense
router.get('/:id', getExpense);

// Update expense
router.put('/:id', updateExpense);

// Delete expense
router.delete('/:id', deleteExpense);

export default router;
