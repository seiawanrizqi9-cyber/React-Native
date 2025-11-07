import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';
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

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
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
      <Navbar onAddProduct={() => setShowModal(true)} />
      
      <View style={styles.greetingContainer}>
        <Text style={styles.title}>Selamat datang di Belanja Skuy!</Text>
        <Text style={styles.description}>
          Tempat belanja online paling santai tapi lengkap!{'\n'}
          Dari fashion, gadget, sampai kebutuhan harian — semua ada di sini dengan harga yang bersahabat dan promo yang nggak bikin dompet nangis 💸
        </Text>
        <Text style={styles.callToAction}>
          Yuk, jelajahi produk pilihan terbaik dan nikmati pengalaman belanja yang cepat, aman, dan pastinya anti ribet!
        </Text>
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>"Belanja Skuy — Santai, Cepat, Hemat!"</Text>
        </View>
      </View>

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
  greetingContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  callToAction: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sloganContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  slogan: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});