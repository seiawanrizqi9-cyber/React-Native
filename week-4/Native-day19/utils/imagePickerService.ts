import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions, Asset } from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';
import PermissionService from './permissionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadService from './uploadService';

export interface ImagePickerResponse {
  success: boolean;
  assets?: Asset[];
  error?: string;
  errorCode?: string;
  uploadResult?: any;
}

export class ImagePickerService {
  // Default options for image library
  private static getLibraryOptions(): ImageLibraryOptions {
    return {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 600,
      maxHeight: 600,
      includeBase64: false,
      selectionLimit: 1, // Default 1, will be overridden for multi-select
    };
  }

  // Default options for camera
  private static getCameraOptions(): CameraOptions {
    return {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 600,
      maxHeight: 600,
      includeBase64: false,
      saveToPhotos: false, // Will be set based on permission
    };
  }

  // Launch image library with permission handling
  static async launchImagePicker(options?: Partial<ImageLibraryOptions>): Promise<ImagePickerResponse> {
    try {
      // Check gallery permission for Android
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionService.requestGalleryPermission();
        if (!hasPermission) {
          PermissionService.showPermissionDeniedAlert('akses galeri');
          return { success: false, error: 'Gallery permission denied' };
        }
      }

      const finalOptions: ImageLibraryOptions = {
        ...this.getLibraryOptions(),
        ...options,
      };

      const result = await launchImageLibrary(finalOptions);

      if (result.didCancel) {
        return { success: false, error: 'User cancelled image selection' };
      }

      if (result.errorCode) {
        console.error('Image picker error:', result.errorCode, result.errorMessage);
        return {
          success: false,
          error: result.errorMessage || 'Unknown error',
          errorCode: result.errorCode,
        };
      }

      if (!result.assets || result.assets.length === 0) {
        return { success: false, error: 'No images selected' };
      }

      return {
        success: true,
        assets: result.assets,
      };
    } catch (error: any) {
      console.error('Image picker service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to open image picker',
      };
    }
  }

  // Launch camera with permission handling
  static async launchCameraWithPermission(options?: Partial<CameraOptions>): Promise<ImagePickerResponse> {
    try {
      // Check camera permission for Android
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionService.requestCameraPermission();
        if (!hasPermission) {
          PermissionService.showPermissionDeniedAlert('kamera');
          return { success: false, error: 'Camera permission denied' };
        }
      }

      const finalOptions: CameraOptions = {
        ...this.getCameraOptions(),
        ...options,
      };

      const result = await launchCamera(finalOptions);

      if (result.didCancel) {
        return { success: false, error: 'User cancelled camera' };
      }

      if (result.errorCode) {
        console.error('Camera error:', result.errorCode, result.errorMessage);
        
        // Handle specific camera errors
        if (result.errorCode === 'camera_unavailable') {
          return {
            success: false,
            error: 'Kamera tidak tersedia',
            errorCode: result.errorCode,
          };
        }

        return {
          success: false,
          error: result.errorMessage || 'Unknown camera error',
          errorCode: result.errorCode,
        };
      }

      if (!result.assets || result.assets.length === 0) {
        return { success: false, error: 'No image captured' };
      }

      return {
        success: true,
        assets: result.assets,
      };
    } catch (error: any) {
      console.error('Camera service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to open camera',
      };
    }
  }

  // Multi-select images from gallery (for product photos) - OPTIMIZED VERSION
  static async selectMultipleProductImages(limit: number = 5): Promise<ImagePickerResponse> {
    return this.launchImagePicker({
      selectionLimit: limit,
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.8,
      mediaType: 'photo',
    });
  }

  // Single image selection with base64 for preview
  static async selectImageWithPreview(): Promise<ImagePickerResponse> {
    return this.launchImagePicker({
      selectionLimit: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
      quality: 0.6,
    });
  }

  // Camera with storage permission for saving to photos - ENHANCED VERSION
  static async takePhotoWithSave(): Promise<ImagePickerResponse> {
    let saveToPhotos = false;
    let storagePermissionGranted = false;

    // Check storage permission for Android with detailed rationale
    if (Platform.OS === 'android') {
      try {
        const permissionResult = await PermissionService.requestStoragePermissionForBackup();
        storagePermissionGranted = permissionResult.granted;
        saveToPhotos = storagePermissionGranted;
        
        if (!storagePermissionGranted) {
          // User denied storage permission, show appropriate message
          if (permissionResult.shouldShowRationale) {
            // User previously denied, show rationale
            const userWantsBackup = await PermissionService.showStoragePermissionRationale();
            if (userWantsBackup) {
              // User changed mind, try again
              const retryResult = await PermissionService.requestStoragePermissionForBackup();
              saveToPhotos = retryResult.granted;
              storagePermissionGranted = retryResult.granted;
            }
          } else {
            // User permanently denied or first time denial
            PermissionService.showBackupDisabledWarning();
          }
        }
      } catch (error) {
        console.error('Storage permission handling error:', error);
        PermissionService.showBackupDisabledWarning();
      }
    }

    // Proceed with camera regardless of storage permission
    const cameraResult = await this.launchCameraWithPermission({
      saveToPhotos,
      quality: 0.7,
    });

    return cameraResult;
  }

  // Special method for KTP backup with enhanced permission handling
  static async takeKTPPhotoForBackup(): Promise<ImagePickerResponse> {
    console.log('📸 Starting KTP backup photo process...');
    
    // Step 1: Check camera permission first
    const hasCameraPermission = await PermissionService.requestCameraPermission();
    if (!hasCameraPermission) {
      PermissionService.showPermissionDeniedAlert('kamera');
      return { success: false, error: 'Camera permission denied for KTP photo' };
    }

    // Step 2: Handle storage permission for backup
    let saveToPhotos = false;
    if (Platform.OS === 'android') {
      try {
        const storageResult = await PermissionService.requestStoragePermissionForBackup();
        saveToPhotos = storageResult.granted;
        
        if (!storageResult.granted) {
          if (storageResult.shouldShowRationale) {
            // User previously denied, give another chance with detailed explanation
            Alert.alert(
              'Backup Keamanan KTP',
              'Backup foto KTP ke galeri membantu melindungi akun Anda. Foto akan disimpan secara aman dan hanya dapat diakses oleh Anda.',
              [
                {
                  text: 'Lanjut Tanpa Backup',
                  style: 'cancel',
                },
                {
                  text: 'Izinkan Backup',
                  style: 'default',
                  onPress: async () => {
                    // User wants to grant permission, open settings or retry
                    await PermissionService.openAppSettings();
                  }
                },
              ]
            );
          } else {
            PermissionService.showBackupDisabledWarning();
          }
        }
      } catch (error) {
        console.error('KTP backup permission error:', error);
      }
    }

    // Step 3: Launch camera with appropriate settings
    console.log('📸 Launching camera for KTP with saveToPhotos:', saveToPhotos);
    const cameraResult = await this.launchCameraWithPermission({
      saveToPhotos,
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      mediaType: 'photo',
    });

    // Step 4: Provide user feedback about backup status
    if (cameraResult.success) {
      if (saveToPhotos) {
        Alert.alert(
          'Backup Berhasil',
          'Foto KTP telah disimpan ke galeri sebagai backup keamanan.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Foto Tersimpan',
          'Foto KTP telah diambil. Untuk backup keamanan, aktifkan izin penyimpanan di pengaturan.',
          [{ text: 'Mengerti', style: 'default' }]
        );
      }
    }

    return cameraResult;
  }

  // Enhanced camera with immediate upload
  static async takePhotoAndUpload(
    onProgress?: (progress: any) => void
  ): Promise<ImagePickerResponse> {
    try {
      // Take photo first
      const cameraResult = await this.takePhotoWithSave();
      
      if (cameraResult.success && cameraResult.assets && cameraResult.assets.length > 0) {
        const photo = cameraResult.assets[0];
        
        // Validate file before upload
        const validation = UploadService.validateFile(photo.uri!, photo.fileSize);
        if (!validation.valid) {
          return {
            ...cameraResult,
            success: false,
            error: validation.error,
          };
        }

        // Upload the photo immediately
        const uploadResult = await UploadService.uploadFileWithProgress(
          photo.uri!,
          photo.fileName || `photo_${Date.now()}.jpg`,
          onProgress,
          {
            quality: 0.7,
            maxWidth: 800,
            maxHeight: 800,
          }
        );

        return {
          ...cameraResult,
          uploadResult,
        };
      }

      return cameraResult;
    } catch (error: any) {
      console.error('Take photo and upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to take and upload photo',
      };
    }
  }

  // Clear product assets from storage
  static async clearProductAssets(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@ecom:newProductAssets');
      console.log('✅ Cleared product assets from storage');
    } catch (error) {
      console.error('Failed to clear product assets:', error);
      throw error;
    }
  }
}

export default ImagePickerService;