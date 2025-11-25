import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../navigation/types';
import { colors } from '../color/colors';

interface Props {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export default function ProductList({ products, onProductPress }: Props) {
  // ✅ PERBAIKAN: Hapus width dan height yang tidak digunakan
  // Karena sekarang single column, tidak perlu responsive columns

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛍️</Text>
        <Text style={styles.emptyText}>Belum ada produk</Text>
        <Text style={styles.emptySubtext}>Tambahkan produk pertama Anda</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.listContainer}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onPress={onProductPress} 
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.text,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
  },
});