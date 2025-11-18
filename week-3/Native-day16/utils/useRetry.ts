import { useState, useCallback } from 'react';

interface RetryState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

interface UseRetryReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  executeWithRetry: (asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper untuk deteksi error yang boleh di-retry
const shouldRetryError = (error: any): boolean => {
  // Hanya retry network errors & timeouts
  const isNetworkError = 
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network') ||
    error.message?.includes('Network') ||
    error.message?.includes('internet') ||
    error.message?.includes('timeout') ||
    error.message?.includes('Timeout') ||
    !error.response; // No response berarti network error
  
  return isNetworkError;
};

export const useRetry = <T>(): UseRetryReturn<T> => {
  const [state, setState] = useState<RetryState<T>>({
    data: null,
    isLoading: false,
    error: null,
    retryCount: 0,
  });

  const executeWithRetry = useCallback(async (asyncFn: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null, retryCount: 0 }));

    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn();
        
        setState({
          data: result,
          isLoading: false,
          error: null,
          retryCount: attempt,
        });
        
        return result;
      } catch (error: any) {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);

        // Cek apakah error boleh di-retry
        const canRetry = shouldRetryError(error) && attempt < maxRetries;

        if (canRetry) {
          // Exponential backoff: 1s, 2s, 4s
          const waitTime = baseDelay * Math.pow(2, attempt);
          console.log(`Waiting ${waitTime}ms before retry ${attempt + 1}`);
          await delay(waitTime);
          
          setState(prev => ({ 
            ...prev, 
            retryCount: attempt + 1 
          }));
        } else {
          // Semua retry gagal atau error tidak boleh di-retry
          setState({
            data: null,
            isLoading: false,
            error: attempt === maxRetries 
              ? 'silakan datang di lain waktu' 
              : error.message,
            retryCount: attempt,
          });
          return null;
        }
      }
    }

    return null;
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    retryCount: state.retryCount,
    executeWithRetry,
    reset,
  };
};