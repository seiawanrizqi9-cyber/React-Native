// src/components/ProductList.tsx
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../screens/ProductsScreen';
import { getColumnsForGrid } from '../utils/responsive';

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  const { width, height } = useWindowDimensions();
  const columns = getColumnsForGrid(width, height);
  const flexBasis = 100 / columns; // persentase: 33.33% untuk 3 kolom

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.gridItem,
              {
                flexBasis: `${flexBasis}%`,
                maxWidth: `${flexBasis}%`,
              },
            ]}
          >
            <ProductCard product={product} />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4, // minimal
  },
  gridItem: {
    // ❌ TANPA margin, TANPA minWidth, TANPA width eksplisit
    paddingHorizontal: 2, // hanya sedikit padding horizontal
    paddingBottom: 8, // jarak vertikal
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
  },
});