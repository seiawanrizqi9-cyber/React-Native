import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductList from '../../components/ProductList';
import { Product } from '../../navigation/types';
import { colors } from '../../color/colors';

interface Props {
  products: Product[];
}

export default function FoodTab({ products }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Makanan 🍕</Text>
        <Text style={styles.subtitle}>Makanan dan minuman berkualitas</Text>
      </View>
      <ProductList products={products} />
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
    color: colors.textLight,
  },
});