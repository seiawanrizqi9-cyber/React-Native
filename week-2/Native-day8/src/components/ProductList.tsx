// src/components/ProductList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../screens/HomeScreen';
import { colors } from '../color/colors';
import { getColumnsForGrid, calculateCardWidth } from '../utils/responsive';

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  const { width, height } = useWindowDimensions();
  const columns = getColumnsForGrid(width, height);
  const cardWidth = calculateCardWidth(width, columns, 12, 4);

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
      style={styles.scrollContainer}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.gridWrapper}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[styles.gridItem, { width: cardWidth }]}
          >
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 12,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignContent: 'flex-start',
  },
  gridItem: {
    margin: 1, 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    color: colors.text,
  },
  emptySubtext: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 14,
  },
});