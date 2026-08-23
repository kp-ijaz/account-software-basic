import { Request, Response, NextFunction } from 'express';
import auditService from '../services/auditService';
import { AuditLogFilterParams } from '../types/audit';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: AuditLogFilterParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 50,
      action: req.query.action as string,
      module: req.query.module as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      userId: req.query.userId as string,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as 'createdAt' | 'action') || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await auditService.getAuditLogs(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAuditSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await auditService.getAuditLogSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
