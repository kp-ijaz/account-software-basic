export interface CreateExpenseRequest {
  date: string; // ISO date format
  categoryId: string;
  description: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
  reference?: string;
}

export interface UpdateExpenseRequest {
  date?: string;
  categoryId?: string;
  description?: string;
  amount?: number;
  paymentMethod?: 'CASH' | 'BANK';
  reference?: string;
}

export interface ExpenseResponse {
  id: string;
  date: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePaginatedResponse {
  success: boolean;
  data: {
    items: ExpenseResponse[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
  message?: string;
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
