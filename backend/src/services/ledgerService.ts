import { db } from '../config/database';
import { Prisma } from '@prisma/client';
import { LedgerEntry, LedgerRequest, LedgerResponse, LedgerSummary } from '../types/ledger';
import logger from '../utils/logger';

class LedgerService {
  async getLedger(filters: LedgerRequest): Promise<LedgerResponse> {
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

      if (filters.transactionType) {
        where.type = filters.transactionType;
      }

      if (filters.search) {
        where.OR = [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { reference: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.categoryId) {
        if (filters.transactionType === 'INCOME') {
          where.incomeCategoryId = filters.categoryId;
        } else if (filters.transactionType === 'EXPENSE') {
          where.expenseCategoryId = filters.categoryId;
        }
      }

      // Get total count
      const total = await db.transaction.count({ where });

      // Fetch all transactions for balance calculation
      const allTransactions = await db.transaction.findMany({
        orderBy: { date: 'asc' },
        include: {
          incomeCategory: true,
          expenseCategory: true,
        },
      });

      // Calculate opening balance (all transactions before start date)
      let openingBalance = 0;

      if (filters.startDate) {
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

      // Fetch filtered transactions
      const transactions = await db.transaction.findMany({
        where,
        orderBy: { date: filters.sortOrder === 'asc' ? 'asc' : 'desc' },
        include: {
          incomeCategory: true,
          expenseCategory: true,
        },
      });

      // Calculate running balance for each transaction
      let runningBalance = openingBalance;
      const entries: LedgerEntry[] = [];
      let totalDebit = 0;
      let totalCredit = 0;

      transactions.forEach((tx: any) => {
        const debit = tx.type === 'INCOME' ? Number(tx.amount) : 0;
        const credit = tx.type === 'EXPENSE' ? Number(tx.amount) : 0;

        if (debit > 0) {
          totalDebit += debit;
          runningBalance += debit;
        }
        if (credit > 0) {
          totalCredit += credit;
          runningBalance -= credit;
        }

        entries.push({
          id: tx.id,
          date: tx.date.toISOString().split('T')[0],
          description: tx.description,
          debit,
          credit,
          balance: runningBalance,
          categoryId: tx.type === 'INCOME' ? tx.incomeCategoryId : tx.expenseCategoryId,
          categoryName: tx.type === 'INCOME'
            ? tx.incomeCategory?.name || 'Unknown'
            : tx.expenseCategory?.name || 'Unknown',
          transactionType: tx.type,
          reference: tx.reference || undefined,
          createdAt: tx.createdAt.toISOString(),
        });
      });

      // Apply pagination
      const paginatedEntries = entries.slice(skip, skip + pageSize);
      const pages = Math.ceil(total / pageSize);

      logger.info(`Ledger fetched: ${paginatedEntries.length} entries, page ${page}/${pages}`);

      return {
        success: true,
        data: {
          items: paginatedEntries,
          total,
          page,
          pageSize,
          pages,
          openingBalance,
          totalDebit,
          totalCredit,
          closingBalance: runningBalance,
        },
      };
    } catch (error) {
      logger.error(`Error fetching ledger: ${error}`);
      throw error;
    }
  }

  async getLedgerSummary(startDate?: string, endDate?: string): Promise<LedgerSummary> {
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
        success: true,
        data: {
          openingBalance,
          closingBalance,
          totalIncome,
          totalExpense,
        },
      };
    } catch (error) {
      logger.error(`Error fetching ledger summary: ${error}`);
      throw error;
    }
  }
}

export default new LedgerService();
