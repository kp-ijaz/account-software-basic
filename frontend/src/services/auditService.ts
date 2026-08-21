import api from './api';
import { AuditLogListResponse, AuditLogFilterParams, AuditLogSummary } from '../types/audit';

class AuditService {
  async getAuditLogs(filters?: AuditLogFilterParams): Promise<AuditLogListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.action) params.append('action', filters.action);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      }

      const queryString = params.toString();
      const url = queryString ? `/audit?${queryString}` : '/audit';

      const response = await api.get<AuditLogListResponse>(url);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch audit logs';
      throw new Error(message);
    }
  }

  async getAuditSummary(): Promise<AuditLogSummary> {
    try {
      const response = await api.get<AuditLogSummary>('/audit/summary');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch audit summary';
      throw new Error(message);
    }
  }
}

export default new AuditService();
