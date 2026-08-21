import { db } from '../config/database';
import { Prisma } from '@prisma/client';
import {
  MonthlyReportData,
  MonthlyReportSummary,
  MonthlyReportItem,
  YearlyReportData,
  BalanceSheetData,
} from '../types/reports';
import logger from '../utils/logger';

class ReportService {
  async getMonthlyReport(month: number, year: number): Promise<MonthlyReportData> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Fetch transactions for the month
      const transactions = await db.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          incomeCategory: true,
          expenseCategory: true,
        },
        orderBy: { date: 'asc' },
      });

      // Calculate opening balance (all transactions before start date)
      const allTransactions = await db.transaction.findMany();
      let openingBalance = 0;

      allTransactions.forEach((tx: any) => {
        if (tx.date < startDate) {
          if (tx.type === 'INCOME') {
            openingBalance += Number(tx.amount);
          } else {
            openingBalance -= Number(tx.amount);
          }
        }
      });

      // Build report items with running balance
      const reportItems: MonthlyReportItem[] = [];
      let runningBalance = openingBalance;
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach((tx: any) => {
        const amount = Number(tx.amount);
        const income = tx.type === 'INCOME' ? amount : 0;
        const expense = tx.type === 'EXPENSE' ? amount : 0;

        if (income > 0) {
          totalIncome += income;
          runningBalance += income;
        } else {
          totalExpense += expense;
          runningBalance -= expense;
        }

        reportItems.push({
          date: tx.date.toISOString().split('T')[0],
          description: tx.description,
          category: tx.type === 'INCOME'
            ? tx.incomeCategory?.name || 'Unknown'
            : tx.expenseCategory?.name || 'Unknown',
          income,
          expense,
          balance: runningBalance,
        });
      });

      // Category breakdown
      const incomeByCategory = this.getCategoryTotals(transactions, 'INCOME');
      const expenseByCategory = this.getCategoryTotals(transactions, 'EXPENSE');

      const summary: MonthlyReportSummary = {
        month: startDate.toLocaleString('default', { month: 'long' }),
        year,
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        openingBalance,
        closingBalance: runningBalance,
      };

      logger.info(`Monthly report generated for ${year}-${month}`);

      return {
        summary,
        transactions: reportItems,
        incomeByCategory,
        expenseByCategory,
      };
    } catch (error) {
      logger.error(`Error generating monthly report: ${error}`);
      throw error;
    }
  }

  async getYearlyReport(year: number): Promise<YearlyReportData> {
    try {
      const monthsData = [];
      let totalIncome = 0;
      let totalExpense = 0;

      const allTransactions = await db.transaction.findMany({
        where: {
          date: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
      });

      // Calculate opening balance
      const beforeYearTransactions = await db.transaction.findMany({
        where: {
          date: {
            lt: new Date(year, 0, 1),
          },
        },
      });

      let runningBalance = 0;
      beforeYearTransactions.forEach((tx: any) => {
        if (tx.type === 'INCOME') {
          runningBalance += Number(tx.amount);
        } else {
          runningBalance -= Number(tx.amount);
        }
      });

      // Process each month
      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        let monthIncome = 0;
        let monthExpense = 0;

        allTransactions.forEach((tx: any) => {
          if (tx.date >= startDate && tx.date <= endDate) {
            if (tx.type === 'INCOME') {
              monthIncome += Number(tx.amount);
            } else {
              monthExpense += Number(tx.amount);
            }
          }
        });

        totalIncome += monthIncome;
        totalExpense += monthExpense;
        runningBalance = runningBalance + monthIncome - monthExpense;

        const monthName = startDate.toLocaleString('default', { month: 'short' });

        monthsData.push({
          month: monthName,
          income: monthIncome,
          expense: monthExpense,
          balance: runningBalance,
        });
      }

      const netBalance = totalIncome - totalExpense;

      logger.info(`Yearly report generated for ${year}`);

      return {
        year,
        months: monthsData,
        totalIncome,
        totalExpense,
        netBalance,
      };
    } catch (error) {
      logger.error(`Error generating yearly report: ${error}`);
      throw error;
    }
  }

  async getBalanceSheet(): Promise<BalanceSheetData> {
    try {
      const now = new Date();
      const asOf = now.toISOString().split('T')[0];

      // Fetch all transactions
      const allTransactions = await db.transaction.findMany();

      // Calculate balances
      let totalIncome = 0;
      let totalExpense = 0;

      allTransactions.forEach((tx: any) => {
        if (tx.type === 'INCOME') {
          totalIncome += Number(tx.amount);
        } else {
          totalExpense += Number(tx.amount);
        }
      });

      const netProfit = totalIncome - totalExpense;

      // Assets
      const cash = 0; // Would need to be calculated from cash transactions
      const bankBalance = netProfit; // Simplified: assume all in bank
      const totalAssets = cash + bankBalance;

      // Liabilities
      const pendingPayables = 0; // Would need accounts payable tracking
      const totalLiabilities = pendingPayables;

      // Equity
      const openingBalance = 0; // Would be set from previous year
      const currentIncome = totalIncome;
      const currentExpense = totalExpense;
      const totalEquity = openingBalance + netProfit;

      logger.info('Balance sheet generated');

      return {
        asOf,
        assets: {
          cash,
          bankBalance,
          totalAssets,
        },
        liabilities: {
          pendingPayables,
          totalLiabilities,
        },
        equity: {
          openingBalance,
          currentIncome,
          currentExpense,
          netProfit,
          totalEquity,
        },
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
      };
    } catch (error) {
      logger.error(`Error generating balance sheet: ${error}`);
      throw error;
    }
  }

  private getCategoryTotals(
    transactions: any[],
    type: 'INCOME' | 'EXPENSE'
  ): { category: string; amount: number }[] {
    const categoryMap = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type === type) {
        const categoryName = type === 'INCOME'
          ? tx.incomeCategory?.name || 'Unknown'
          : tx.expenseCategory?.name || 'Unknown';
        const amount = Number(tx.amount);

        const current = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, current + amount);
      }
    });

    const result: { category: string; amount: number }[] = [];
    categoryMap.forEach((amount, category) => {
      result.push({ category, amount });
    });

    return result.sort((a, b) => b.amount - a.amount);
  }
}

export default new ReportService();
