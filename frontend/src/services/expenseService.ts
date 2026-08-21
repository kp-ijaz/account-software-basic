import api from './api';
import {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseListResponse,
  ExpenseSingleResponse,
  ExpenseFilterParams,
} from '../types/expense';

class ExpenseService {
  /**
   * Create new expense
   */
  async createExpense(data: CreateExpenseInput): Promise<ExpenseSingleResponse> {
    try {
      const response = await api.post<ExpenseSingleResponse>('/expense', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create expense';
      throw new Error(message);
    }
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(id: string): Promise<ExpenseSingleResponse> {
    try {
      const response = await api.get<ExpenseSingleResponse>(`/expense/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch expense';
      throw new Error(message);
    }
  }

  /**
   * Get all expenses with filters
   */
  async getExpenses(filters?: ExpenseFilterParams): Promise<ExpenseListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }

      const queryString = params.toString();
      const url = queryString ? `/expense?${queryString}` : '/expense';

      const response = await api.get<ExpenseListResponse>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch expenses';
      throw new Error(message);
    }
  }

  /**
   * Update expense
   */
  async updateExpense(id: string, data: UpdateExpenseInput): Promise<ExpenseSingleResponse> {
    try {
      const response = await api.put<ExpenseSingleResponse>(`/expense/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update expense';
      throw new Error(message);
    }
  }

  /**
   * Delete expense
   */
  async deleteExpense(id: string): Promise<void> {
    try {
      await api.delete(`/expense/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      throw new Error(message);
    }
  }

  /**
   * Get expense summary
   */
  async getExpenseSummary(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = queryString ? `/expense/summary?${queryString}` : '/expense/summary';

      const response = await api.get(url);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch summary';
      throw new Error(message);
    }
  }
}

export default new ExpenseService();
