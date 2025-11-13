import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../color/colors';
import ProductList from '../components/ProductList';
import { useNetInfo } from '../utils/useNetInfo';
import apiClient, { API_ENDPOINTS } from '../utils/apiClient'; // HAPUS yang tidak digunakan
import { Product } from '../navigation/types';

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const netInfo = useNetInfo();

  useEffect(() => {
    if (!netInfo.isInternetReachable) {
      setError('Anda sedang Offline. Cek koneksi Anda.');
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 7000);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.ALL, {
          signal: abortController.signal,
          params: { limit: 20 }
        });

        const transformedProducts: Product[] = response.data.products.map((item: any) => ({
          id: item.id.toString(),
          nama: item.title,
          harga: item.price,
          stok: item.stock,
          deskripsi: item.description,
          gambar: item.thumbnail,
          kategori: item.category,
          diskon: item.discountPercentage,
        }));

        setProducts(transformedProducts);
      } catch (err: any) {
        if (abortController.signal.aborted) {
          setError('Request dibatalkan: timeout 7 detik');
        } else if (err.name === 'AbortError') {
          setError('Request dibatalkan');
        } else {
          setError(err.message || 'Gagal memuat produk');
        }
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [netInfo.isInternetReachable]);

  const handleProductPress = (product: Product) => {
    Alert.alert('Product Clicked', product.nama);
  };

  if (!netInfo.isInternetReachable) {
    return (
      <View style={styles.container}>
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>📶</Text>
          <Text style={styles.offlineTitle}>Anda sedang Offline</Text>
          <Text style={styles.offlineSubtitle}>Cek koneksi internet Anda</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat produk...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Product List (API)</Text>
        <Text style={styles.subtitle}>
          Koneksi: {netInfo.type === 'wifi' ? 'WiFi 📶' : 
                   netInfo.type === 'cellular' ? 'Cellular 📱' : 
                   'Unknown'}
        </Text>
      </View>

      <ProductList products={products} onProductPress={handleProductPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  offlineIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  offlineSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});