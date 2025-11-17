import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Product } from '../navigation/types';
import { colors } from '../color/colors';
import { useCart } from '../utils/useCart';
import { useNetInfo } from '../utils/useNetInfo';

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

interface Props {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const { addToCart } = useCart();
  const netInfo = useNetInfo();

  const handlePesan = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'Mode Offline',
        'Produk berhasil ditambahkan ke keranjang. Data akan disinkronisasi ketika online.',
        [{ text: 'Mengerti' }]
      );
    }
    addToCart(product);
  };

  const finalPrice = product.diskon 
    ? product.harga * (1 - product.diskon / 100)
    : product.harga;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.7}
    >
      {!netInfo.isInternetReachable && (
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineBadgeText}>📶</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        {product.gambar ? (
          <Image source={{ uri: product.gambar }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>📷</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nama}
        </Text>
        
        <View style={styles.priceSection}>
          {product.diskon ? (
            <View style={styles.discountContainer}>
              <Text style={styles.originalPrice}>
                {formatRupiah(product.harga)}
              </Text>
              <View style={styles.discountInfo}>
                <Text style={styles.discountPrice}>
                  {formatRupiah(finalPrice)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.diskon}%</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.stok}>Stok: {product.stok}</Text>
          <TouchableOpacity style={styles.pesanButton} onPress={handlePesan}>
            <Text style={styles.pesanButtonText}>
              {!netInfo.isInternetReachable ? '➕' : 'Pesan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardAccent,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
    position: 'relative',
  },
  offlineBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.warning,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  offlineBadgeText: {
    fontSize: 12,
    color: colors.textOnPrimary,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 24,
    color: colors.textLight,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
    flexShrink: 1,
  },
  priceSection: {
    marginBottom: 8,
  },
  discountContainer: {
    flexDirection: 'column',
  },
  discountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 16,
    color: colors.discount,
    fontWeight: '700',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: colors.discount,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stok: {
    fontSize: 12,
    color: colors.textLight,
    flex: 1,
  },
  pesanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  pesanButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});