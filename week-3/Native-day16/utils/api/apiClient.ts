import axios from 'axios';
import { ValidationError } from '../validationError';
import ApiKeyManager from './apiKeyManager';

// Axios instance untuk semua API calls
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Tambah header X-Client-Platform dan X-API-Key otomatis ke semua request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Header dasar
      config.headers['X-Client-Platform'] = 'React-Native';
      
      // Ambil API Key dari Keychain
      const apiKeyResult = await ApiKeyManager.getApiKey();
      
      if (apiKeyResult.success && apiKeyResult.apiKey) {
        config.headers['X-API-Key'] = apiKeyResult.apiKey;
        console.log('✅ API Key berhasil ditambahkan ke header');
      } else {
        // API Key tidak ditemukan - throw error untuk menghentikan request
        console.error('❌ API Key tidak ditemukan:', apiKeyResult.error);
        throw new Error('UNAUTHORIZED: API Key tidak tersedia');
      }
      
      return config;
    } catch (error: any) {
      console.error('Request interceptor error:', error);
      
      // Handle unauthorized error
      if (error.message?.includes('UNAUTHORIZED')) {
        throw {
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'API Key tidak tersedia. Silakan login ulang.' }
          }
        };
      }
      
      // Propagate error lainnya
      throw error;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR BARU UNTUK VALIDATION ERRORS DAN API KEY ERRORS
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Tangani HTTP 400 Validation Errors
    if (error.response?.status === 400 && error.response?.data?.errors) {
      const fieldErrors = error.response.data.errors;
      console.log('Validation Error Detected:', fieldErrors);
      throw new ValidationError(fieldErrors);
    }
    
    // Tangani HTTP 401 Unauthorized (API Key error)
    if (error.response?.status === 401) {
      console.error('❌ API Key error - Unauthorized access');
      
      // Coba refresh API Key sekali
      try {
        console.log('🔄 Mencoba refresh API Key...');
        const refreshResult = await ApiKeyManager.initializeApiKey();
        
        if (refreshResult.success) {
          console.log('✅ API Key berhasil di-refresh, retry request...');
          // Retry original request dengan API Key baru
          const retryConfig = {
            ...error.config,
            headers: {
              ...error.config.headers,
              'X-API-Key': refreshResult.apiKey,
            }
          };
          return apiClient.request(retryConfig);
        } else {
          throw new Error('Gagal refresh API Key');
        }
      } catch (refreshError) {
        console.error('❌ Gagal refresh API Key:', refreshError);
        // Propagate original 401 error
        error.response.data = {
          ...error.response.data,
          apiKeyError: true,
          message: 'Autentikasi gagal. Silakan login ulang.'
        };
        throw error;
      }
    }
    
    // Error handling lainnya tetap sama
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout';
    } else if (!error.response) {
      error.message = 'No internet connection';
    }
    return Promise.reject(error);
  }
);

// Helper untuk cancellation
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancel = (error: any) => {
  return axios.isCancel(error);
};

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: {
    ALL: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
  },
  CARTS: {
    BY_USER: (userId: string) => `/carts/user/${userId}`,
  },
  CHECKOUT: '/checkout',
} as const;

// Fungsi untuk inisialisasi API Client saat app startup
export const initializeApiClient = async (): Promise<boolean> => {
  try {
    console.log('🚀 Menginisialisasi API Client...');
    const apiKeyResult = await ApiKeyManager.initializeApiKey();
    
    if (apiKeyResult.success) {
      console.log('✅ API Client berhasil diinisialisasi');
      return true;
    } else {
      console.error('❌ Gagal menginisialisasi API Client:', apiKeyResult.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error inisialisasi API Client:', error);
    return false;
  }
};

// Fungsi untuk cek status API Key
export const checkApiKeyStatus = async () => {
  return await ApiKeyManager.checkApiKeyStatus();
};

export default apiClient;