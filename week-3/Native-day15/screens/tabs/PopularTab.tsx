import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ProductList from '../../components/ProductList';
import { Product } from '../../navigation/types';
import { colors } from '../../color/colors';
import { RootDrawerParamList } from '../../navigation/types';

interface Props {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export default function PopularTab({ products, onProductPress }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  // ✅ Dynamic Header Title Based on Focus
  useFocusEffect(
    useCallback(() => {
      // Update header title parent stack
      navigation.getParent()?.setOptions({
        title: 'Produk Terpopuler! 🔥',
        headerStyle: {
          backgroundColor: colors.primary,
        },
      });

      return () => {
        // Reset header title ketika tab tidak aktif
        navigation.getParent()?.setOptions({
          title: 'Jelajahi Produk',
          headerStyle: {
            backgroundColor: colors.primary,
          },
        });
      };
    }, [navigation])
  );

  // ✅ Clean Toggle Drawer Function
  const handleToggleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produk Populer 🔥</Text>
        <Text style={styles.subtitle}>Yang paling banyak dicari</Text>
        
        {/* ✅ HANYA TOMBUL TOGGLE DRAWER YANG PENTING */}
        <TouchableOpacity 
          style={styles.drawerButton}
          onPress={handleToggleDrawer}
        >
          <Text style={styles.drawerButtonText}>🍔 Buka Menu</Text>
        </TouchableOpacity>
      </View>
      
      <ProductList products={products} onProductPress={onProductPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
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
    marginBottom: 12,
  },
  drawerButton: {
    backgroundColor: colors.primary + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
    alignSelf: 'flex-start',
  },
  drawerButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});