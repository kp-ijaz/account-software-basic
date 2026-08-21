import api from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

class CategoryService {
  /**
   * Get all income categories
   */
  async getIncomeCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get<CategoriesResponse>('/categories/income');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch income categories';
      throw new Error(message);
    }
  }

  /**
   * Get all expense categories
   */
  async getExpenseCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get<CategoriesResponse>('/categories/expense');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch expense categories';
      throw new Error(message);
    }
  }

  /**
   * Create new income category
   */
  async createIncomeCategory(name: string, description?: string): Promise<CategoryResponse> {
    try {
      const response = await api.post<CategoryResponse>('/categories/income', {
        name,
        description: description || null,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create income category';
      throw new Error(message);
    }
  }

  /**
   * Create new expense category
   */
  async createExpenseCategory(name: string, description?: string): Promise<CategoryResponse> {
    try {
      const response = await api.post<CategoryResponse>('/categories/expense', {
        name,
        description: description || null,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create expense category';
      throw new Error(message);
    }
  }
}

export default new CategoryService();
