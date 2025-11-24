import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../color/colors';
import { HomeStackParamList, RootDrawerParamList, ProductDeepLinkResult, Product } from '../navigation/types';
import { getProductById, validateAndGetProduct } from '../data/dummyProducts';
import { useCart } from '../utils/useCart';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Toast from '../utils/Toast';
import { getFallbackProduct } from '../data/fallbackProducts';
import { useNetInfo } from '../utils/useNetInfo';
import ProductCache from '../utils/productCache';
import { useRetry } from '../utils/useRetry';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// ✅ FIX: Buat fungsi getProductWithFallback yang lebih reliable
const getProductWithFallback = (productId: string): Product => {
  const product = getProductById(productId);
  if (product) {
    return product;
  }
  
  // Return proper Product object dengan semua required properties
  return {
    id: productId,
    nama: `Produk ${productId}`,
    harga: 100000, // Default harga
    stok: 0,
    deskripsi: `Deskripsi untuk produk ${productId}`,
    gambar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    kategori: 'unknown'
  };
};

export default function ProductDetailScreen() {
  const drawerNavigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId, fromDeepLink } = route.params;
  const { addToCart } = useCart();
  const netInfo = useNetInfo();
  const { executeWithRetry, isLoading: retryLoading, error: retryError, retryCount } = useRetry();

  // ✅ FIX: Inisialisasi dengan Product yang valid, bukan null
  const [product, setProduct] = useState<Product>(() => getFallbackProduct(productId));
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [usingCache, setUsingCache] = useState(false);
  const [deepLinkResult, setDeepLinkResult] = useState<ProductDeepLinkResult | null>(null);

  // ✅ FIX: Simplified product loading - tanpa complex logic
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoading(true);

        // Handle deep link validation
        if (fromDeepLink) {
          const validationResult = validateAndGetProduct(productId);
          setDeepLinkResult(validationResult);
        }

        // Try cache first
        const cachedProduct = await ProductCache.get(productId);
        if (cachedProduct) {
          setProduct(cachedProduct);
          setUsingCache(true);
          setUsingFallback(false);
          setIsLoading(false);
          return;
        }

        // Use retry logic for API call
        const result = await executeWithRetry(async (): Promise<Product> => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const productData = getProductWithFallback(productId);
          await ProductCache.set(productId, productData);
          return productData;
        });

        if (result) {
        setProduct(getFallbackProduct(productId));
          setUsingFallback(!getProductById(productId));
          setUsingCache(false);
        }

      } catch (error) {
        console.error('Product loading error:', error);
        
        // Simple fallback
        const fallback = getFallbackProduct(productId);
        setProduct(fallback);
        setUsingFallback(true);
        setShowToast(true);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, fromDeepLink, executeWithRetry]);

  const handlePesan = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'Mode Offline',
        'Produk berhasil ditambahkan ke keranjang. Data akan disinkronisasi ketika online.',
        [{ text: 'Mengerti' }]
      );
    }
    addToCart(product);
  };

  const handleCheckout = () => {
    if (!netInfo.isInternetReachable) {
      Alert.alert(
        'Mode Offline',
        'Checkout tidak tersedia saat offline. Silakan periksa koneksi internet Anda.',
        [{ text: 'Mengerti' }]
      );
      return;
    }
    addToCart(product);
    drawerNavigation.navigate('Checkout' as any);
  };

  const handleBackToHome = () => {
    drawerNavigation.navigate('Home' as any, {
      screen: 'HomeStack' as any,
      params: {
        screen: 'Home' as any,
        params: {
          fromStack: 'ProductDetail',
          customTitle: 'Beranda'
        }
      }
    });
  };

  // Deep link error handling
  if (deepLinkResult && !deepLinkResult.success && fromDeepLink) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Produk Tidak Ditemukan</Text>
          <Text style={styles.errorMessage}>{deepLinkResult.error}</Text>
          <Text style={styles.productIdText}>ID: {productId}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
            <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading || retryLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {retryCount > 0 ? `Memuat... (Percobaan ${retryCount + 1})` : 'Memuat produk...'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Toast
        message={retryError || "Gagal memuat data terbaru. Menampilkan versi arsip."}
        visible={showToast || !!retryError}
        duration={3000}
        onHide={() => setShowToast(false)}
      />

      {!netInfo.isInternetReachable && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📶 Mode Offline</Text>
        </View>
      )}

      {fromDeepLink && (
        <View style={styles.deepLinkIndicator}>
          <Text style={styles.deepLinkText}>🔗 Dibuka dari Deep Link</Text>
        </View>
      )}

      {usingCache && (
        <View style={styles.cacheIndicator}>
          <Text style={styles.cacheText}>💾 Menggunakan data cache</Text>
        </View>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {product.gambar ? (
            <Image source={{ uri: product.gambar }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>📷</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.nama}</Text>

          {usingFallback && (
            <View style={styles.fallbackIndicator}>
              <Text style={styles.fallbackText}>📋 Menampilkan data arsip</Text>
            </View>
          )}

          {!netInfo.isInternetReachable && (
            <View style={styles.offlineIndicator}>
              <Text style={styles.offlineIndicatorText}>⚠️ Data mungkin tidak terbaru</Text>
            </View>
          )}

          {product.diskon ? (
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>{formatRupiah(product.harga)}</Text>
              <Text style={styles.discountPrice}>
                {formatRupiah(product.harga * (1 - product.diskon / 100))}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.diskon}% OFF</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
          )}

          <Text style={styles.description}>{product.deskripsi}</Text>

          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Stok Tersedia:</Text>
            <Text style={styles.stockValue}>{product.stok} unit</Text>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Kategori:</Text>
            <Text style={styles.categoryValue}>{product.kategori}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.cartButton, usingFallback && styles.disabledButton]} 
              onPress={handlePesan}
              disabled={usingFallback}
            >
              <Text style={styles.cartButtonText}>
                {usingFallback ? '🛒 Produk Tidak Tersedia' : '🛒 Tambah ke Keranjang'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.checkoutButton, (usingFallback || !netInfo.isInternetReachable) && styles.disabledButton]}
              onPress={handleCheckout}
              disabled={usingFallback || !netInfo.isInternetReachable}
            >
              <Text style={styles.checkoutButtonText}>
                {!netInfo.isInternetReachable ? '📶 Perlu Koneksi' : 
                 usingFallback ? '⛔ Tidak Dapat Dibeli' : '🚀 Beli Sekarang'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  productIdText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: colors.warning,
    padding: 8,
    alignItems: 'center',
  },
  offlineBannerText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  deepLinkIndicator: {
    backgroundColor: colors.primary + '20',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '40',
  },
  deepLinkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  cacheIndicator: {
    backgroundColor: colors.primary + '15',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '30',
  },
  cacheText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: colors.card,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 48,
    color: colors.textLight,
  },
  infoContainer: {
    backgroundColor: colors.card,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 30,
  },
  fallbackIndicator: {
    backgroundColor: colors.warning + '20',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  fallbackText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  offlineIndicator: {
    backgroundColor: colors.textLight + '20',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.textLight,
  },
  offlineIndicatorText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountPrice: {
    fontSize: 20,
    color: colors.discount,
    fontWeight: 'bold',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: colors.discount,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  stockLabel: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
  stockValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryLabel: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
  categoryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  cartButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  disabledButton: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});