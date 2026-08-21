import { Request, Response, NextFunction } from 'express';
import ledgerService from '../services/ledgerService';
import { LedgerRequest } from '../types/ledger';

export const getLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: LedgerRequest = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 50,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      categoryId: req.query.categoryId as string,
      transactionType: req.query.transactionType as 'INCOME' | 'EXPENSE',
      search: req.query.search as string,
      sortBy: (req.query.sortBy as 'date' | 'balance') || 'date',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await ledgerService.getLedger(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getLedgerSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const summary = await ledgerService.getLedgerSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
