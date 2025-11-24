import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ApiKeyManager from './api/apiKeyManager';
import apiClient, { API_ENDPOINTS } from './api/apiClient';
import { ProfileDeepLinkResult } from '../navigation/types';

const USER_STORAGE_KEY = '@user_profile';
const IS_LOGGED_IN_KEY = '@is_logged_in';
const USER_PREFERENCES_KEY = '@user_preferences';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  securityError: string | null;
  isLoggingOut: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
    isLoading: true,
    securityError: null,
    isLoggingOut: false,
  });

  const navigation = useNavigation();

  const clearAllUserData = useCallback(async (): Promise<{
    success: boolean;
    errors: string[];
  }> => {
    const errors: string[] = [];

    try {
      console.log('🧹 Starting data cleanup...');

      // Delete secure token
      const tokenResult = await ApiKeyManager.deleteUserToken();
      if (!tokenResult.success) {
        errors.push(`Token deletion failed: ${tokenResult.error}`);
      }

      // Delete AsyncStorage data
      const storageKeys = [
        USER_STORAGE_KEY,
        IS_LOGGED_IN_KEY,
        USER_PREFERENCES_KEY,
        '@cart_items',
        '@wishlist_ids',
        '@wishlist_meta',
        '@token_expired_at',
      ];

      try {
        await AsyncStorage.multiRemove(storageKeys);
        console.log(`✅ Deleted ${storageKeys.length} storage keys`);
      } catch (storageError: any) {
        errors.push(`Storage cleanup failed: ${storageError.message}`);
        // Fallback individual deletion
        for (const key of storageKeys) {
          try {
            await AsyncStorage.removeItem(key);
          } catch (e) {
            // Continue silently
          }
        }
      }

      return {
        success: errors.length === 0,
        errors,
      };
    } catch (error: any) {
      console.error('❌ Data cleanup failed:', error);
      errors.push(`Logout process failed: ${error.message}`);
      return { success: false, errors };
    }
  }, []);

  const resetNavigationToLogin = useCallback(() => {
    try {
      // Reset navigation ke Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    } catch (navError) {
      console.error('❌ Navigation reset failed:', navError);
      // Fallback: navigate biasa
      navigation.navigate('Login' as never);
    }
  }, [navigation]);

  const logout = useCallback(async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoggingOut: true }));

      const cleanupResult = await clearAllUserData();

      // Reset state regardless of cleanup result
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
        isLoading: false,
        securityError: null,
        isLoggingOut: false,
      });

      resetNavigationToLogin();

      return {
        success: true,
        message:
          cleanupResult.errors.length > 0
            ? `Logout completed with ${cleanupResult.errors.length} warning(s)`
            : 'Logout successful',
      };
    } catch (error: any) {
      console.error('❌ Logout error:', error);

      // Force reset state
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
        isLoading: false,
        securityError: 'Logout failed. Please try again.',
        isLoggingOut: false,
      });

      resetNavigationToLogin();

      return {
        success: false,
        message: error.message || 'Logout failed',
      };
    }
  }, [clearAllUserData, resetNavigationToLogin]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, securityError: null }));

      console.log('🔐 Attempting login with username:', username);

      // DEBUG: Log the API endpoint and request
      console.log('🌐 API Endpoint:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('📤 Request payload:', {
        username: username.trim(),
        password: password.trim(),
      });

      // Make the login request with timeout
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username: username.trim(),
        password: password.trim(),
      });

      console.log('✅ Login response status:', response.status);
      console.log('📥 Login response data:', response.data);

      // Check if we have the expected response
      if (!response.data) {
        throw new Error('No response data received from server');
      }

      // DummyJSON returns accessToken, not token
      const { accessToken, ...userData } = response.data;

      console.log('🔑 AccessToken received:', !!accessToken);
      console.log('👤 User data received:', userData);

      if (!accessToken) {
        console.error('❌ No accessToken in response:', response.data);
        throw new Error(
          'No authentication token received from server. Please check your credentials.',
        );
      }

      // Save token
      await ApiKeyManager.saveUserToken(accessToken, 24 * 60 * 60 * 1000);

      // Create user object with token for compatibility
      const userWithToken = {
        ...userData,
        token: accessToken,
      };

      // Save user data ke AsyncStorage
      await AsyncStorage.multiSet([
        [USER_STORAGE_KEY, JSON.stringify(userWithToken)],
        [IS_LOGGED_IN_KEY, 'true'],
      ]);

      // PERBAIKAN PENTING: Update state dengan user data yang baru
      setAuthState({
        isLoggedIn: true,
        user: userWithToken,
        token: accessToken,
        isLoading: false,
        securityError: null,
        isLoggingOut: false,
      });

      console.log('🎉 Login successful for user:', userData.username);
      return { user: userWithToken, token: accessToken };
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });

      let errorMessage = 'Login failed. Please try again.';

      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        console.log('🔍 Error response details:', { status, data });

        if (status === 400) {
          errorMessage = data?.message || 'Invalid username or password';
        } else if (status === 404) {
          errorMessage = 'Authentication service not found';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (status === 429) {
          errorMessage = 'Too many login attempts. Please wait and try again.';
        } else {
          errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log('📡 No response received - network issue');
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        securityError: errorMessage,
      }));

      throw new Error(errorMessage);
    }
  }, []);

  const loadAuthData = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, securityError: null }));

      // PERBAIKAN: Load semua data secara paralel
      const [userData, tokenResult, isLoggedIn] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        ApiKeyManager.getUserToken(),
        AsyncStorage.getItem(IS_LOGGED_IN_KEY),
      ]);

      console.log('🔄 Loading auth data:', {
        hasUserData: !!userData,
        tokenSuccess: tokenResult.success,
        isLoggedIn: isLoggedIn === 'true',
      });

      // PERBAIKAN: Cek semua kondisi untuk menentukan status login
      const hasValidToken = tokenResult.success && !!tokenResult.token;
      const isUserLoggedIn = isLoggedIn === 'true';

      if (!hasValidToken) {
        if (
          tokenResult.error === 'TOKEN_EXPIRED' ||
          tokenResult.error?.includes('ACCESS_DENIED')
        ) {
          console.log('🔐 Token invalid, auto-logout...');
          await logout();
          return;
        }

        console.log('🔐 No valid token found, setting logged out state');
        setAuthState({
          isLoggedIn: false,
          user: null,
          token: null,
          isLoading: false,
          securityError: null,
          isLoggingOut: false,
        });
        return;
      }

      // Parse user data jika ada
      let user = null;
      if (userData) {
        try {
          user = JSON.parse(userData);
          console.log('👤 User data loaded from storage:', user.username);
        } catch (parseError) {
          console.error('❌ Corrupted user data, clearing...', parseError);
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      // PERBAIKAN: Pastikan state konsisten
      const shouldBeLoggedIn = hasValidToken && isUserLoggedIn;

      console.log('🔐 Final auth state:', {
        shouldBeLoggedIn,
        hasValidToken,
        isUserLoggedIn,
        hasUser: !!user,
      });

      setAuthState({
        isLoggedIn: shouldBeLoggedIn,
        user: shouldBeLoggedIn ? user : null,
        token: shouldBeLoggedIn ? tokenResult.token || null : null,
        isLoading: false,
        securityError: null,
        isLoggingOut: false,
      });
    } catch (error: any) {
      console.error('❌ Failed to load auth data:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        securityError: 'Failed to load authentication data',
      }));
    }
  }, [logout]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const tokenResult = await ApiKeyManager.getUserToken();
      return tokenResult.success && !!tokenResult.token;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setAuthState(prev => ({ ...prev, user: userData }));
    } catch (error: any) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, []);

  const saveUserPreferences = useCallback(async (preferences: any) => {
    try {
      await AsyncStorage.setItem(
        USER_PREFERENCES_KEY,
        JSON.stringify(preferences),
      );
    } catch (error: any) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  }, []);

  const getUserPreferences = useCallback(async () => {
    try {
      const preferences = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error: any) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }, []);

  const getToken = useCallback(() => {
    return authState.token;
  }, [authState.token]);

  const clearSecurityError = useCallback(() => {
    setAuthState(prev => ({ ...prev, securityError: null }));
  }, []);

  const requireLogin = useCallback((): boolean => {
    return !!(authState.isLoggedIn && !authState.isLoading);
  }, [authState.isLoggedIn, authState.isLoading]);

  const validateUserId = useCallback(
    (userId: string): ProfileDeepLinkResult => {
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return {
          success: false,
          error: 'User ID is invalid',
          isValidFormat: false,
          userExists: false,
        };
      }

      const isValidFormat = /^[a-zA-Z0-9_-]{3,20}$/.test(userId);
      if (!isValidFormat) {
        return {
          success: false,
          error:
            'User ID format is invalid. Must be 3-20 characters (letters, numbers, -, _)',
          isValidFormat: false,
          userExists: false,
        };
      }

      return {
        success: true,
        userId,
        isValidFormat: true,
        userExists: true,
      };
    },
    [],
  );

  const getUserById = useCallback((_userId: string): User | null => {
    return null;
  }, []);

  // PERBAIKAN: Load auth data saat component mount
  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  return {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    securityError: authState.securityError,
    isLoggingOut: authState.isLoggingOut,
    login,
    logout,
    updateUser,
    saveUserPreferences,
    getUserPreferences,
    loadAuthData,
    getToken,
    clearSecurityError,
    requireLogin,
    validateToken,
    validateUserId,
    getUserById,
  };
};