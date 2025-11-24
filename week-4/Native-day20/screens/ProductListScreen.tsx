import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../color/colors';
import ProductList from '../components/ProductList';
import { useNetInfo } from '../utils/useNetInfo';
import { Product } from '../navigation/types';
import RetryErrorScreen from './RetryErrorScreen';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import { getAllProducts } from '../data/dummyProducts';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export default function ProductListScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const netInfo = useNetInfo();

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!netInfo.isInternetReachable) {
        throw { 
          code: 'NETWORK_ERROR', 
          message: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.' 
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      const shouldError = Math.random() < 0.5;
      
      if (shouldError) {
        throw { 
          code: 'NETWORK_ERROR', 
          message: 'Gagal memuat produk. Silakan coba lagi.' 
        };
      }

      const productsData = getAllProducts();
      setAllProducts(productsData);
      setFilteredProducts(productsData);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat produk');
    } finally {
      setIsLoading(false);
    }
  }, [netInfo.isInternetReachable]);

  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.kategori === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchQuery, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductPress = useCallback((product: Product) => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'Mode Offline',
        'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.',
        [{ text: 'Mengerti' }]
      );
    }
    console.log('Product clicked:', product.nama);
  }, [netInfo.isInternetReachable]);

  const handleManualRetry = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterPress = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setShowFilterModal(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  const categories = ['all', ...new Set(allProducts.map(p => p.kategori))];

  if (error) {
    return (
      <RetryErrorScreen
        errorMessage={error}
        onRetry={handleManualRetry}
      />
    );
  }

  if (!netInfo.isInternetReachable) {
    return (
      <View style={styles.container}>
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>📶</Text>
          <Text style={styles.offlineTitle}>Anda sedang Offline</Text>
          <Text style={styles.offlineSubtitle}>
            Beberapa fitur mungkin tidak tersedia. 
            Produk yang sudah dimuat tetap dapat dilihat.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleManualRetry}
          >
            <Text style={styles.retryButtonText}>Coba Muat Ulang</Text>
          </TouchableOpacity>
        </View>
        
        {allProducts.length > 0 && (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Produk (Mode Offline) 🛍️</Text>
              <Text style={styles.subtitle}>
                {allProducts.length} produk tersedia secara offline
              </Text>
            </View>
            <ProductList products={allProducts} onProductPress={handleProductPress} />
          </>
        )}
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat produk...</Text>
          <Text style={styles.loadingSubtext}>
            Sedang mengambil data terbaru dari server
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Semua Produk 🛍️</Text>
        <Text style={styles.subtitle}>
          {filteredProducts.length} produk ditemukan
          {selectedCategory !== 'all' && ` • Kategori: ${selectedCategory}`}
        </Text>
        
        <View style={styles.searchContainer}>
          <SearchBar 
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Cari produk..."
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <FontAwesome6 name="filter" size={20} color={colors.textOnPrimary} />
          </TouchableOpacity>
        </View>

        {(searchQuery || selectedCategory !== 'all') && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersText}>
              Filter aktif: 
              {searchQuery && ` Pencarian "${searchQuery}"`}
              {selectedCategory !== 'all' && ` Kategori ${selectedCategory}`}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ProductList products={filteredProducts} onProductPress={handleProductPress} />

      <FilterModal
        visible={showFilterModal}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onClose={() => setShowFilterModal(false)}
      />
    </View>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  activeFiltersText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
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
    textAlign: 'center',
  },
  offlineSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});