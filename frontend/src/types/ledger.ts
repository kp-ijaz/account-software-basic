export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  categoryId: string;
  categoryName: string;
  transactionType: 'INCOME' | 'EXPENSE';
  reference?: string;
  createdAt: string;
}

export interface LedgerFilterParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  transactionType?: 'INCOME' | 'EXPENSE';
  search?: string;
  sortBy?: 'date' | 'balance';
  sortOrder?: 'asc' | 'desc';
}

export interface LedgerListResponse {
  success: boolean;
  data: {
    items: LedgerEntry[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    openingBalance: number;
    totalDebit: number;
    totalCredit: number;
    closingBalance: number;
  };
}

export interface LedgerSummary {
  success: boolean;
  data: {
    openingBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpense: number;
  };
}

export interface LedgerState {
  items: LedgerEntry[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: LedgerFilterParams;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
}
