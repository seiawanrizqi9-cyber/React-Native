import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../color/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ImagePreviewGrid from './ImagePreviewGrid';
import ImagePickerService from '../utils/imagePickerService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageAsset {
  uri: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
}

interface ProductImagePickerProps {
  onImagesChange?: (images: ImageAsset[]) => void;
  maxImages?: number;
}

const PRODUCT_ASSETS_KEY = '@ecom:newProductAssets';

const ProductImagePicker: React.FC<ProductImagePickerProps> = ({
  onImagesChange,
  maxImages = 5,
}) => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);

  // Load saved images from AsyncStorage
  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const savedAssets = await AsyncStorage.getItem(PRODUCT_ASSETS_KEY);
        if (savedAssets) {
          const parsedAssets = JSON.parse(savedAssets);
          if (parsedAssets.images && Array.isArray(parsedAssets.images)) {
            setImages(parsedAssets.images);
          }
        }
      } catch (error) {
        console.error('Failed to load saved images:', error);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    loadSavedImages();
  }, []);

  // Save images to AsyncStorage whenever images change
  useEffect(() => {
    const saveImages = async () => {
      try {
        const assetsData = {
          images,
          timestamp: Date.now(),
        };
        await AsyncStorage.setItem(PRODUCT_ASSETS_KEY, JSON.stringify(assetsData));
        
        // Notify parent component
        if (onImagesChange) {
          onImagesChange(images);
        }
      } catch (error) {
        console.error('Failed to save images:', error);
      }
    };

    if (!isLoadingSaved) {
      saveImages();
    }
  }, [images, isLoadingSaved, onImagesChange]);

  const handleSelectImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        'Maksimal Foto',
        `Anda sudah memilih maksimal ${maxImages} foto. Hapus beberapa foto untuk menambah yang baru.`,
        [{ text: 'Mengerti', style: 'default' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      const remainingSlots = maxImages - images.length;
      const result = await ImagePickerService.selectMultipleProductImages(remainingSlots);

      if (result.success && result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri!,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          type: asset.type,
        }));

        setImages(prev => [...prev, ...newImages]);
        
        if (result.assets.length === remainingSlots) {
          Alert.alert(
            'Berhasil',
            `Anda telah memilih ${result.assets.length} foto. Maksimal ${maxImages} foto tercapai.`,
            [{ text: 'OK', style: 'default' }]
          );
        }
      } else if (result.error) {
        Alert.alert('Gagal Memilih Foto', result.error, [{ text: 'OK', style: 'default' }]);
      }
    } catch (error: any) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Gagal memilih foto. Silakan coba lagi.', [{ text: 'OK', style: 'default' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllImages = () => {
    if (images.length === 0) return;

    Alert.alert(
      'Hapus Semua Foto',
      'Apakah Anda yakin ingin menghapus semua foto produk?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => setImages([]),
        },
      ]
    );
  };

  if (isLoadingSaved) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat foto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImagePreviewGrid
        images={images}
        onRemoveImage={handleRemoveImage}
        maxImages={maxImages}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            (images.length >= maxImages || isLoading) && styles.selectButtonDisabled,
          ]}
          onPress={handleSelectImages}
          disabled={images.length >= maxImages || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textOnPrimary} />
          ) : (
            <FontAwesome6 name="images" size={16} color={colors.textOnPrimary} />
          )}
          <Text style={styles.selectButtonText}>
            {isLoading ? 'Memuat...' : `Pilih Foto (${images.length}/${maxImages})`}
          </Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAllImages}
          >
            <FontAwesome6 name="trash" size={14} color={colors.error} />
            <Text style={styles.clearButtonText}>Hapus Semua</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  selectButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  selectButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '15',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default ProductImagePicker;