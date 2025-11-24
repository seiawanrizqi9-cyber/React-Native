import {
  isSensorAvailable,
  simplePrompt,
  authenticateWithOptions,
  BiometryType
} from '@sbaiahmed1/react-native-biometrics';
import { Alert } from 'react-native';
import KeychainService from './keychainService';

export interface BiometricResult {
  success: boolean;
  error?: string;
  errorCode?: string;
  biometryType?: string;
}

export interface BiometricAvailability {
  available: boolean;
  biometryType?: string;
  error?: string;
  errorCode?: string;
}

class BiometricService {
  // Cek ketersediaan sensor biometric
  async checkBiometricAvailability(): Promise<BiometricAvailability> {
    try {
      const sensorInfo = await isSensorAvailable();
      
      console.log('🔐 Biometric availability:', sensorInfo);

      return {
        available: sensorInfo.available,
        biometryType: sensorInfo.biometryType,
      };
    } catch (error: any) {
      console.error('❌ Biometric availability check failed:', error);
      return {
        available: false,
        error: error.message || 'Failed to check biometric availability',
        errorCode: 'CHECK_FAILED'
      };
    }
  }

  // Deteksi jika user belum enroll biometric
  isNotEnrolledError(error: string): boolean {
    const notEnrolledIndicators = [
      'not enrolled',
      'not_enrolled',
      'no biometric',
      'no fingerprints',
      'no face',
      'biometry is not enrolled',
      'BiometryNotEnrolled'
    ];

    return notEnrolledIndicators.some(indicator => 
      error.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  // Deteksi jika device dalam lockout state
  isLockoutError(error: string): boolean {
    const lockoutIndicators = [
      'lockout',
      'too many attempts',
      'max attempts',
      'authentication failed too many times',
      'BiometryLockout'
    ];

    return lockoutIndicators.some(indicator => 
      error.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  // Prompt biometric untuk login - VERSI DIPERBAIKI
  async promptBiometricLogin(): Promise<BiometricResult> {
    try {
      // Cek ketersediaan biometric terlebih dahulu
      const availability = await this.checkBiometricAvailability();
      
      if (!availability.available) {
        if (availability.error && this.isNotEnrolledError(availability.error)) {
          return {
            success: false,
            error: 'Biometric belum diatur di perangkat. Silakan atur di Settings terlebih dahulu.',
            errorCode: 'NOT_ENROLLED'
          };
        }
        
        return {
          success: false,
          error: 'Biometric tidak tersedia di perangkat ini.',
          errorCode: 'NOT_AVAILABLE'
        };
      }

      console.log('🔐 Starting biometric login prompt...');

      // Tentukan message berdasarkan tipe biometric
      let promptMessage = 'Autentikasi diperlukan untuk masuk';
      if (availability.biometryType === 'FaceID') {
        promptMessage = 'Pindai Wajah untuk Masuk';
      } else if (availability.biometryType === 'TouchID') {
        promptMessage = 'Tempelkan Jari untuk Masuk';
      }

      // Jalankan biometric prompt - VERSI DIPERBAIKI
      const result = await simplePrompt(promptMessage);

      if (result) {
        console.log('✅ Biometric authentication successful');
        return { 
          success: true, 
          biometryType: availability.biometryType 
        };
      } else {
        console.log('❌ Biometric authentication failed or cancelled');
        return { 
          success: false, 
          error: 'Autentikasi dibatalkan',
          errorCode: 'USER_CANCEL'
        };
      }

    } catch (error: any) {
      console.error('❌ Biometric prompt error:', error);
      
      // Handle lockout scenario
      if (this.isLockoutError(error.message)) {
        return {
          success: false,
          error: 'Terlalu banyak percobaan gagal. Sensor biometric terkunci sementara.',
          errorCode: 'LOCKOUT'
        };
      }

      // Handle not enrolled scenario
      if (this.isNotEnrolledError(error.message)) {
        return {
          success: false,
          error: 'Biometric belum diatur di perangkat. Silakan atur di Settings terlebih dahulu.',
          errorCode: 'NOT_ENROLLED'
        };
      }

      return {
        success: false,
        error: error.message || 'Terjadi kesalahan saat autentikasi',
        errorCode: 'UNKNOWN_ERROR'
      };
    }
  }

  // Prompt biometric untuk konfirmasi transaksi dengan options advanced - VERSI DIPERBAIKI
  async promptTransactionConfirmation(amount: number, description: string = 'Transfer'): Promise<BiometricResult> {
    try {
      const availability = await this.checkBiometricAvailability();
      
      if (!availability.available) {
        return {
          success: false,
          error: 'Biometric tidak tersedia untuk konfirmasi transaksi.',
          errorCode: 'NOT_AVAILABLE'
        };
      }

      // Custom message untuk transaksi
      let promptTitle = `Konfirmasi ${description}`;
      let promptSubtitle = `Rp ${amount.toLocaleString('id-ID')}`;
      
      if (availability.biometryType === 'FaceId') {
        promptTitle = `Pindai Wajah untuk ${description}`;
      } else if (availability.biometryType === 'TouchId') {
        promptTitle = `Tempelkan Jari untuk ${description}`;
      }

      console.log('💰 Transaction biometric prompt:', { promptTitle, promptSubtitle });

      // Gunakan authenticateWithOptions untuk kontrol lebih detail - VERSI DIPERBAIKI
      const result = await authenticateWithOptions({
        title: promptTitle,
        subtitle: promptSubtitle,
        description: `Pastikan ini adalah transaksi yang Anda inginkan`,
        cancelLabel: 'Batalkan Transaksi',
        fallbackLabel: 'Ganti Metode',
        allowDeviceCredentials: true, // Izinkan fallback ke PIN/password
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log('✅ Transaction confirmation successful');
        return { 
          success: true, 
          biometryType: availability.biometryType 
        };
      } else {
        console.log('❌ Transaction confirmation failed:', result.error);
        return { 
          success: false, 
          error: result.error || 'Konfirmasi transaksi gagal',
          errorCode: result.errorCode || 'AUTH_FAILED'
        };
      }

    } catch (error: any) {
      console.error('❌ Transaction confirmation error:', error);
      
      if (this.isLockoutError(error.message)) {
        return {
          success: false,
          error: 'Terlalu banyak percobaan gagal. Sensor biometric terkunci.',
          errorCode: 'LOCKOUT'
        };
      }

      return {
        success: false,
        error: error.message || 'Terjadi kesalahan saat konfirmasi transaksi',
        errorCode: 'UNKNOWN_ERROR'
      };
    }
  }

  // Handle lockout scenario - force logout dan hapus data sensitif
  async handleBiometricLockout(): Promise<void> {
    try {
      console.log('🚨 Handling biometric lockout - performing security cleanup');
      
      // Hapus token dari Keychain
      await KeychainService.deleteUserToken();
      
      // Hapus data sensitif lainnya
      await KeychainService.clearAllKeychainData();
      
      console.log('✅ Security cleanup completed after biometric lockout');
      
      // Tampilkan alert ke user
      Alert.alert(
        'Keamanan Diperketat',
        'Terlalu banyak percobaan autentikasi gagal. Untuk keamanan, Anda harus login ulang.',
        [{ text: 'Mengerti', style: 'default' }]
      );
      
    } catch (error) {
      console.error('❌ Failed to handle biometric lockout:', error);
    }
  }

  // Dapatkan tipe biometric yang tersedia
  async getBiometryType(): Promise<string | null> {
    try {
      const availability = await this.checkBiometricAvailability();
      return availability.biometryType || null;
    } catch (error) {
      console.error('❌ Failed to get biometry type:', error);
      return null;
    }
  }

  // Simple biometric check untuk quick validation
  async quickBiometricCheck(): Promise<boolean> {
    try {
      const availability = await this.checkBiometricAvailability();
      return availability.available;
    } catch (error) {
      console.error('Quick biometric check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const biometricService = new BiometricService();
export default biometricService;