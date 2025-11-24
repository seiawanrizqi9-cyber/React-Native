import { useState, useCallback } from 'react';

interface RetryState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  lastAttempt: number | null;
}

interface UseRetryReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  lastAttempt: number | null;
  executeWithRetry: (asyncFn: () => Promise<T>, options?: RetryOptions) => Promise<T | null>;
  reset: () => void;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  shouldRetry?: (error: any) => boolean;
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
    lastAttempt: null,
  });

  const executeWithRetry = useCallback(async (
    asyncFn: () => Promise<T>, 
    options: RetryOptions = {}
  ): Promise<T | null> => {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      shouldRetry = shouldRetryError
    } = options;

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      retryCount: 0,
      lastAttempt: Date.now()
    }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries + 1}`);
        
        const result = await asyncFn();
        
        setState({
          data: result,
          isLoading: false,
          error: null,
          retryCount: attempt,
          lastAttempt: Date.now(),
        });
        
        return result;
      } catch (error: any) {
        console.log(`❌ Retry attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);

        // Cek apakah error boleh di-retry
        const canRetry = shouldRetry(error) && attempt < maxRetries;

        if (canRetry) {
          // Exponential backoff: 1s, 2s, 4s
          const waitTime = baseDelay * Math.pow(2, attempt);
          console.log(`⏳ Waiting ${waitTime}ms before retry ${attempt + 1}`);
          await delay(waitTime);
          
          setState(prev => ({ 
            ...prev, 
            retryCount: attempt + 1,
            lastAttempt: Date.now()
          }));
        } else {
          // Semua retry gagal atau error tidak boleh di-retry
          const finalError = attempt === maxRetries 
            ? 'Gagal memuat data setelah beberapa percobaan. Silakan coba lagi nanti.' 
            : error.message;

          setState({
            data: null,
            isLoading: false,
            error: finalError,
            retryCount: attempt,
            lastAttempt: Date.now(),
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
      lastAttempt: null,
    });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    retryCount: state.retryCount,
    lastAttempt: state.lastAttempt,
    executeWithRetry,
    reset,
  };
};