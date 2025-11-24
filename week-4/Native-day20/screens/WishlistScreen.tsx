import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../color/colors';
import { useWishlist } from '../utils/useWishlist';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ProductList from '../components/ProductList';
import { getAllProducts } from '../data/dummyProducts';

type WishlistScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

export default function WishlistScreen() {
  const { wishlistIds, meta, clearWishlist, isLoading } = useWishlist();
  const navigation = useNavigation<WishlistScreenNavigationProp>();

  // Filter produk berdasarkan wishlist IDs
  const wishlistProducts = getAllProducts().filter(product => 
    wishlistIds.includes(product.id)
  );

  const handleClearWishlist = () => {
    Alert.alert(
      'Hapus Semua Favorit',
      'Apakah Anda yakin ingin menghapus semua produk dari favorit?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => clearWishlist(),
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBrowseProducts = () => {
    // FIX: Gunakan type assertion
    navigation.navigate('Home' as any);
  };

  const handleProductPress = (product: any) => {
    // FIX: Navigate dengan type assertion
    navigation.navigate('Home' as any, {
      screen: 'HomeStack' as any,
      params: {
        screen: 'ProductDetail' as any,
        params: {
          productId: product.id,
          productName: product.nama,
        }
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat favorit...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorit Saya ❤️</Text>
        <View style={styles.headerRight}>
          {wishlistIds.length > 0 && (
            <TouchableOpacity onPress={handleClearWishlist}>
              <Text style={styles.clearText}>Hapus Semua</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Ringkasan Favorit</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{meta.count}</Text>
              <Text style={styles.statLabel}>Total Favorit</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Date(meta.updatedAt).toLocaleDateString('id-ID')}
              </Text>
              <Text style={styles.statLabel}>Terakhir Diupdate</Text>
            </View>
          </View>
        </View>

        {/* Products */}
        {wishlistIds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="heart-circle-exclamation" size={80} color={colors.textLight} />
            <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
            <Text style={styles.emptySubtitle}>
              Tambahkan produk ke favorit dengan menekan ikon hati di kartu produk
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={handleBrowseProducts}
            >
              <Text style={styles.browseButtonText}>Jelajahi Produk</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>
              Produk Favorit ({wishlistIds.length})
            </Text>
            <ProductList 
              products={wishlistProducts} 
              onProductPress={handleProductPress}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  clearText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
  },
  statsCard: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  productsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
});