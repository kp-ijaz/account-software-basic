import { Router } from 'express';
import { getLedger, getLedgerSummary } from '../controllers/ledgerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get summary (must be before to avoid routing conflict)
router.get('/summary', getLedgerSummary);

// Get ledger
router.get('/', getLedger);

export default router;
