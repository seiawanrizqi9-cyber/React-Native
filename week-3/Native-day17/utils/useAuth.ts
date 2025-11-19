import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeychainService from './keychainService';
import { ProfileDeepLinkResult } from '../navigation/types'; // ✅ TAMBAHKAN IMPORT

const USER_STORAGE_KEY = '@user_profile';
const IS_LOGGED_IN_KEY = '@is_logged_in';
const USER_PREFERENCES_KEY = '@user_preferences';

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  securityError: string | null;
}

// Dummy user database untuk validasi
const dummyUsers: Record<string, User> = {
  'user123': {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08123456789',
    address: 'Jl. Contoh Alamat No. 123',
    userId: 'user123'
  },
  'user456': {
    name: 'Jane Smith',
    email: 'jane@example.com', 
    phone: '0876543210',
    address: 'Jl. Sample Street No. 456',
    userId: 'user456'
  },
  'admin': {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '08111222333',
    address: 'Jl. Admin Street No. 789',
    userId: 'admin'
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
    isLoading: true,
    securityError: null,
  });

  const loadAuthData = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, securityError: null }));

      // Load data secara paralel dari kedua storage (Hybrid Storage)
      const [userData, _preferences, tokenResult] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(USER_PREFERENCES_KEY),
        KeychainService.getUserToken(), // Token dari Keychain
      ]);

      // Handle token result dari Keychain
      if (!tokenResult.success) {
        if (tokenResult.error === 'ACCESS_DENIED: Security settings changed') {
          // Security error - reset token dan force login
          await KeychainService.deleteUserToken();
          await AsyncStorage.multiRemove([IS_LOGGED_IN_KEY, USER_STORAGE_KEY]);
          
          setAuthState({
            isLoggedIn: false,
            user: null,
            token: null,
            isLoading: false,
            securityError: 'Keamanan perangkat diubah, mohon login ulang.',
          });
          return;
        }
        
        // Token tidak ditemukan atau error lainnya
        setAuthState({
          isLoggedIn: false,
          user: null,
          token: null,
          isLoading: false,
          securityError: null,
        });
        return;
      }

      // Token ditemukan, lanjut load user data
      const user = userData ? JSON.parse(userData) : null;
      
      setAuthState({
        isLoggedIn: true,
        user,
        token: tokenResult.data || null,
        isLoading: false,
        securityError: null,
      });

    } catch (error: any) {
      console.error('Gagal memuat data auth:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        securityError: 'Gagal memuat data autentikasi'
      }));
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  // Function untuk validasi userId dari deep link
  const validateUserId = useCallback((userId: string): ProfileDeepLinkResult => {
    // Validasi basic format
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return {
        success: false,
        error: 'ID pengguna tidak valid',
        isValidFormat: false,
        userExists: false
      };
    }

    // Validasi length dan karakter
    const isValidFormat = /^[a-zA-Z0-9_-]{3,20}$/.test(userId);
    if (!isValidFormat) {
      return {
        success: false,
        error: 'Format ID pengguna tidak valid. Harus 3-20 karakter (huruf, angka, -, _)',
        isValidFormat: false,
        userExists: false
      };
    }

    // Cek apakah user exists di dummy database
    const userExists = !!dummyUsers[userId];
    
    if (!userExists) {
      return {
        success: false,
        error: `Pengguna dengan ID "${userId}" tidak ditemukan`,
        isValidFormat: true,
        userExists: false,
        userId
      };
    }

    return {
      success: true,
      userId,
      isValidFormat: true,
      userExists: true
    };
  }, []);

  // Function untuk get user data by ID
  const getUserById = useCallback((userId: string): User | null => {
    return dummyUsers[userId] || null;
  }, []);

  const login = useCallback(async (userData: User, token?: string) => {
    try {
      const authToken = token || `dummy_jwt_token_${Date.now()}`;
      
      // Simpan ke kedua storage secara paralel
      await Promise.all([
        // Simpan token ke Keychain (secure storage)
        KeychainService.saveUserToken(authToken),
        
        // Simpan user data ke AsyncStorage
        AsyncStorage.multiSet([
          [USER_STORAGE_KEY, JSON.stringify(userData)],
          [IS_LOGGED_IN_KEY, 'true'],
        ]),
      ]);

      setAuthState({
        isLoggedIn: true,
        user: userData,
        token: authToken,
        isLoading: false,
        securityError: null,
      });

      return authToken;
    } catch (error: any) {
      console.error('Gagal login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Hapus dari Keychain FIRST (secure storage)
      await KeychainService.deleteUserToken();
      
      // THEN hapus dari AsyncStorage
      await AsyncStorage.multiRemove([
        USER_STORAGE_KEY,
        IS_LOGGED_IN_KEY,
        USER_PREFERENCES_KEY,
      ]);

      // FINALLY update state
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
        isLoading: false,
        securityError: null,
      });
    } catch (error: any) {
      console.error('Gagal logout:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setAuthState(prev => ({ ...prev, user: userData }));
    } catch (error: any) {
      console.error('Gagal update user:', error);
      throw error;
    }
  }, []);

  const saveUserPreferences = useCallback(async (preferences: any) => {
    try {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error: any) {
      console.error('Gagal menyimpan preferensi:', error);
      throw error;
    }
  }, []);

  const getUserPreferences = useCallback(async () => {
    try {
      const preferences = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error: any) {
      console.error('Gagal memuat preferensi:', error);
      return null;
    }
  }, []);

  const getToken = useCallback(() => {
    return authState.token;
  }, [authState.token]);

  const clearSecurityError = useCallback(() => {
    setAuthState(prev => ({ ...prev, securityError: null }));
  }, []);

  // FUNGSI BARU: Cek apakah user sudah login
  const requireLogin = useCallback((): boolean => {
    return authState.isLoggedIn && !authState.isLoading;
  }, [authState.isLoggedIn, authState.isLoading]);

  return {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    securityError: authState.securityError,
    login,
    logout,
    updateUser,
    saveUserPreferences,
    getUserPreferences,
    loadAuthData,
    getToken,
    clearSecurityError,
    requireLogin,
    // Export fungsi validasi baru
    validateUserId,
    getUserById,
  };
};