import { db } from '../config/database';
import {
  DashboardSummary,
  DashboardTransaction,
  DashboardChartData,
  CategoryBreakdown,
  DashboardResponse,
} from '../types/dashboard';
import logger from '../utils/logger';

class DashboardService {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch all transactions
      const allTransactions = await db.transaction.findMany({
        include: {
          incomeCategory: true,
          expenseCategory: true,
        },
        orderBy: { date: 'desc' },
      });

      // Calculate summary
      const summary = this.calculateSummary(allTransactions, todayStart, monthStart);

      // Get recent transactions (last 10)
      const recentTransactions = this.getRecentTransactions(allTransactions, 10);

      // Get monthly data (last 12 months)
      const monthlyData = this.getMonthlyData(allTransactions);

      // Get category breakdowns
      const incomeBreakdown = this.getCategoryBreakdown(allTransactions, 'INCOME');
      const expenseBreakdown = this.getCategoryBreakdown(allTransactions, 'EXPENSE');

      logger.info('Dashboard data retrieved successfully');

      return {
        success: true,
        data: {
          summary,
          recentTransactions,
          monthlyData,
          incomeBreakdown,
          expenseBreakdown,
        },
      };
    } catch (error) {
      logger.error(`Error fetching dashboard data: ${error}`);
      throw error;
    }
  }

  private calculateSummary(
    transactions: any[],
    todayStart: Date,
    monthStart: Date
  ): DashboardSummary {
    let totalIncome = 0;
    let totalExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      const isToday = tx.date >= todayStart;
      const isThisMonth = tx.date >= monthStart;

      if (tx.type === 'INCOME') {
        totalIncome += amount;
        if (isToday) todayIncome += amount;
        if (isThisMonth) monthlyIncome += amount;
      } else {
        totalExpense += amount;
        if (isToday) todayExpense += amount;
        if (isThisMonth) monthlyExpense += amount;
      }
    });

    const currentBalance = totalIncome - totalExpense;

    return {
      todayIncome,
      todayExpense,
      monthlyIncome,
      monthlyExpense,
      currentBalance,
      totalIncome,
      totalExpense,
    };
  }

  private getRecentTransactions(
    transactions: any[],
    limit: number
  ): DashboardTransaction[] {
    return transactions.slice(0, limit).map((tx) => ({
      id: tx.id,
      date: tx.date.toISOString().split('T')[0],
      description: tx.description,
      category: tx.type === 'INCOME'
        ? tx.incomeCategory?.name || 'Unknown'
        : tx.expenseCategory?.name || 'Unknown',
      type: tx.type,
      amount: Number(tx.amount),
      paymentMethod: tx.paymentMethod,
    }));
  }

  private getMonthlyData(transactions: any[]): DashboardChartData[] {
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toISOString().substring(0, 7); // YYYY-MM
      monthlyMap.set(key, { income: 0, expense: 0 });
    }

    // Accumulate transactions by month
    transactions.forEach((tx) => {
      const key = tx.date.toISOString().substring(0, 7);
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!;
        const amount = Number(tx.amount);
        if (tx.type === 'INCOME') {
          entry.income += amount;
        } else {
          entry.expense += amount;
        }
      }
    });

    // Calculate running balance
    let runningBalance = 0;
    const result: DashboardChartData[] = [];

    // Get all transactions before the chart period
    const chartStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    transactions.forEach((tx) => {
      if (tx.date < chartStart) {
        if (tx.type === 'INCOME') {
          runningBalance += Number(tx.amount);
        } else {
          runningBalance -= Number(tx.amount);
        }
      }
    });

    monthlyMap.forEach((value, key) => {
      const income = value.income;
      const expense = value.expense;
      runningBalance = runningBalance + income - expense;

      result.push({
        month: key,
        income,
        expense,
        balance: runningBalance,
      });
    });

    return result;
  }

  private getCategoryBreakdown(
    transactions: any[],
    type: 'INCOME' | 'EXPENSE'
  ): CategoryBreakdown[] {
    const categoryMap = new Map<string, number>();
    let total = 0;

    transactions.forEach((tx) => {
      if (tx.type === type) {
        const categoryName = type === 'INCOME'
          ? tx.incomeCategory?.name || 'Unknown'
          : tx.expenseCategory?.name || 'Unknown';
        const amount = Number(tx.amount);

        const current = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, current + amount);
        total += amount;
      }
    });

    const breakdown: CategoryBreakdown[] = [];
    categoryMap.forEach((amount, category) => {
      breakdown.push({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        type,
      });
    });

    // Sort by amount descending
    return breakdown.sort((a, b) => b.amount - a.amount);
  }
}

export default new DashboardService();
