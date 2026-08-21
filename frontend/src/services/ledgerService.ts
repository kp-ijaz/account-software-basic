import api from './api';
import { LedgerFilterParams, LedgerListResponse, LedgerSummary } from '../types/ledger';

class LedgerService {
  async getLedger(filters?: LedgerFilterParams): Promise<LedgerListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.transactionType) params.append('transactionType', filters.transactionType);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }

      const queryString = params.toString();
      const url = queryString ? `/ledger?${queryString}` : '/ledger';

      const response = await api.get<LedgerListResponse>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch ledger';
      throw new Error(message);
    }
  }

  async getLedgerSummary(startDate?: string, endDate?: string): Promise<LedgerSummary> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = queryString ? `/ledger/summary?${queryString}` : '/ledger/summary';

      const response = await api.get<LedgerSummary>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch summary';
      throw new Error(message);
    }
  }
}

export default new LedgerService();
