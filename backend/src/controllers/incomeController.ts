import { Request, Response, NextFunction } from 'express';
import incomeService from '../services/incomeService';
import { ApiError } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { IncomeFilterParams } from '../types/income';

/**
 * Create income
 * POST /api/income
 */
export const createIncome = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const result = await incomeService.createIncome(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Income created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get income by ID
 * GET /api/income/:id
 */
export const getIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await incomeService.getIncomeById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all income with filters
 * GET /api/income
 */
export const getIncomes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: IncomeFilterParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as any) || 'date',
      sortOrder: (req.query.sortOrder as any) || 'desc',
    };

    const result = await incomeService.getIncomes(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update income
 * PUT /api/income/:id
 */
export const updateIncome = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const result = await incomeService.updateIncome(id, req.body, userId);

    res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete income
 * DELETE /api/income/:id
 */
export const deleteIncome = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    await incomeService.deleteIncome(id, userId);

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get income summary
 * GET /api/income/summary
 */
export const getIncomeSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await incomeService.getIncomeSummary(
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
