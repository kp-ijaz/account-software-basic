import { Request, Response, NextFunction } from 'express';
import reportService from '../services/reportService';
import { ApiError } from '../utils/errorHandler';

export const getMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      throw new ApiError(400, 'Month and year are required');
    }

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    if (monthNum < 1 || monthNum > 12) {
      throw new ApiError(400, 'Month must be between 1 and 12');
    }

    const report = await reportService.getMonthlyReport(monthNum, yearNum);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getYearlyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.query;

    if (!year) {
      throw new ApiError(400, 'Year is required');
    }

    const yearNum = parseInt(year as string);

    const report = await reportService.getYearlyReport(yearNum);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getBalanceSheet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balanceSheet = await reportService.getBalanceSheet();

    res.json({
      success: true,
      data: balanceSheet,
    });
  } catch (error) {
    next(error);
  }
};
