import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../color/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface ImageAsset {
  uri: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
}

interface ImagePreviewGridProps {
  images: ImageAsset[];
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemoveImage,
  maxImages = 5,
}) => {
  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="images" size={40} color={colors.textLight} />
        <Text style={styles.emptyText}>Belum ada foto produk</Text>
        <Text style={styles.emptySubtext}>
          Pilih maksimal {maxImages} foto untuk produk Anda
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Foto Produk ({images.length}/{maxImages})</Text>
        <Text style={styles.subtitle}>
          {images.length === maxImages ? 'Maksimal tercapai' : 'Tap untuk menambah'}
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View style={styles.imagesContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveImage(index)}
              >
                <FontAwesome6 name="times" size={14} color={colors.textOnPrimary} />
              </TouchableOpacity>
              {image.fileName && (
                <Text style={styles.fileName} numberOfLines={1}>
                  {image.fileName}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  scrollContainer: {
    marginHorizontal: -4,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  fileName: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    maxWidth: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default ImagePreviewGrid;