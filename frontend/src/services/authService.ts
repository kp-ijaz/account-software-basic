import api from './api';
import { LoginRequest, LoginResponse, ChangePasswordRequest } from '../types/auth';

class AuthService {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);

      if (response.data.success && response.data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear token even if logout fails
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await api.post('/auth/change-password', data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      throw new Error(message);
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/check-email', { email });
      return response.data.data.available;
    } catch {
      return false;
    }
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/check-username', { username });
      return response.data.data.available;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export default new AuthService();
