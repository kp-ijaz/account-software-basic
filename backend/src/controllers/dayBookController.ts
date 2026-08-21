import { Request, Response, NextFunction } from 'express';
import dayBookService from '../services/dayBookService';
import { DayBookRequest } from '../types/daybook';
import { ApiError } from '../utils/errorHandler';

export const getDayBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: DayBookRequest = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 50,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as 'date' | 'amount') || 'date',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await dayBookService.getDayBook(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDayBookSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const summary = await dayBookService.getDayBookSummary(startDate, endDate);
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
