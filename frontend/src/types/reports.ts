export interface MonthlyReportSummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  openingBalance: number;
  closingBalance: number;
}

export interface MonthlyReportItem {
  date: string;
  description: string;
  category: string;
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyReportData {
  success: boolean;
  data: {
    summary: MonthlyReportSummary;
    transactions: MonthlyReportItem[];
    incomeByCategory: { category: string; amount: number }[];
    expenseByCategory: { category: string; amount: number }[];
  };
}

export interface YearlyReportMonth {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface YearlyReportData {
  success: boolean;
  data: {
    year: number;
    months: YearlyReportMonth[];
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  };
}

export interface BalanceSheetData {
  success: boolean;
  data: {
    asOf: string;
    assets: {
      cash: number;
      bankBalance: number;
      totalAssets: number;
    };
    liabilities: {
      pendingPayables: number;
      totalLiabilities: number;
    };
    equity: {
      openingBalance: number;
      currentIncome: number;
      currentExpense: number;
      netProfit: number;
      totalEquity: number;
    };
    totalLiabilitiesAndEquity: number;
  };
}

export interface ReportsState {
  monthlyReport: MonthlyReportData['data'] | null;
  yearlyReport: YearlyReportData['data'] | null;
  balanceSheet: BalanceSheetData['data'] | null;
  loading: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
}
