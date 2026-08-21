import { Router } from 'express';
import {
  getIncomeCategories,
  getExpenseCategories,
  createIncomeCategory,
  createExpenseCategory,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public - Get categories (no auth required for reading)
router.get('/income', getIncomeCategories);
router.get('/expense', getExpenseCategories);

// Protected - Create categories (auth required)
router.post('/income', authMiddleware, createIncomeCategory);
router.post('/expense', authMiddleware, createExpenseCategory);

export default router;
