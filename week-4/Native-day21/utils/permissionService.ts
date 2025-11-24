import { PermissionsAndroid, Platform, Alert } from 'react-native';

export class PermissionService {
  // Request camera permission
  static async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Izin Kamera',
          message: 'Aplikasi membutuhkan akses kamera untuk mengambil foto produk',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      return false;
    }
  }

  // Request storage permission for gallery access
  static async requestGalleryPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Izin Akses Penyimpanan',
          message: 'Aplikasi membutuhkan akses galeri untuk memilih foto produk',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting gallery permission:', err);
      return false;
    }
  }

  // Request storage permission for saving files with detailed rationale
  static async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Izin Menyimpan File ke Galeri',
          message: 'Aplikasi membutuhkan izin untuk menyimpan foto KTP ke galeri sebagai backup keamanan',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting storage permission:', err);
      return false;
    }
  }

  // ✅ TAHAP 1: Request location permission dengan rationale
  static async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.log('📍 Location permission always granted on iOS');
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Akses Lokasi',
          message: 'Kami butuh lokasi Anda untuk menampilkan toko terdekat secara akurat.',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        },
      );
      
      console.log('📍 Location permission result:', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  }

  // Enhanced storage permission with detailed rationale for backup
  static async requestStoragePermissionForBackup(): Promise<{
    granted: boolean;
    shouldShowRationale?: boolean;
  }> {
    if (Platform.OS !== 'android') {
      return { granted: true };
    }

    try {
      // Check current permission status first
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      // If already granted, return immediately
      if (hasPermission) {
        return { granted: true, shouldShowRationale: false };
      }

      // Request permission with detailed rationale
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Backup Foto KTP ke Galeri',
          message: 'Untuk keamanan akun Anda, kami ingin menyimpan foto KTP ke galeri sebagai backup. Foto akan disimpan di folder DCIM/BackupKTP dan hanya dapat diakses oleh Anda.',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak Backup',
          buttonPositive: 'Izinkan & Simpan',
        },
      );

      return {
        granted: granted === PermissionsAndroid.RESULTS.GRANTED,
        shouldShowRationale: !hasPermission && granted === PermissionsAndroid.RESULTS.DENIED
      };
    } catch (err) {
      console.error('Error requesting storage permission for backup:', err);
      return { granted: false };
    }
  }

  // Check all permissions status
  static async checkAllPermissions(): Promise<{
    camera: boolean;
    gallery: boolean;
    storage: boolean;
    location: boolean;
  }> {
    if (Platform.OS !== 'android') {
      return { camera: true, gallery: true, storage: true, location: true };
    }

    try {
      const [camera, gallery, storage, location] = await Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION),
      ]);

      return { camera, gallery, storage, location };
    } catch (err) {
      console.error('Error checking permissions:', err);
      return { camera: false, gallery: false, storage: false, location: false };
    }
  }

  // Show permission denied alert
  static showPermissionDeniedAlert(permissionType: string) {
    Alert.alert(
      'Izin Diperlukan',
      `Aplikasi membutuhkan izin ${permissionType} untuk melanjutkan. Silakan aktifkan izin di pengaturan perangkat.`,
      [
        { text: 'OK', style: 'default' },
      ],
    );
  }

  // Show storage permission rationale for backup
  static showStoragePermissionRationale() {
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        'Backup Foto KTP',
        'Dengan mengizinkan penyimpanan ke galeri, foto KTP Anda akan disimpan sebagai backup keamanan. Ini membantu memulihkan akun jika diperlukan.\n\nFoto hanya disimpan secara lokal di perangkat Anda.',
        [
          {
            text: 'Jangan Simpan',
            style: 'cancel',
            onPress: () => resolve(false)
          },
          {
            text: 'Izinkan & Simpan',
            style: 'default',
            onPress: () => resolve(true)
          },
        ],
      );
    });
  }

  // Show backup disabled warning
  static showBackupDisabledWarning() {
    Alert.alert(
      'Backup Dinonaktifkan',
      'Foto KTP tidak akan disimpan ke galeri. Anda masih dapat mengambil foto untuk verifikasi, tetapi tidak akan ada backup yang disimpan.\n\nAnda dapat mengaktifkan backup nanti di pengaturan.',
      [
        { text: 'Mengerti', style: 'default' },
      ]
    );
  }

  // Open app settings for permission management
  static async openAppSettings(): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        // For opening settings, we can use Linking in a real implementation
        // For now, we'll just show an alert
        Alert.alert(
          'Buka Pengaturan',
          'Silakan buka Pengaturan > Aplikasi > E-Commerce App > Izin untuk mengaktifkan izin penyimpanan.',
          [
            { text: 'OK', style: 'default' },
          ]
        );
      } catch (error) {
        console.error('Error opening app settings:', error);
      }
    }
  }
}

export default PermissionService;