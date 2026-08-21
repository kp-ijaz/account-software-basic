import { db } from '../config/database';
import { Prisma } from '@prisma/client';
import { DayBookEntry, DayBookRequest, DayBookResponse } from '../types/daybook';
import logger from '../utils/logger';

class DayBookService {
  async getDayBook(filters: DayBookRequest): Promise<DayBookResponse> {
    try {
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 50;
      const skip = (page - 1) * pageSize;

      // Build where clause
      const where: any = {};

      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
          where.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.date.lte = new Date(filters.endDate);
        }
      }

      if (filters.search) {
        where.OR = [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { reference: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await db.transaction.count({ where });

      // Fetch all transactions for balance calculation
      const allTransactions = await db.transaction.findMany({
        where,
        orderBy: { date: 'asc' },
        include: {
          incomeCategory: true,
          expenseCategory: true,
        },
      });

      // Calculate opening balance (all transactions before start date)
      let openingBalance = 0;
      const filteredTransactions = allTransactions.filter((tx: any) => {
        if (filters.startDate) {
          return tx.date >= new Date(filters.startDate);
        }
        return true;
      });

      if (filters.startDate && allTransactions.length > 0) {
        allTransactions.forEach((tx: any) => {
          if (tx.date < new Date(filters.startDate!)) {
            if (tx.type === 'INCOME') {
              openingBalance += Number(tx.amount);
            } else {
              openingBalance -= Number(tx.amount);
            }
          }
        });
      }

      // Calculate running balance for each transaction
      let runningBalance = openingBalance;
      const entries: DayBookEntry[] = [];
      let totalIncome = 0;
      let totalExpense = 0;

      filteredTransactions.forEach((tx: any) => {
        const income = tx.type === 'INCOME' ? Number(tx.amount) : 0;
        const expense = tx.type === 'EXPENSE' ? Number(tx.amount) : 0;

        if (income > 0) totalIncome += income;
        if (expense > 0) totalExpense += expense;

        if (income > 0) {
          runningBalance += income;
        } else {
          runningBalance -= expense;
        }

        entries.push({
          id: tx.id,
          date: tx.date.toISOString().split('T')[0],
          description: tx.description,
          category: tx.type === 'INCOME'
            ? tx.incomeCategory?.name || 'Unknown'
            : tx.expenseCategory?.name || 'Unknown',
          categoryType: tx.type,
          income,
          expense,
          balance: runningBalance,
          reference: tx.reference || undefined,
          createdAt: tx.createdAt.toISOString(),
        });
      });

      // Apply pagination on entries
      const paginatedEntries = entries.slice(skip, skip + pageSize);
      const pages = Math.ceil(total / pageSize);

      logger.info(`DayBook fetched: ${paginatedEntries.length} entries, page ${page}/${pages}`);

      return {
        success: true,
        data: {
          items: paginatedEntries,
          total,
          page,
          pageSize,
          pages,
          openingBalance,
          totalIncome,
          totalExpense,
          closingBalance: runningBalance,
        },
      };
    } catch (error) {
      logger.error(`Error fetching day book: ${error}`);
      throw error;
    }
  }

  async getDayBookSummary(startDate?: string, endDate?: string): Promise<{
    openingBalance: number;
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
  }> {
    try {
      const where: any = {};

      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = new Date(startDate);
        }
        if (endDate) {
          where.date.lte = new Date(endDate);
        }
      }

      const transactions = await db.transaction.findMany({
        where: startDate || endDate
          ? { date: { gte: startDate ? new Date(startDate) : undefined, lte: endDate ? new Date(endDate) : undefined } }
          : {},
        orderBy: { date: 'asc' },
      });

      let openingBalance = 0;
      let totalIncome = 0;
      let totalExpense = 0;

      if (startDate) {
        transactions.forEach((tx: any) => {
          if (tx.date < new Date(startDate)) {
            if (tx.type === 'INCOME') {
              openingBalance += Number(tx.amount);
            } else {
              openingBalance -= Number(tx.amount);
            }
          }
        });
      }

      transactions.forEach((tx: any) => {
        if (tx.date >= (startDate ? new Date(startDate) : new Date('1900-01-01'))) {
          if (tx.type === 'INCOME') {
            totalIncome += Number(tx.amount);
          } else {
            totalExpense += Number(tx.amount);
          }
        }
      });

      const closingBalance = openingBalance + totalIncome - totalExpense;

      return {
        openingBalance,
        totalIncome,
        totalExpense,
        closingBalance,
      };
    } catch (error) {
      logger.error(`Error fetching day book summary: ${error}`);
      throw error;
    }
  }
}

export default new DayBookService();
