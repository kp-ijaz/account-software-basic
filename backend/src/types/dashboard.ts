export interface DashboardSummary {
  todayIncome: number;
  todayExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface DashboardTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
}

export interface DashboardChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  type: 'INCOME' | 'EXPENSE';
}

export interface DashboardResponse {
  success: boolean;
  data: {
    summary: DashboardSummary;
    recentTransactions: DashboardTransaction[];
    monthlyData: DashboardChartData[];
    incomeBreakdown: CategoryBreakdown[];
    expenseBreakdown: CategoryBreakdown[];
  };
}
