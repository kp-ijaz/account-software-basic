import api from './api';
import {
  CreateIncomeInput,
  UpdateIncomeInput,
  IncomeListResponse,
  IncomeSingleResponse,
  IncomeFilterParams,
} from '../types/income';

class IncomeService {
  /**
   * Create new income
   */
  async createIncome(data: CreateIncomeInput): Promise<IncomeSingleResponse> {
    try {
      const response = await api.post<IncomeSingleResponse>('/income', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create income';
      throw new Error(message);
    }
  }

  /**
   * Get income by ID
   */
  async getIncomeById(id: string): Promise<IncomeSingleResponse> {
    try {
      const response = await api.get<IncomeSingleResponse>(`/income/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch income';
      throw new Error(message);
    }
  }

  /**
   * Get all income with filters
   */
  async getIncomes(filters?: IncomeFilterParams): Promise<IncomeListResponse> {
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
      const url = queryString ? `/income?${queryString}` : '/income';

      const response = await api.get<IncomeListResponse>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch incomes';
      throw new Error(message);
    }
  }

  /**
   * Update income
   */
  async updateIncome(id: string, data: UpdateIncomeInput): Promise<IncomeSingleResponse> {
    try {
      const response = await api.put<IncomeSingleResponse>(`/income/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update income';
      throw new Error(message);
    }
  }

  /**
   * Delete income
   */
  async deleteIncome(id: string): Promise<void> {
    try {
      await api.delete(`/income/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete income';
      throw new Error(message);
    }
  }

  /**
   * Get income summary
   */
  async getIncomeSummary(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = queryString ? `/income/summary?${queryString}` : '/income/summary';

      const response = await api.get(url);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch summary';
      throw new Error(message);
    }
  }
}

export default new IncomeService();
