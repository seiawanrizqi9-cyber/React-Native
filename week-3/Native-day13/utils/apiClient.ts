import axios from 'axios';

// Axios instance untuk semua API calls
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Tambah header X-Client-Platform otomatis ke semua request
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Client-Platform'] = 'React-Native';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk transformasi data nanti
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
} as const;

export default apiClient;