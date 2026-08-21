import { Router } from 'express';
import { getAuditLogs, getAuditSummary } from '../controllers/auditController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get audit summary
router.get('/summary', getAuditSummary);

// Get audit logs
router.get('/', getAuditLogs);

export default router;
