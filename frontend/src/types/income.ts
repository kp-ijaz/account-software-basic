export interface IncomeCategory {
  id: string;
  name: string;
}

export interface Income {
  id: string;
  date: string;
  categoryId: string;
  category?: IncomeCategory;
  description: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeInput {
  date: string;
  categoryId: string;
  description: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK';
  reference?: string;
}

export interface UpdateIncomeInput {
  date?: string;
  categoryId?: string;
  description?: string;
  amount?: number;
  paymentMethod?: 'CASH' | 'BANK';
  reference?: string;
}

export interface IncomeListResponse {
  success: boolean;
  data: {
    items: Income[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}

export interface IncomeSingleResponse {
  success: boolean;
  message?: string;
  data: Income;
}

export interface IncomeFilterParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IncomeState {
  items: Income[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: IncomeFilterParams;
}
