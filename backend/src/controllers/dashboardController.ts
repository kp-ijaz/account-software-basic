import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboardService';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getDashboardData();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
