import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductList from '../../components/ProductList';
import { Product } from '../../navigation/types';
import { colors } from '../../color/colors';

// PERBAIKI: Interface Props harus sesuai dengan yang digunakan
interface Props {
  products: Product[];
}

export default function PopularTab(props: Props) { // PERBAIKI: Gunakan props
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produk Populer 🔥</Text>
        <Text style={styles.subtitle}>Yang paling banyak dicari</Text>
      </View>
      <ProductList products={props.products} /> {/* PERBAIKI: props.products */}
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
    backgroundColor: colors.cardPopular,
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