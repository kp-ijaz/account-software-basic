export interface DayBookEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  categoryType: 'INCOME' | 'EXPENSE';
  income: number;
  expense: number;
  balance: number;
  reference?: string;
  createdAt: string;
}

export interface DayBookFilterParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface DayBookListResponse {
  success: boolean;
  data: {
    items: DayBookEntry[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    openingBalance: number;
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
  };
}

export interface DayBookState {
  items: DayBookEntry[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: DayBookFilterParams;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
}
