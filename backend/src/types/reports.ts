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
  summary: MonthlyReportSummary;
  transactions: MonthlyReportItem[];
  incomeByCategory: { category: string; amount: number }[];
  expenseByCategory: { category: string; amount: number }[];
}

export interface YearlyReportData {
  year: number;
  months: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface BalanceSheetData {
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
}

export interface ReportResponse {
  success: boolean;
  message?: string;
  data?: any;
}
