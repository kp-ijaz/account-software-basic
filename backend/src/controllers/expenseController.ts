import { Request, Response, NextFunction } from 'express';
import expenseService from '../services/expenseService';
import { ApiError } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { ExpenseFilterParams } from '../types/expense';

/**
 * Create expense
 * POST /api/expense
 */
export const createExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const result = await expenseService.createExpense(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expense by ID
 * GET /api/expense/:id
 */
export const getExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await expenseService.getExpenseById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all expenses with filters
 * GET /api/expense
 */
export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: ExpenseFilterParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as any) || 'date',
      sortOrder: (req.query.sortOrder as any) || 'desc',
    };

    const result = await expenseService.getExpenses(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update expense
 * PUT /api/expense/:id
 */
export const updateExpense = async (
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

    const result = await expenseService.updateExpense(id, req.body, userId);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete expense
 * DELETE /api/expense/:id
 */
export const deleteExpense = async (
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

    await expenseService.deleteExpense(id, userId);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expense summary
 * GET /api/expense/summary
 */
export const getExpenseSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await expenseService.getExpenseSummary(
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
