import KeychainService from '../keychainService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPIRED_AT_KEY = '@token_expired_at';

interface ApiKeyManagerResult {
  success: boolean;
  apiKey?: string;
  token?: string;
  error?: string;
}

class ApiKeyManager {
  private static readonly STATIC_API_KEY = 'API_KEY_SECRET_XYZ_123456789';

  // USER TOKEN MANAGEMENT
  static async saveUserToken(token: string, expiresInMs: number = 24 * 60 * 60 * 1000): Promise<ApiKeyManagerResult> {
    try {
      // Simpan token ke Keychain
      const saveResult = await KeychainService.saveUserToken(token);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Gagal menyimpan token');
      }

      // Simpan expiry time ke AsyncStorage
      const expiredAt = Date.now() + expiresInMs;
      await AsyncStorage.setItem(EXPIRED_AT_KEY, expiredAt.toString());
      
      console.log('✅ Token berhasil disimpan, expires at:', new Date(expiredAt).toLocaleString());
      return { success: true, token };
    } catch (error: any) {
      console.error('Save user token error:', error);
      return {
        success: false,
        error: error.message || 'Gagal menyimpan token',
      };
    }
  }

  static async getUserToken(): Promise<ApiKeyManagerResult> {
    try {
      const keychainResult = await KeychainService.getUserToken();

      if (keychainResult.success && keychainResult.data) {
        // Cek expiry
        const isExpired = await this.isTokenExpired();
        if (isExpired) {
          console.log('🗑️ Token expired, cleaning up...');
          await this.deleteUserToken();
          return {
            success: false,
            error: 'TOKEN_EXPIRED: Token has expired',
          };
        }
        
        return { success: true, token: keychainResult.data };
      }

      return {
        success: false,
        error: keychainResult.error || 'Token tidak ditemukan',
      };
    } catch (error: any) {
      console.error('Get user token error:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengambil token',
      };
    }
  }

  static async isTokenExpired(): Promise<boolean> {
    try {
      const expiredAtStr = await AsyncStorage.getItem(EXPIRED_AT_KEY);
      if (!expiredAtStr) return true;

      const expiredAt = parseInt(expiredAtStr, 10);
      return Date.now() > expiredAt;
    } catch (error) {
      console.error('Check token expiry error:', error);
      return true;
    }
  }

  static async getTokenExpiry(): Promise<number | null> {
    try {
      const expiredAtStr = await AsyncStorage.getItem(EXPIRED_AT_KEY);
      return expiredAtStr ? parseInt(expiredAtStr, 10) : null;
    } catch (error) {
      console.error('Get token expiry error:', error);
      return null;
    }
  }

  static async deleteUserToken(): Promise<ApiKeyManagerResult> {
    try {
      await KeychainService.deleteUserToken();
      await AsyncStorage.removeItem(EXPIRED_AT_KEY);
      console.log('✅ Token berhasil dihapus');
      return { success: true };
    } catch (error: any) {
      console.error('Delete user token error:', error);
      return {
        success: false,
        error: error.message || 'Gagal menghapus token',
      };
    }
  }

  static async deleteExpiredAt(): Promise<void> {
    try {
      await AsyncStorage.removeItem(EXPIRED_AT_KEY);
    } catch (error) {
      console.error('Delete expiredAt error:', error);
    }
  }

  // API KEY MANAGEMENT
  static async initializeApiKey(): Promise<ApiKeyManagerResult> {
    try {
      const existingKey = await KeychainService.getApiKey();
      
      if (existingKey.success && existingKey.data) {
        return { success: true, apiKey: existingKey.data };
      }

      const saveResult = await KeychainService.saveApiKey(this.STATIC_API_KEY);
      
      if (saveResult.success) {
        return { success: true, apiKey: this.STATIC_API_KEY };
      } else {
        throw new Error(saveResult.error || 'Gagal menyimpan API Key');
      }
    } catch (error: any) {
      console.error('API Key initialization error:', error);
      return {
        success: false,
        error: error.message || 'Gagal menginisialisasi API Key',
      };
    }
  }

  static async getApiKey(): Promise<ApiKeyManagerResult> {
    try {
      const keychainResult = await KeychainService.getApiKey();

      if (keychainResult.success && keychainResult.data) {
        return { success: true, apiKey: keychainResult.data };
      }

      if (keychainResult.error === 'API key not found in Keychain') {
        return await this.initializeApiKey();
      }

      return {
        success: false,
        error: keychainResult.error || 'Gagal mengambil API Key',
      };
    } catch (error: any) {
      console.error('Get API Key error:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengambil API Key',
      };
    }
  }

  // Validasi token format
  static validateTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    return token.length >= 10 && /^[a-zA-Z0-9._-]+$/.test(token);
  }
}

export default ApiKeyManager;