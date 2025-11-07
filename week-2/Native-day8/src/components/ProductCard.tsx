import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Product } from '../screens/HomeScreen';
import { colors } from '../color/colors';

interface Props {
  product: Product;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 3;

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function ProductCard({ product }: Props) {
  const handlePesan = () => {
    Alert.alert(
      'Pesanan Berhasil!',
      `Barang "${product.nama}" sudah dipesan! 🎉`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  return (
    <View style={styles.card}>
      {product.gambar ? (
        <Image source={{ uri: product.gambar }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderIcon}>📷</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.nama}</Text>
        <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
        <Text style={styles.stok}>Stok: {product.stok}</Text>
        
        {/* Button Pesan */}
        <TouchableOpacity style={styles.pesanButton} onPress={handlePesan}>
          <Text style={styles.pesanButtonText}>Pesan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: cardWidth,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 20,
    color: colors.textLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    height: 28,
    color: colors.text,
    lineHeight: 14,
  },
  price: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  stok: {
    fontSize: 10,
    color: colors.textLight,
    marginBottom: 6,
  },
  pesanButton: {
    backgroundColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  pesanButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});