import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../color/colors';
import { HomeStackParamList, RootDrawerParamList } from '../navigation/types';
import { getProductById } from '../data/dummyProducts';
import { useCart } from '../utils/useCart';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetail'
>;

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const { addToCart } = useCart();

  const product = getProductById(productId);

  // ✅ TAHAP 9: CONDITIONAL DRAWER LOCK - PRODUCT DETAIL
  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        drawerLockMode: 'locked-closed' as const
      });
    }

    return () => {
      if (parent) {
        parent.setOptions({
          drawerLockMode: 'unlocked' as const
        });
      }
    };
  }, [navigation]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  // ✅ KONSISTEN: Tidak ada alert, langsung tambah ke keranjang
  const handlePesan = () => {
    addToCart(product);
    // Tidak ada alert - konsisten dengan ProductCard
  };

  const handleCheckout = () => {
    addToCart(product);
    drawerNavigation.navigate('Checkout');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.gambar ? (
          <Image source={{ uri: product.gambar }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>📷</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.nama}</Text>

        {product.diskon ? (
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              {formatRupiah(product.harga)}
            </Text>
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cartButton} onPress={handlePesan}>
            <Text style={styles.cartButtonText}>🛒 Tambah ke Keranjang</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>🚀 Beli Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  checkoutButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});