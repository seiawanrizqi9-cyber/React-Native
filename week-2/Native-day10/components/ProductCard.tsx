import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Product } from '../navigation/types';
import { colors } from '../color/colors';

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const handlePesan = () => {
    Alert.alert(
      'Pesanan Berhasil!',
      `Barang "${product.nama}" sudah dipesan! 🎉`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Variasi card berdasarkan kategori
  const getCardStyle = (kategori: string) => {
    switch (kategori) {
      case 'popular':
        return { backgroundColor: colors.cardPopular, borderLeftColor: colors.accent };
      case 'new':
        return { backgroundColor: colors.cardNew, borderLeftColor: colors.primary };
      case 'discount':
        return { backgroundColor: colors.cardDiscount, borderLeftColor: colors.discount };
      default:
        return { backgroundColor: colors.card, borderLeftColor: colors.border };
    }
  };

  const cardStyle = getCardStyle(product.kategori);

  return (
    <View style={[styles.card, cardStyle]}>
      {product.gambar ? (
        <Image source={{ uri: product.gambar }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderIcon}>📷</Text>
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nama}
        </Text>
        
        {product.diskon ? (
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              {formatRupiah(product.harga)}
            </Text>
            <Text style={styles.discountPrice}>
              {formatRupiah(product.harga * (1 - product.diskon / 100))}
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.diskon}%</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
        )}
        
        <Text style={styles.description} numberOfLines={2}>
          {product.deskripsi}
        </Text>
        
        <Text style={styles.stok}>Stok: {product.stok}</Text>
        
        <TouchableOpacity style={styles.pesanButton} onPress={handlePesan}>
          <Text style={styles.pesanButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    color: colors.text,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 14,
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
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 14,
  },
  stok: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 8,
  },
  pesanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pesanButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});