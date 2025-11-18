import KeychainService from './keychainService';

interface ApiKeyManagerResult {
  success: boolean;
  apiKey?: string;
  error?: string;
}

class ApiKeyManager {
  private static readonly STATIC_API_KEY = 'API_KEY_SECRET_XYZ_123456789';
  private static readonly API_KEY_USERNAME = 'api_client';

  // Inisialisasi API Key di Keychain
  static async initializeApiKey(): Promise<ApiKeyManagerResult> {
    try {
      // Cek apakah API Key sudah ada
      const existingKey = await KeychainService.getApiKey();
      
      if (existingKey.success && existingKey.data) {
        console.log('✅ API Key sudah tersedia di Keychain');
        return { success: true, apiKey: existingKey.data };
      }

      // Simpan API Key baru ke Keychain
      const saveResult = await KeychainService.saveApiKey(this.STATIC_API_KEY);
      
      if (saveResult.success) {
        console.log('✅ API Key berhasil disimpan ke Keychain');
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

  // Ambil API Key dari Keychain
  static async getApiKey(): Promise<ApiKeyManagerResult> {
    try {
      const keychainResult = await KeychainService.getApiKey();

      if (keychainResult.success && keychainResult.data) {
        return { success: true, apiKey: keychainResult.data };
      }

      // Jika API Key tidak ditemukan, coba inisialisasi ulang
      if (keychainResult.error === 'API key not found in Keychain') {
        console.log('🔄 API Key tidak ditemukan, melakukan inisialisasi...');
        return await this.initializeApiKey();
      }

      // Handle access denied error
      if (keychainResult.error?.includes('ACCESS_DENIED')) {
        return {
          success: false,
          error: 'ACCESS_DENIED: Tidak dapat mengakses API Key',
        };
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

  // Rotate API Key (simulasi)
  static async rotateApiKey(newApiKey?: string): Promise<ApiKeyManagerResult> {
    try {
      const apiKeyToSave = newApiKey || `ROTATED_KEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const saveResult = await KeychainService.saveApiKey(apiKeyToSave);
      
      if (saveResult.success) {
        console.log('✅ API Key berhasil di-rotate');
        return { success: true, apiKey: apiKeyToSave };
      } else {
        throw new Error(saveResult.error || 'Gagal memutar API Key');
      }
    } catch (error: any) {
      console.error('Rotate API Key error:', error);
      return {
        success: false,
        error: error.message || 'Gagal memutar API Key',
      };
    }
  }

  // Hapus API Key dari Keychain
  static async deleteApiKey(): Promise<ApiKeyManagerResult> {
    try {
      const deleteResult = await KeychainService.deleteApiKey();
      
      if (deleteResult.success) {
        console.log('✅ API Key berhasil dihapus dari Keychain');
        return { success: true };
      } else {
        throw new Error(deleteResult.error || 'Gagal menghapus API Key');
      }
    } catch (error: any) {
      console.error('Delete API Key error:', error);
      return {
        success: false,
        error: error.message || 'Gagal menghapus API Key',
      };
    }
  }

  // Validasi API Key format
  static validateApiKeyFormat(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }

    // Basic validation - minimal length dan mengandung karakter yang expected
    const isValidLength = apiKey.length >= 10 && apiKey.length <= 100;
    const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(apiKey);

    return isValidLength && hasValidChars;
  }

  // Cek status API Key
  static async checkApiKeyStatus(): Promise<{
    exists: boolean;
    isValid: boolean;
    error?: string;
  }> {
    try {
      const apiKeyResult = await this.getApiKey();
      
      if (apiKeyResult.success && apiKeyResult.apiKey) {
        const isValid = this.validateApiKeyFormat(apiKeyResult.apiKey);
        return {
          exists: true,
          isValid,
          error: isValid ? undefined : 'Format API Key tidak valid',
        };
      } else {
        return {
          exists: false,
          isValid: false,
          error: apiKeyResult.error,
        };
      }
    } catch (error: any) {
      return {
        exists: false,
        isValid: false,
        error: error.message || 'Gagal memeriksa status API Key',
      };
    }
  }
}

export default ApiKeyManager;