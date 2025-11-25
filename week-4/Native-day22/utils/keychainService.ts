import * as Keychain from 'react-native-keychain';

// Interface untuk response Keychain
interface KeychainResult {
  success: boolean;
  data?: string;
  error?: string;
}

class KeychainService {
  // Service names untuk isolasi
  private static readonly USER_TOKEN_SERVICE = 'com.ecom:userToken';
  private static readonly API_KEY_SERVICE = 'com.ecom:apiKey';

  // Simpan token user ke Keychain
  static async saveUserToken(token: string): Promise<KeychainResult> {
    try {
      const result = await Keychain.setGenericPassword(
        'user_token',
        token,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          service: this.USER_TOKEN_SERVICE,
        }
      );

      if (result === false) {
        throw new Error('Failed to save token to Keychain');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Keychain saveUserToken error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error saving token',
      };
    }
  }

  // Ambil token user dari Keychain
  static async getUserToken(): Promise<KeychainResult> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: this.USER_TOKEN_SERVICE,
      });

      if (credentials && credentials.password) {
        return {
          success: true,
          data: credentials.password,
        };
      }

      return {
        success: false,
        error: 'Token not found in Keychain',
      };
    } catch (error: any) {
      console.error('Keychain getUserToken error:', error);
      
      // Deteksi access denied error
      if (error.message?.includes('access') || error.message?.includes('denied')) {
        return {
          success: false,
          error: 'ACCESS_DENIED: Security settings changed',
        };
      }

      return {
        success: false,
        error: error.message || 'Unknown error retrieving token',
      };
    }
  }

  // Hapus token user dari Keychain
  static async deleteUserToken(): Promise<KeychainResult> {
    try {
      const result = await Keychain.resetGenericPassword({
        service: this.USER_TOKEN_SERVICE,
      });

      if (result === false) {
        throw new Error('Failed to delete token from Keychain');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Keychain deleteUserToken error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error deleting token',
      };
    }
  }

  // Simpan API Key ke Keychain
  static async saveApiKey(apiKey: string): Promise<KeychainResult> {
    try {
      const result = await Keychain.setGenericPassword(
        'api_client',
        apiKey,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          service: this.API_KEY_SERVICE,
        }
      );

      if (result === false) {
        throw new Error('Failed to save API key to Keychain');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Keychain saveApiKey error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error saving API key',
      };
    }
  }

  // Ambil API Key dari Keychain
  static async getApiKey(): Promise<KeychainResult> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: this.API_KEY_SERVICE,
      });

      if (credentials && credentials.password) {
        return {
          success: true,
          data: credentials.password,
        };
      }

      return {
        success: false,
        error: 'API key not found in Keychain',
      };
    } catch (error: any) {
      console.error('Keychain getApiKey error:', error);
      
      // Deteksi access denied error
      if (error.message?.includes('access') || error.message?.includes('denied')) {
        return {
          success: false,
          error: 'ACCESS_DENIED: Security settings changed',
        };
      }

      return {
        success: false,
        error: error.message || 'Unknown error retrieving API key',
      };
    }
  }

  // Hapus API Key dari Keychain
  static async deleteApiKey(): Promise<KeychainResult> {
    try {
      const result = await Keychain.resetGenericPassword({
        service: this.API_KEY_SERVICE,
      });

      if (result === false) {
        throw new Error('Failed to delete API key from Keychain');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Keychain deleteApiKey error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error deleting API key',
      };
    }
  }

  // Cek apakah Keychain tersedia di device
  static async isKeychainAvailable(): Promise<boolean> {
    try {
      await Keychain.getSupportedBiometryType();
      return true; // Keychain available even without biometry
    } catch (error) {
      console.error('Keychain not available:', error);
      return false;
    }
  }

  // Hapus semua data dari Keychain (untuk logout total)
  static async clearAllKeychainData(): Promise<KeychainResult> {
    try {
      const [tokenResult, apiKeyResult] = await Promise.all([
        this.deleteUserToken(),
        this.deleteApiKey(),
      ]);

      const allSuccess = tokenResult.success && apiKeyResult.success;

      return {
        success: allSuccess,
        error: allSuccess ? undefined : 'Failed to clear some Keychain data',
      };
    } catch (error: any) {
      console.error('Keychain clearAllKeychainData error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error clearing Keychain data',
      };
    }
  }
}

export default KeychainService;