import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseResponse,
  ExpenseFilterParams,
} from '../types/expense';

class ExpenseService {
  /**
   * Create new expense transaction
   */
  async createExpense(input: CreateExpenseRequest, userId: string): Promise<ExpenseResponse> {
    try {
      // Validate input
      if (!input.date || !input.categoryId || !input.description || input.amount <= 0) {
        throw new ApiError(400, 'All fields are required and amount must be greater than zero');
      }

      // Verify category exists
      const category = await prisma.expenseCategory.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new ApiError(404, 'Expense category not found');
      }

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          type: 'EXPENSE',
          date: new Date(input.date),
          expenseCategoryId: input.categoryId,
          description: input.description,
          amount: new Decimal(input.amount),
          paymentMethod: input.paymentMethod,
          reference: input.reference,
        },
        include: {
          expenseCategory: {
            select: { id: true, name: true },
          },
        },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'EXPENSE_CREATED',
          description: `Expense created: ${input.description} - ${input.amount}`,
          userId,
          tableName: 'Transaction',
          recordId: transaction.id,
          newValues: JSON.parse(JSON.stringify(transaction)),
        },
      });

      logger.info(`Expense created: ${transaction.id}`);

      return this.formatExpenseResponse(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error creating expense', error as Error);
      throw new ApiError(500, 'Failed to create expense');
    }
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(id: string): Promise<ExpenseResponse> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          expenseCategory: {
            select: { id: true, name: true },
          },
        },
      });

      if (!transaction || transaction.type !== 'EXPENSE') {
        throw new ApiError(404, 'Expense not found');
      }

      return this.formatExpenseResponse(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error fetching expense', error as Error);
      throw new ApiError(500, 'Failed to fetch expense');
    }
  }

  /**
   * Get all expenses with filters and pagination
   */
  async getExpenses(filters: ExpenseFilterParams) {
    try {
      const {
        page = 1,
        pageSize = 10,
        startDate,
        endDate,
        categoryId,
        search,
        sortBy = 'date',
        sortOrder = 'desc',
      } = filters;

      // Build where clause
      const where: any = {
        type: 'EXPENSE',
      };

      if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      if (categoryId) {
        where.expenseCategoryId = categoryId;
      }

      if (search) {
        where.OR = [
          { description: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await prisma.transaction.count({ where });

      // Get paginated results
      const items = await prisma.transaction.findMany({
        where,
        include: {
          expenseCategory: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      const pages = Math.ceil(total / pageSize);

      return {
        items: items.map((item: any) => this.formatExpenseResponse(item)),
        total,
        page,
        pageSize,
        pages,
      };
    } catch (error) {
      logger.error('Error fetching expenses', error as Error);
      throw new ApiError(500, 'Failed to fetch expenses');
    }
  }

  /**
   * Update expense transaction
   */
  async updateExpense(
    id: string,
    input: UpdateExpenseRequest,
    userId: string
  ): Promise<ExpenseResponse> {
    try {
      // Get existing transaction
      const existing = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existing || existing.type !== 'EXPENSE') {
        throw new ApiError(404, 'Expense not found');
      }

      // Verify category if provided
      if (input.categoryId) {
        const category = await prisma.expenseCategory.findUnique({
          where: { id: input.categoryId },
        });

        if (!category) {
          throw new ApiError(404, 'Expense category not found');
        }
      }

      // Update transaction
      const updated = await prisma.transaction.update({
        where: { id },
        data: {
          ...(input.date && { date: new Date(input.date) }),
          ...(input.categoryId && { expenseCategoryId: input.categoryId }),
          ...(input.description && { description: input.description }),
          ...(input.amount && { amount: new Decimal(input.amount) }),
          ...(input.paymentMethod && { paymentMethod: input.paymentMethod }),
          ...(input.reference !== undefined && { reference: input.reference }),
        },
        include: {
          expenseCategory: {
            select: { id: true, name: true },
          },
        },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'EXPENSE_UPDATED',
          description: `Expense updated: ${updated.description}`,
          userId,
          tableName: 'Transaction',
          recordId: id,
          oldValues: JSON.parse(JSON.stringify(existing)),
          newValues: JSON.parse(JSON.stringify(updated)),
        },
      });

      logger.info(`Expense updated: ${id}`);

      return this.formatExpenseResponse(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error updating expense', error as Error);
      throw new ApiError(500, 'Failed to update expense');
    }
  }

  /**
   * Delete expense transaction
   */
  async deleteExpense(id: string, userId: string): Promise<void> {
    try {
      // Get existing transaction
      const existing = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existing || existing.type !== 'EXPENSE') {
        throw new ApiError(404, 'Expense not found');
      }

      // Delete transaction
      await prisma.transaction.delete({
        where: { id },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'EXPENSE_DELETED',
          description: `Expense deleted: ${existing.description}`,
          userId,
          tableName: 'Transaction',
          recordId: id,
          oldValues: JSON.parse(JSON.stringify(existing)),
        },
      });

      logger.info(`Expense deleted: ${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error deleting expense', error as Error);
      throw new ApiError(500, 'Failed to delete expense');
    }
  }

  /**
   * Get expense summary for a date range
   */
  async getExpenseSummary(startDate?: string, endDate?: string) {
    try {
      const where: any = {
        type: 'EXPENSE',
      };

      if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const summary = await prisma.transaction.aggregate({
        where,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      return {
        totalExpense: summary._sum.amount || 0,
        count: summary._count.id || 0,
      };
    } catch (error) {
      logger.error('Error getting expense summary', error as Error);
      throw new ApiError(500, 'Failed to get expense summary');
    }
  }

  /**
   * Format transaction response
   */
  private formatExpenseResponse(transaction: any): ExpenseResponse {
    return {
      id: transaction.id,
      date: transaction.date.toISOString().split('T')[0],
      categoryId: transaction.expenseCategoryId || '',
      category: transaction.expenseCategory
        ? {
            id: transaction.expenseCategory.id,
            name: transaction.expenseCategory.name,
          }
        : undefined,
      description: transaction.description,
      amount: parseFloat(transaction.amount.toString()),
      paymentMethod: transaction.paymentMethod,
      reference: transaction.reference,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}

export default new ExpenseService();
