export interface ExpenseCategory {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  date: string;
  categoryId: string;
  category?: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  date: string;
  categoryId: string;
  description?: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
  reference?: string;
}

export interface UpdateExpenseInput {
  date?: string;
  categoryId?: string;
  description?: string;
  amount?: number;
  paymentMethod?: 'CASH' | 'BANK';
  reference?: string;
}

export interface ExpenseListResponse {
  success: boolean;
  data: {
    items: Expense[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}

export interface ExpenseSingleResponse {
  success: boolean;
  message?: string;
  data: Expense;
}

export interface ExpenseFilterParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ExpenseState {
  items: Expense[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: ExpenseFilterParams;
}
