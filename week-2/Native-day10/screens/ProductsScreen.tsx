// src/screens/ProductsScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { colors } from '../color/colors';

export interface Product {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  gambar: string | null;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    nama: 'MacBook Pro 14',
    harga: 25000000,
    gambar:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    deskripsi: 'Laptop profesional dengan display Liquid Retina XDR',
    stok: 5,
  },
  {
    id: '2',
    nama: 'Dompet Kulit Premium',
    harga: 220000,
    gambar:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
    deskripsi: 'Dompet kulit asli dengan multiple slot dan RFID protection',
    stok: 28,
  },
  {
    id: '3',
    nama: 'Keyboard Mechanical RGB',
    harga: 1200000,
    gambar:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    deskripsi: 'Keyboard mechanical dengan RGB lighting dan switch blue',
    stok: 9,
  },
];

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [showModal, setShowModal] = useState(false);

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
    };
    setProducts([...products, product]);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <ProductList products={products} />
      <ProductForm
        visible={showModal}
        onSubmit={addProduct}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
