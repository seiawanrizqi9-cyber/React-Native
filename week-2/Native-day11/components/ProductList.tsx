import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../navigation/types';
import { getColumnsForGrid } from '../utils/responsive';
import { colors } from '../color/colors';

interface Props {
  products: Product[];
  onProductPress?: (product: Product) => void; // Tambah prop untuk handle press
}

export default function ProductList({ products, onProductPress }: Props) {
  const { width, height } = useWindowDimensions();
  const columns = getColumnsForGrid(width, height);

  // Buat dynamic styles berdasarkan columns
  const dynamicStyles = {
    grid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
    },
    gridItem: {
      width: `${100 / columns - 2}%`,
      marginBottom: 12,
    },
  };

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
      <View style={[styles.grid, dynamicStyles.grid]}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[styles.gridItem, dynamicStyles.gridItem]}
          >
            <ProductCard product={product} onPress={onProductPress} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    padding: 12,
  },
  gridItem: {
    // Style dasar
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