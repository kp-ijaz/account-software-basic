import axios, { AxiosInstance, AxiosError } from 'axios';
import TokenManager from '../utils/tokenManager';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isHandlingUnauthorized = false;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isAuthEndpoint && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      store.dispatch(logout());

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      } else {
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
