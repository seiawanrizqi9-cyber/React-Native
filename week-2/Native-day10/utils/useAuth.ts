import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@user_profile';
const IS_LOGGED_IN_KEY = '@is_logged_in';

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);
      if (loggedIn === 'true') {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Gagal memuat data auth:', error);
    }
  };

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(IS_LOGGED_IN_KEY, 'true');
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Gagal login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(IS_LOGGED_IN_KEY);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Gagal logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Gagal update user:', error);
      throw error;
    }
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    updateUser,
    loadAuthData, // Export juga untuk manual refresh
  };
};