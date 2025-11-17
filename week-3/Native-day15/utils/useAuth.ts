import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@user_profile';
const IS_LOGGED_IN_KEY = '@is_logged_in';
const AUTH_TOKEN_KEY = '@auth_token';

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
    isLoading: true,
  });

  const loadAuthData = useCallback(async () => {
    try {
      // MultiGet untuk load semua data auth sekaligus
      const [loggedIn, userData, token] = await AsyncStorage.multiGet([
        IS_LOGGED_IN_KEY,
        USER_STORAGE_KEY,
        AUTH_TOKEN_KEY,
      ]);

      const isLoggedIn = loggedIn[1] === 'true';
      const user = userData[1] ? JSON.parse(userData[1]) : null;
      const authToken = token[1] || null;

      setAuthState({
        isLoggedIn,
        user,
        token: authToken,
        isLoading: false,
      });

      return { isLoggedIn, user, token: authToken };
    } catch (error) {
      console.error('Gagal memuat data auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { isLoggedIn: false, user: null, token: null };
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const login = useCallback(async (userData: User, token?: string) => {
    try {
      const authToken = token || `dummy_token_${Date.now()}`;
      
      // Simpan semua data auth sekaligus
      await AsyncStorage.multiSet([
        [IS_LOGGED_IN_KEY, 'true'],
        [USER_STORAGE_KEY, JSON.stringify(userData)],
        [AUTH_TOKEN_KEY, authToken],
      ]);

      setAuthState({
        isLoggedIn: true,
        user: userData,
        token: authToken,
        isLoading: false,
      });

      return authToken;
    } catch (error) {
      console.error('Gagal login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Hapus semua data auth sekaligus dengan multiRemove
      await AsyncStorage.multiRemove([
        IS_LOGGED_IN_KEY,
        USER_STORAGE_KEY,
        AUTH_TOKEN_KEY,
      ]);

      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Gagal logout:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setAuthState(prev => ({ ...prev, user: userData }));
    } catch (error) {
      console.error('Gagal update user:', error);
      throw error;
    }
  }, []);

  const getToken = useCallback(() => {
    return authState.token;
  }, [authState.token]);

  return {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    login,
    logout,
    updateUser,
    loadAuthData,
    getToken,
  };
};