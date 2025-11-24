import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '../navigation/types';
import { colors } from '../color/colors';
import { useCart } from '../utils/useCart';
import { getProductById } from '../data/dummyProducts';
import { useAuth } from '../utils/useAuth';

type AddToCartScreenNavigationProp = StackNavigationProp<RootDrawerParamList, 'AddToCart'>;
type AddToCartScreenRouteProp = RouteProp<RootDrawerParamList, 'AddToCart'>;

export default function AddToCartScreen() {
  const route = useRoute<AddToCartScreenRouteProp>();
  const navigation = useNavigation<AddToCartScreenNavigationProp>();
  const { productId, fromDeepLink } = route.params;
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processAddToCart = async () => {
      try {
        setIsProcessing(true);
        
        // Check authentication
        if (!isLoggedIn) {
          Alert.alert(
            'Login Diperlukan',
            'Silakan login terlebih dahulu untuk menambah produk ke keranjang',
            [
              {
                text: 'Login',
                onPress: () => {
                  navigation.navigate('Login' as any);
                },
              },
              {
                text: 'Batal',
                style: 'cancel',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
          return;
        }

        // Validate product
        const product = getProductById(productId);
        if (!product) {
          Alert.alert(
            'Produk Tidak Ditemukan',
            `Produk dengan ID ${productId} tidak tersedia`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
          return;
        }

        // Add to cart
        await addToCart(product);
        setSuccess(true);
        
        // Show success message
        Alert.alert(
          'Berhasil 🎉',
          `${product.nama} telah ditambahkan ke keranjang`,
          [
            {
              text: 'Lihat Keranjang',
              onPress: () => {
                navigation.navigate('Checkout' as any);
              },
            },
            {
              text: 'Lanjut Belanja',
              onPress: () => {
                navigation.navigate('Home' as any);
              },
            },
          ]
        );

      } catch (error: any) {
        console.error('Add to cart error:', error);
        Alert.alert(
          'Gagal',
          'Tidak dapat menambahkan produk ke keranjang',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processAddToCart();
  }, [productId, addToCart, isLoggedIn, navigation]);

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          Menambahkan produk ke keranjang...
        </Text>
        {fromDeepLink && (
          <Text style={styles.deepLinkText}>
            🔗 Dibuka dari Deep Link
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>
        {success ? '✅ Berhasil!' : '❌ Gagal'}
      </Text>
      <Text style={styles.message}>
        {success 
          ? 'Produk telah ditambahkan ke keranjang' 
          : 'Tidak dapat menambahkan produk'
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  deepLinkText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
});