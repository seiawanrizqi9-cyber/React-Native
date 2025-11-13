import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { colors } from '../color/colors';
import { useCart } from '../utils/useCart';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNetInfo } from '../utils/useNetInfo'; // 🆕 Import NetInfo

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

interface HeaderBackButtonProps {
  onPress: () => void;
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({ onPress }) => (
  <TouchableOpacity 
    style={headerBackButtonStyles.button}
    onPress={onPress}
  >
    <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
  </TouchableOpacity>
);

export default function CheckoutScreen() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const netInfo = useNetInfo(); // 🆕 NetInfo untuk cek connection type
  
  // 🆕 STATE UNTUK POLLING DATA
  const [pollingData, setPollingData] = useState({
    lastUpdated: new Date(),
    totalUpdates: 0,
    isPollingActive: false,
  });

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const headerLeftComponent = useCallback(
    () => <HeaderBackButton onPress={handleBackPress} />,
    [handleBackPress]
  );

  // 🆕 SOAL E: POLLING IMPLEMENTASI
  useEffect(() => {
    // Conditional polling berdasarkan connection type
    if (netInfo.type === 'cellular') {
      console.log('📱 Polling dihentikan: menggunakan jaringan cellular');
      setPollingData(prev => ({ ...prev, isPollingActive: false }));
      return;
    }

    console.log('🔄 Polling dimulai: menggunakan', netInfo.type);
    setPollingData(prev => ({ ...prev, isPollingActive: true }));

    // Polling setiap 15 detik
    const intervalId = setInterval(() => {
      // Simulasi update data polling
      const newUpdate = {
        lastUpdated: new Date(),
        totalUpdates: pollingData.totalUpdates + 1,
      };
      
      setPollingData(prev => ({
        ...prev,
        ...newUpdate,
      }));

      // 🆕 SOAL E: Bisa diganti dengan real API call nanti
      // Contoh: fetchCartTotalFromAPI().then(updateCart)
      console.log('🔄 Polling update:', {
        time: newUpdate.lastUpdated.toLocaleTimeString(),
        count: newUpdate.totalUpdates,
        connection: netInfo.type,
      });

    }, 15000); // 15 detik

    // Cleanup function - stop polling saat unmount atau connection berubah
    return () => {
      console.log('🛑 Polling dihentikan');
      clearInterval(intervalId);
    };
  }, [netInfo.type, pollingData.totalUpdates]); // 🆕 Dependency pada connection type

  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        drawerLockMode: 'locked-closed' as const,
        headerLeft: headerLeftComponent
      });
    }

    return () => {
      if (parent) {
        parent.setOptions({
          drawerLockMode: 'unlocked' as const,
          headerLeft: undefined
        });
      }
    };
  }, [navigation, headerLeftComponent]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Keranjang Kosong', 'Tambahkan produk terlebih dahulu!');
      return;
    }

    Alert.alert(
      'Checkout Berhasil! 🎉',
      `Terima kasih telah berbelanja!\nTotal: ${formatRupiah(getTotalPrice())}`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Hapus Produk',
      `Hapus "${productName}" dari keranjang?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
        <Text style={styles.emptySubtitle}>
          Belum ada produk di keranjang belanja Anda
        </Text>
        
        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={handleBackPress}
        >
          <Text style={styles.continueShoppingText}>🛍️ Lanjut Belanja</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🆕 POLLING STATUS INFO */}
      <View style={[
        styles.pollingStatus,
        netInfo.type === 'cellular' ? styles.pollingDisabled : styles.pollingActive
      ]}>
        <Text style={styles.pollingText}>
          {netInfo.type === 'cellular' ? (
            '📱 Polling dimatikan (jaringan cellular)'
          ) : (
            `🔄 Auto-update: ${pollingData.lastUpdated.toLocaleTimeString()}`
          )}
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Ringkasan Belanja</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Item:</Text>
          <Text style={styles.summaryValue}>
            {cartItems.reduce((total, item) => total + item.quantity, 0)} item
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Harga:</Text>
          <Text style={styles.totalPrice}>{formatRupiah(getTotalPrice())}</Text>
        </View>
        
        {/* 🆕 POLLING INFO TAMBAHAN */}
        {netInfo.type !== 'cellular' && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Auto-update:</Text>
            <Text style={styles.summaryValue}>
              {pollingData.totalUpdates} updates
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Produk dalam Keranjang</Text>
        
        {cartItems.map((item) => {
          const finalPrice = item.product.diskon
            ? item.product.harga * (1 - item.product.diskon / 100)
            : item.product.harga;

          return (
            <View key={item.product.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.product.gambar }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product.nama}
                </Text>
                
                <View style={styles.priceContainer}>
                  {item.product.diskon ? (
                    <>
                      <Text style={styles.originalPrice}>
                        {formatRupiah(item.product.harga)}
                      </Text>
                      <Text style={styles.finalPrice}>
                        {formatRupiah(finalPrice)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.finalPrice}>
                      {formatRupiah(finalPrice)}
                    </Text>
                  )}
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.product.id, item.product.nama)}
                  >
                    <FontAwesome6 name="trash" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemTotal}>
                  Subtotal: {formatRupiah(finalPrice * item.quantity)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearButtonText}>🗑️ Kosongkan Keranjang</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>
            💳 Checkout - {formatRupiah(getTotalPrice())}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const headerBackButtonStyles = StyleSheet.create({
  button: {
    marginLeft: 15,
    padding: 8,
  },
});

// 🆕 STYLES UNTUK POLLING STATUS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pollingStatus: {
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pollingActive: {
    backgroundColor: colors.primary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  pollingDisabled: {
    backgroundColor: colors.textLight + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.textLight,
  },
  pollingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueShoppingText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  cartItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.background,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  itemTotal: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  clearButton: {
    backgroundColor: colors.error + '15',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});