import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiError } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all income categories
 * GET /api/categories/income
 */
export const getIncomeCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.incomeCategory.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all expense categories
 * GET /api/categories/expense
 */
export const getExpenseCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create income category
 * POST /api/categories/income
 */
export const createIncomeCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ApiError(400, 'Category name is required and must be a non-empty string');
    }

    // Check if category already exists
    const existing = await prisma.incomeCategory.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      throw new ApiError(400, 'Income category already exists');
    }

    const category = await prisma.incomeCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isDefault: false,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Income category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create expense category
 * POST /api/categories/expense
 */
export const createExpenseCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ApiError(400, 'Category name is required and must be a non-empty string');
    }

    // Check if category already exists
    const existing = await prisma.expenseCategory.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      throw new ApiError(400, 'Expense category already exists');
    }

    const category = await prisma.expenseCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isDefault: false,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Expense category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
