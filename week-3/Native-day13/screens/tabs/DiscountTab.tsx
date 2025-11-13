import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductList from '../../components/ProductList';
import { Product } from '../../navigation/types';
import { colors } from '../../color/colors';

interface TabProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export default function DiscountTab({ products, onProductPress }: TabProps) {
  // Soal 3: Effect untuk log saat tab aktif/non-aktif
  useEffect(() => {
    console.log('🛍️ Tab Diskon: DI FOCUS - Produk diskon dimuat');
    
    return () => {
      console.log('🛍️ Tab Diskon: DI TINGGALKAN - Bersihkan resource');
    };
  }, []);

  // PERBAIKI: Hapus totalDiscount yang tidak digunakan, gunakan langsung
  const maxDiscount = Math.max(...products.map(p => p.diskon || 0));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produk Diskon 💰</Text>
        <Text style={styles.subtitle}>
          Hemat sampai {maxDiscount}%!
        </Text>
        <View style={styles.discountInfo}>
          <Text style={styles.discountText}>
            {products.length} produk diskon tersedia
          </Text>
        </View>
      </View>
      <ProductList products={products} onProductPress={onProductPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.discount,
    fontWeight: '600',
    marginBottom: 8,
  },
  discountInfo: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.discount,
  },
  discountText: {
    fontSize: 12,
    color: colors.discount,
    fontWeight: '500',
  },
});