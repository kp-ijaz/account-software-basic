import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';
import {
  CreateIncomeRequest,
  UpdateIncomeRequest,
  IncomeResponse,
  IncomeFilterParams,
} from '../types/income';

class IncomeService {
  /**
   * Create new income transaction
   */
  async createIncome(input: CreateIncomeRequest, userId: string): Promise<IncomeResponse> {
    try {
      // Validate input
      if (!input.date || !input.categoryId || input.amount <= 0) {
        throw new ApiError(400, 'Date, category, and amount (greater than zero) are required');
      }

      // Verify category exists
      const category = await prisma.incomeCategory.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new ApiError(404, 'Income category not found');
      }

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          type: 'INCOME',
          date: new Date(input.date),
          incomeCategoryId: input.categoryId,
          description: input.description,
          amount: new Decimal(input.amount),
          paymentMethod: input.paymentMethod,
          reference: input.reference,
        },
        include: {
          incomeCategory: {
            select: { id: true, name: true },
          },
        },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'INCOME_CREATED',
          description: `Income created: ${input.description} - ${input.amount}`,
          userId,
          tableName: 'Transaction',
          recordId: transaction.id,
          newValues: JSON.parse(JSON.stringify(transaction)),
        },
      });

      logger.info(`Income created: ${transaction.id}`);

      return this.formatIncomeResponse(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error creating income', error as Error);
      throw new ApiError(500, 'Failed to create income');
    }
  }

  /**
   * Get income by ID
   */
  async getIncomeById(id: string): Promise<IncomeResponse> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          incomeCategory: {
            select: { id: true, name: true },
          },
        },
      });

      if (!transaction || transaction.type !== 'INCOME') {
        throw new ApiError(404, 'Income not found');
      }

      return this.formatIncomeResponse(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error fetching income', error as Error);
      throw new ApiError(500, 'Failed to fetch income');
    }
  }

  /**
   * Get all income with filters and pagination
   */
  async getIncomes(filters: IncomeFilterParams) {
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
        type: 'INCOME',
      };

      if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      if (categoryId) {
        where.incomeCategoryId = categoryId;
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
          incomeCategory: {
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
        items: items.map((item: any) => this.formatIncomeResponse(item)),
        total,
        page,
        pageSize,
        pages,
      };
    } catch (error) {
      logger.error('Error fetching incomes', error as Error);
      throw new ApiError(500, 'Failed to fetch incomes');
    }
  }

  /**
   * Update income transaction
   */
  async updateIncome(
    id: string,
    input: UpdateIncomeRequest,
    userId: string
  ): Promise<IncomeResponse> {
    try {
      // Get existing transaction
      const existing = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existing || existing.type !== 'INCOME') {
        throw new ApiError(404, 'Income not found');
      }

      // Verify category if provided
      if (input.categoryId) {
        const category = await prisma.incomeCategory.findUnique({
          where: { id: input.categoryId },
        });

        if (!category) {
          throw new ApiError(404, 'Income category not found');
        }
      }

      // Update transaction
      const updated = await prisma.transaction.update({
        where: { id },
        data: {
          ...(input.date && { date: new Date(input.date) }),
          ...(input.categoryId && { incomeCategoryId: input.categoryId }),
          ...(input.description && { description: input.description }),
          ...(input.amount && { amount: new Decimal(input.amount) }),
          ...(input.paymentMethod && { paymentMethod: input.paymentMethod }),
          ...(input.reference !== undefined && { reference: input.reference }),
        },
        include: {
          incomeCategory: {
            select: { id: true, name: true },
          },
        },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'INCOME_UPDATED',
          description: `Income updated: ${updated.description}`,
          userId,
          tableName: 'Transaction',
          recordId: id,
          oldValues: JSON.parse(JSON.stringify(existing)),
          newValues: JSON.parse(JSON.stringify(updated)),
        },
      });

      logger.info(`Income updated: ${id}`);

      return this.formatIncomeResponse(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error updating income', error as Error);
      throw new ApiError(500, 'Failed to update income');
    }
  }

  /**
   * Delete income transaction
   */
  async deleteIncome(id: string, userId: string): Promise<void> {
    try {
      // Get existing transaction
      const existing = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existing || existing.type !== 'INCOME') {
        throw new ApiError(404, 'Income not found');
      }

      // Delete transaction
      await prisma.transaction.delete({
        where: { id },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          action: 'INCOME_DELETED',
          description: `Income deleted: ${existing.description}`,
          userId,
          tableName: 'Transaction',
          recordId: id,
          oldValues: JSON.parse(JSON.stringify(existing)),
        },
      });

      logger.info(`Income deleted: ${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Error deleting income', error as Error);
      throw new ApiError(500, 'Failed to delete income');
    }
  }

  /**
   * Get income summary for a date range
   */
  async getIncomeSummary(startDate?: string, endDate?: string) {
    try {
      const where: any = {
        type: 'INCOME',
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
        totalIncome: summary._sum.amount || 0,
        count: summary._count.id || 0,
      };
    } catch (error) {
      logger.error('Error getting income summary', error as Error);
      throw new ApiError(500, 'Failed to get income summary');
    }
  }

  /**
   * Format transaction response
   */
  private formatIncomeResponse(transaction: any): IncomeResponse {
    return {
      id: transaction.id,
      date: transaction.date.toISOString().split('T')[0],
      categoryId: transaction.incomeCategoryId || '',
      category: transaction.incomeCategory
        ? {
            id: transaction.incomeCategory.id,
            name: transaction.incomeCategory.name,
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

export default new IncomeService();
