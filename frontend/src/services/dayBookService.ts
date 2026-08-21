import api from './api';
import { DayBookFilterParams, DayBookListResponse } from '../types/daybook';

class DayBookService {
  async getDayBook(filters?: DayBookFilterParams): Promise<DayBookListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }

      const queryString = params.toString();
      const url = queryString ? `/daybook?${queryString}` : '/daybook';

      const response = await api.get<DayBookListResponse>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch day book';
      throw new Error(message);
    }
  }

  async getDayBookSummary(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = queryString ? `/daybook/summary?${queryString}` : '/daybook/summary';

      const response = await api.get(url);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch summary';
      throw new Error(message);
    }
  }
}

export default new DayBookService();
