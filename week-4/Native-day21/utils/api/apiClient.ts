import axios from 'axios';
import { ValidationError } from '../validationError';
import ApiKeyManager from './apiKeyManager';

// PERBAIKI: Gunakan baseURL yang benar untuk DummyJSON
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com', // PASTIKAN INI BENAR
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor untuk auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Header dasar
      config.headers['X-Client-Platform'] = 'React-Native';
      
      // Tambahkan auth token jika ada
      const tokenResult = await ApiKeyManager.getUserToken();
      if (tokenResult.success && tokenResult.token) {
        config.headers.Authorization = `Bearer ${tokenResult.token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      throw error;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 400 Validation Errors
    if (error.response?.status === 400 && error.response?.data?.errors) {
      const fieldErrors = error.response.data.errors;
      throw new ValidationError(fieldErrors);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('❌ Auth token expired or invalid');
      await ApiKeyManager.deleteUserToken();
      await ApiKeyManager.deleteExpiredAt();
      
      error.response.data = {
        ...error.response.data,
        authError: true,
        message: 'Session expired. Please login again.'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout';
    } else if (!error.response) {
      error.message = 'No internet connection';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints - PERBAIKI: Sesuaikan dengan DummyJSON documentation
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login', // ✅ Correct endpoint for DummyJSON
    CURRENT_USER: '/auth/me',
  },
  PRODUCTS: {
    ALL: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    SEARCH: (query: string) => `/products/search?q=${query}`,
  },
  USERS: {
    CURRENT: '/auth/me',
    BY_ID: (id: string) => `/users/${id}`,
  }
} as const;

export default apiClient;