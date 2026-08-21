import api from './api';
import { DashboardData } from '../types/dashboard';

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get<DashboardData>('/dashboard');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard data';
      throw new Error(message);
    }
  }
}

export default new DashboardService();
