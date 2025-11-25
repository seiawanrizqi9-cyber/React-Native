import { Alert } from 'react-native';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export class UploadService {
  private static readonly UPLOAD_TIMEOUT = 30000; // 30 seconds

  // Simulate file upload with progress tracking
  static async uploadFileWithProgress(
    fileUri: string,
    fileName: string,
    onProgress?: (progress: UploadProgress) => void,
    options?: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
    }
  ): Promise<UploadResult> {
    return new Promise(async (resolve) => {
      try {
        console.log('📤 Starting file upload:', fileName);
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          type: 'image/jpeg',
          name: fileName || 'photo.jpg',
        } as any);
        
        formData.append('quality', String(options?.quality || 0.7));
        formData.append('timestamp', Date.now().toString());

        // Simulate upload progress (in real app, this would be actual fetch/xhr)
        const totalSize = 1000000; // Simulate 1MB file
        let uploaded = 0;
        
        const progressInterval = setInterval(() => {
          if (uploaded < totalSize) {
            uploaded += 100000; // Increment by 100KB
            const percentage = Math.min((uploaded / totalSize) * 100, 100);
            
            if (onProgress) {
              onProgress({
                loaded: uploaded,
                total: totalSize,
                percentage: Math.round(percentage),
              });
            }
          } else {
            clearInterval(progressInterval);
            
            // Simulate successful upload
            setTimeout(() => {
              console.log('✅ File upload completed:', fileName);
              resolve({
                success: true,
                message: 'File berhasil diupload',
                data: {
                  fileUrl: `https://api.example.com/uploads/${Date.now()}_${fileName}`,
                  fileSize: totalSize,
                  uploadedAt: new Date().toISOString(),
                },
              });
            }, 500);
          }
        }, 200);

        // Simulate timeout
        setTimeout(() => {
          clearInterval(progressInterval);
          resolve({
            success: false,
            error: 'Upload timeout',
          });
        }, this.UPLOAD_TIMEOUT);

      } catch (error: any) {
        console.error('Upload error:', error);
        resolve({
          success: false,
          error: error.message || 'Upload failed',
        });
      }
    });
  }

  // Upload multiple files with progress
  static async uploadMultipleFiles(
    files: Array<{ uri: string; fileName?: string }>,
    onProgress?: (progress: {
      currentFile: number;
      totalFiles: number;
      fileProgress: UploadProgress;
      overallProgress: number;
    }) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (onProgress) {
        onProgress({
          currentFile: i + 1,
          totalFiles,
          fileProgress: { loaded: 0, total: 0, percentage: 0 },
          overallProgress: Math.round((i / totalFiles) * 100),
        });
      }

      const result = await this.uploadFileWithProgress(
        file.uri,
        file.fileName || `file_${i + 1}.jpg`,
        (progress) => {
          if (onProgress) {
            onProgress({
              currentFile: i + 1,
              totalFiles,
              fileProgress: progress,
              overallProgress: Math.round(((i + (progress.percentage / 100)) / totalFiles) * 100),
            });
          }
        }
      );

      results.push(result);
    }

    return results;
  }

  // Validate file before upload
  static validateFile(fileUri: string, fileSize?: number): { valid: boolean; error?: string } {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize && fileSize > maxSize) {
      return {
        valid: false,
        error: `File terlalu besar. Maksimal ${maxSize / (1024 * 1024)}MB`,
      };
    }

    // Check file type (images only)
    const fileExtension = fileUri.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      return {
        valid: false,
        error: 'Hanya file JPEG, JPG, dan PNG yang didukung',
      };
    }

    return { valid: true };
  }

  // Show upload success message
  static showUploadSuccess(message?: string) {
    Alert.alert(
      '✅ Upload Berhasil',
      message || 'File telah berhasil diupload',
      [{ text: 'OK', style: 'default' }]
    );
  }

  // Show upload error message
  static showUploadError(error: string) {
    Alert.alert(
      '❌ Upload Gagal',
      error,
      [{ text: 'OK', style: 'default' }]
    );
  }

  // Show upload progress alert
  static showUploadProgress(progress: number) {
    // This would typically update a progress modal or notification
    console.log(`📤 Upload progress: ${progress}%`);
  }
}

export default UploadService;