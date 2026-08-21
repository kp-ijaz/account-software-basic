import { Router } from 'express';
import {
  getMonthlyReport,
  getYearlyReport,
  getBalanceSheet,
} from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get monthly report
router.get('/monthly', getMonthlyReport);

// Get yearly report
router.get('/yearly', getYearlyReport);

// Get balance sheet
router.get('/balance-sheet', getBalanceSheet);

export default router;
