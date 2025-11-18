import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeychainService from './keychainService';

interface AppInitializationData {
  token: string | null;
  userPreferences: any;
  isAuthenticated: boolean;
  securityError: string | null;
}

interface AppInitializationState {
  isLoading: boolean;
  data: AppInitializationData | null;
  error: string | null;
}

export const useAppInitialization = () => {
  const [state, setState] = useState<AppInitializationState>({
    isLoading: true,
    data: null,
    error: null,
  });

  const initializeApp = useCallback(async () => {
    try {
      setState({ isLoading: true, data: null, error: null });

      // Load data secara paralel dari kedua storage (Hybrid Storage)
      const [tokenResult, userPreferencesResult, keychainAvailable] = await Promise.all([
        // Token dari Keychain (secure storage)
        KeychainService.getUserToken(),
        
        // Preferensi user dari AsyncStorage
        AsyncStorage.getItem('@user_preferences'),
        
        // Cek ketersediaan Keychain
        KeychainService.isKeychainAvailable(),
      ]);

      // Handle Keychain availability
      if (!keychainAvailable) {
        throw new Error('Keychain tidak tersedia di perangkat ini');
      }

      // Handle token result
      let token = null;
      let securityError = null;
      let isAuthenticated = false;

      if (tokenResult.success && tokenResult.data) {
        token = tokenResult.data;
        isAuthenticated = true;
      } else if (tokenResult.error === 'ACCESS_DENIED: Security settings changed') {
        // Security error - reset token
        await KeychainService.deleteUserToken();
        await AsyncStorage.multiRemove(['@is_logged_in', '@user_profile']);
        securityError = 'Keamanan perangkat diubah, mohon login ulang.';
      }

      // Parse user preferences
      let userPreferences = null;
      try {
        userPreferences = userPreferencesResult ? JSON.parse(userPreferencesResult) : null;
      } catch (parseError) {
        console.warn('Gagal parse user preferences:', parseError);
        userPreferences = null;
      }

      // Default preferences jika tidak ada
      if (!userPreferences) {
        userPreferences = {
          theme: 'light',
          language: 'id',
          notifications: true,
          autoSync: true,
        };
      }

      const initializationData: AppInitializationData = {
        token,
        userPreferences,
        isAuthenticated,
        securityError,
      };

      setState({
        isLoading: false,
        data: initializationData,
        error: null,
      });

      return initializationData;

    } catch (error: any) {
      console.error('App initialization error:', error);
      
      const errorMessage = error.message || 'Gagal memulai aplikasi';
      
      setState({
        isLoading: false,
        data: null,
        error: errorMessage,
      });

      return null;
    }
  }, []);

  const saveUserPreferences = useCallback(async (preferences: any) => {
    try {
      await AsyncStorage.setItem('@user_preferences', JSON.stringify(preferences));
      
      // Update state jika perlu
      setState(prev => ({
        ...prev,
        data: prev.data ? { ...prev.data, userPreferences: preferences } : null,
      }));
      
      return true;
    } catch (error) {
      console.error('Gagal menyimpan preferensi:', error);
      return false;
    }
  }, []);

  const clearSecurityError = useCallback(() => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, securityError: null } : null,
    }));
  }, []);

  const resetInitialization = useCallback(() => {
    setState({
      isLoading: true,
      data: null,
      error: null,
    });
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return {
    isLoading: state.isLoading,
    data: state.data,
    error: state.error,
    initializeApp,
    saveUserPreferences,
    clearSecurityError,
    resetInitialization,
  };
};