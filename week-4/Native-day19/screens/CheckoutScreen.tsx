import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../color/colors';
import { useCart } from '../utils/useCart';
import { useNavigation } from '@react-navigation/native';
import ProtectedRoute from '../components/ProtectedRoute';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useAuth } from '../utils/useAuth';
import { biometricService } from '../utils/biometricService';

interface CheckoutFormData {
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  kota: string;
  kodePos: string;
}

// ✅ FUNGSI FORMAT RUPIAH DIPINDAHKAN KE ATAS (HANYA SATU DEKLARASI)
const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function CheckoutScreen() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const { requireLogin, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    kota: '',
    kodePos: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDeepLink, setFromDeepLink] = useState(false);
  const [isProcessingBiometric, setIsProcessingBiometric] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Cek ketersediaan biometric saat component mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const availability = await biometricService.checkBiometricAvailability();
      setBiometricAvailable(availability.available);
      console.log('🔐 Biometric availability for transaction:', availability);
    } catch (error) {
      console.error('❌ Failed to check biometric availability:', error);
    }
  };

  // Handle deep link opening
  useEffect(() => {
    console.log('CheckoutScreen - Opened from deep link');
    setFromDeepLink(true);

    // Auto-hide deep link indicator setelah 3 detik
    const timer = setTimeout(() => {
      setFromDeepLink(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCheckoutWithAuth = useCallback(() => {
    if (!requireLogin()) {
      Alert.alert(
        'Login Diperlukan',
        'Anda harus login terlebih dahulu untuk melakukan checkout.',
        [
          { text: 'Nanti', style: 'cancel' },
          {
            text: 'Login Sekarang',
            onPress: () => {
              navigation.navigate('Home', {
                screen: 'ProfileStack',
                params: {
                  screen: 'Profile',
                  params: {
                    redirectToCheckout: true,
                  },
                },
              });
            },
          },
        ],
      );
      return false;
    }
    return true;
  }, [requireLogin, navigation]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        drawerLockMode: 'locked-closed' as const,
      });
    }

    return () => {
      if (parent) {
        parent.setOptions({
          drawerLockMode: 'unlocked' as const,
        });
      }
    };
  }, [navigation]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  // ✅ PROCESS PAYMENT FUNCTION
  const processPayment = async (): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      // Simulasi proses pembayaran
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        if (success) {
          resolve({ success: true, message: 'Pembayaran berhasil diproses!' });
        } else {
          resolve({ success: false, message: 'Pembayaran gagal. Silakan coba lagi.' });
        }
      }, 2000);
    });
  };

  // ✅ BIOMETRIC CONFIRMATION UNTUK TRANSAKSI - VERSI DIPERBAIKI
  const handleBiometricConfirmation = async () => {
    if (!handleCheckoutWithAuth()) {
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Keranjang Kosong', 'Tambahkan produk terlebih dahulu!');
      return;
    }

    // Validasi form terlebih dahulu
    const validationErrors: Record<string, string> = {};
    if (!formData.alamat) validationErrors.alamat = 'Alamat wajib diisi';
    if (!formData.nama) validationErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.email) validationErrors.email = 'Email wajib diisi';
    if (!formData.telepon) validationErrors.telepon = 'Nomor telepon wajib diisi';
    if (!formData.kota) validationErrors.kota = 'Kota wajib diisi';

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      Alert.alert('Form Tidak Lengkap', 'Harap lengkapi semua field yang wajib diisi.');
      return;
    }

    setIsProcessingBiometric(true);

    try {
      const totalAmount = getTotalPrice();
      
      // ✅ PANGGIL BIOMETRIC CONFIRMATION YANG SUDAH DIPERBAIKI
      const biometricResult = await biometricService.promptTransactionConfirmation(
        totalAmount,
        'Checkout'
      );

      if (biometricResult.success) {
        console.log('✅ Biometric confirmation successful, processing payment...');
        
        // Lanjutkan dengan proses pembayaran
        await handleCheckoutFinal();
      } else {
        // Handle berbagai error biometric
        if (biometricResult.errorCode === 'NOT_ENROLLED') {
          Alert.alert(
            'Konfirmasi Manual Diperlukan',
            biometricResult.error || 'Silakan gunakan metode konfirmasi manual.',
            [
              { text: 'Konfirmasi Manual', onPress: () => handleManualConfirmation() },
              { text: 'Batal', style: 'cancel' }
            ]
          );
        } else if (biometricResult.errorCode === 'LOCKOUT') {
          await biometricService.handleBiometricLockout();
          Alert.alert(
            'Transaksi Dibatalkan',
            'Terlalu banyak percobaan gagal. Transaksi dibatalkan untuk keamanan.'
          );
        } else if (biometricResult.errorCode === 'USER_CANCEL') {
          // ✅ PERBAIKAN: Alert spesifik untuk transaksi dibatalkan
          Alert.alert(
            'Transaksi Dibatalkan',
            'Konfirmasi transaksi dibatalkan oleh pengguna.',
            [{ text: 'Mengerti', style: 'default' }]
          );
        } else {
          Alert.alert(
            'Konfirmasi Dibatalkan',
            biometricResult.error || 'Konfirmasi transaksi dibatalkan.',
            [
              { text: 'Coba Lagi', onPress: () => handleBiometricConfirmation() },
              { text: 'Konfirmasi Manual', onPress: () => handleManualConfirmation() }
            ]
          );
        }
      }
    } catch (error: any) {
      console.error('❌ Biometric confirmation error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat konfirmasi transaksi.');
    } finally {
      setIsProcessingBiometric(false);
    }
  };

  // ✅ FALLBACK KE KONFIRMASI MANUAL (PIN/PASSWORD)
  const handleManualConfirmation = () => {
    Alert.alert(
      'Konfirmasi Manual',
      `Anda akan melakukan checkout sebesar ${formatRupiah(getTotalPrice())}. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Lanjutkan',
          style: 'default',
          onPress: () => handleCheckoutFinal()
        },
      ]
    );
  };

  // ✅ FINAL CHECKOUT PROCESS
  const handleCheckoutFinal = async () => {
    setIsSubmitting(true);

    try {
      // Proses pembayaran
      const paymentResult = await processPayment();

      if (paymentResult.success) {
        Alert.alert(
          'Checkout Berhasil! 🎉',
          `Terima kasih telah berbelanja!\n${paymentResult.message}\nTotal: ${formatRupiah(getTotalPrice())}`,
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.goBack();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Pembayaran Gagal',
          paymentResult.message,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Checkout Gagal',
        error.message || 'Terjadi kesalahan saat proses checkout. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ HANDLE CHECKOUT BUTTON PRESS
  const handleCheckout = () => {
    if (biometricAvailable && !isProcessingBiometric) {
      handleBiometricConfirmation();
    } else {
      handleManualConfirmation();
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert('Hapus Produk', `Hapus "${productName}" dari keranjang?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => removeFromCart(productId),
      },
    ]);
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
    <ProtectedRoute fallbackTo="Login">
      <View style={styles.container}>
        {fromDeepLink && (
          <View style={styles.deepLinkIndicator}>
            <Text style={styles.deepLinkText}>🔗 Dibuka dari Deep Link</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama Lengkap *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  fieldErrors.nama && styles.inputError,
                ]}
                value={formData.nama}
                onChangeText={value => handleInputChange('nama', value)}
                onFocus={() => clearFieldError('nama')}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={colors.textLight}
              />
              {fieldErrors.nama && (
                <Text style={styles.errorText}>{fieldErrors.nama}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  fieldErrors.email && styles.inputError,
                ]}
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                onFocus={() => clearFieldError('email')}
                placeholder="email@contoh.com"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nomor Telepon *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  fieldErrors.telepon && styles.inputError,
                ]}
                value={formData.telepon}
                onChangeText={value => handleInputChange('telepon', value)}
                onFocus={() => clearFieldError('telepon')}
                placeholder="08xxxxxxxxxx"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
              />
              {fieldErrors.telepon && (
                <Text style={styles.errorText}>{fieldErrors.telepon}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Alamat Lengkap *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  fieldErrors.alamat && styles.inputError,
                ]}
                value={formData.alamat}
                onChangeText={value => handleInputChange('alamat', value)}
                onFocus={() => clearFieldError('alamat')}
                placeholder="Jl. Contoh Alamat No. 123"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={3}
              />
              {fieldErrors.alamat && (
                <Text style={styles.errorText}>{fieldErrors.alamat}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kota *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  fieldErrors.kota && styles.inputError,
                ]}
                value={formData.kota}
                onChangeText={value => handleInputChange('kota', value)}
                onFocus={() => clearFieldError('kota')}
                placeholder="Nama kota"
                placeholderTextColor={colors.textLight}
              />
              {fieldErrors.kota && (
                <Text style={styles.errorText}>{fieldErrors.kota}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kode Pos</Text>
              <TextInput
                style={styles.textInput}
                value={formData.kodePos}
                onChangeText={value => handleInputChange('kodePos', value)}
                placeholder="12345"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ringkasan Belanja</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Item:</Text>
              <Text style={styles.summaryValue}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}{' '}
                item
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Harga:</Text>
              <Text style={styles.totalPrice}>
                {formatRupiah(getTotalPrice())}
              </Text>
            </View>

            {/* Info Biometric */}
            {biometricAvailable && (
              <View style={styles.biometricInfo}>
                <Text style={styles.biometricInfoText}>
                  🔐 Transaksi ini akan dikonfirmasi dengan biometric
                </Text>
              </View>
            )}
          </View>

          <ScrollView
            style={styles.productList}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Produk dalam Keranjang</Text>

            {cartItems.map(item => {
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
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.quantityText}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() =>
                          handleRemoveItem(item.product.id, item.product.nama)
                        }
                      >
                        <FontAwesome6
                          name="trash"
                          size={16}
                          color={colors.error}
                        />
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
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>🗑️ Kosongkan Keranjang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              (isSubmitting || isProcessingBiometric) && styles.checkoutButtonDisabled,
              !isLoggedIn && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={isSubmitting || isProcessingBiometric || !isLoggedIn}
          >
            {isProcessingBiometric ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.textOnPrimary} />
                <Text style={styles.checkoutButtonText}>Mengonfirmasi...</Text>
              </View>
            ) : !isLoggedIn ? (
              <Text style={styles.checkoutButtonText}>🔐 Login untuk Checkout</Text>
            ) : isSubmitting ? (
              <Text style={styles.checkoutButtonText}>🔄 Memproses...</Text>
            ) : biometricAvailable ? (
              <Text style={styles.checkoutButtonText}>🔐 Checkout - {formatRupiah(getTotalPrice())}</Text>
            ) : (
              <Text style={styles.checkoutButtonText}>💳 Checkout - {formatRupiah(getTotalPrice())}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  scrollContainer: {
    flex: 1,
  },
  formSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
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
  biometricInfo: {
    backgroundColor: colors.primary + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  biometricInfoText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  productList: {
    flex: 1,
    paddingHorizontal: 16,
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
  checkoutButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});