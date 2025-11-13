import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../color/colors';
import {
  HomeTopTabParamList,
  Product,
  HomeStackParamList,
} from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

// Import tab screens
import PopularTab from './tabs/PopularTab';
import NewTab from './tabs/NewTab';
import DiscountTab from './tabs/DiscountTab';
import ElectronicsTab from './tabs/ElectronicsTab';
import ClothingTab from './tabs/ClothingTab';
import FoodTab from './tabs/FoodTab';
import AutomotiveTab from './tabs/AutomotiveTab';
import EntertainmentTab from './tabs/EntertainmentTab';
import BabyTab from './tabs/BabyTab';

// Import dummy data dari file terpisah
import { dummyProducts } from '../data/dummyProducts';

const Tab = createMaterialTopTabNavigator<HomeTopTabParamList>();
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const createTabWrapper = (
  Component: React.ComponentType<{
    products: Product[];
    onProductPress?: (product: Product) => void;
  }>,
  products: Product[],
  onProductPress: (product: Product) => void,
) => {
  return () => (
    <Component products={products} onProductPress={onProductPress} />
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.nama,
    });
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.textOnPrimary,
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarActiveTintColor: colors.textOnPrimary,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            paddingHorizontal: 16,
            minHeight: 48,
          },
          
          // ✅ TAHAP 3: KONFIGURASI SWIPE UNTUK TOP TABS
          // Biarkan swipe enabled untuk tab switching
          swipeEnabled: true,
          
          // 🎯 LAZY LOADING: Untuk performance
          lazy: true,
          
          // 🎯 ANIMATION: Smooth transition
          animationEnabled: true,
          
          // ❌ HAPUS: gestureHandlerProps tidak didukung di Material Top Tabs
        }}
      >
        <Tab.Screen
          name="Popular"
          component={createTabWrapper(
            PopularTab,
            dummyProducts.popular,
            handleProductPress,
          )}
          options={{ title: 'Populer' }}
        />
        <Tab.Screen
          name="New"
          component={createTabWrapper(
            NewTab,
            dummyProducts.new,
            handleProductPress,
          )}
          options={{ title: 'Terbaru' }}
        />
        <Tab.Screen
          name="Discount"
          component={createTabWrapper(
            DiscountTab,
            dummyProducts.discount,
            handleProductPress,
          )}
          options={{ title: 'Diskon' }}
        />
        <Tab.Screen
          name="Electronics"
          component={createTabWrapper(
            ElectronicsTab,
            dummyProducts.electronics,
            handleProductPress,
          )}
          options={{ title: 'Elektronik' }}
        />
        <Tab.Screen
          name="Clothing"
          component={createTabWrapper(
            ClothingTab,
            dummyProducts.clothing,
            handleProductPress,
          )}
          options={{ title: 'Pakaian' }}
        />
        <Tab.Screen
          name="Food"
          component={createTabWrapper(
            FoodTab,
            dummyProducts.food,
            handleProductPress,
          )}
          options={{ title: 'Makanan' }}
        />
        <Tab.Screen
          name="Automotive"
          component={createTabWrapper(
            AutomotiveTab,
            dummyProducts.automotive,
            handleProductPress,
          )}
          options={{ title: 'Otomotif' }}
        />
        <Tab.Screen
          name="Entertainment"
          component={createTabWrapper(
            EntertainmentTab,
            dummyProducts.entertainment,
            handleProductPress,
          )}
          options={{ title: 'Hiburan' }}
        />
        <Tab.Screen
          name="Baby"
          component={createTabWrapper(
            BabyTab,
            dummyProducts.baby,
            handleProductPress,
          )}
          options={{ title: 'Bayi' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});