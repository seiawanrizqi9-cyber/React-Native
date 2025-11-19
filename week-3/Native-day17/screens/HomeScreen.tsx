import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../color/colors';
import {
  HomeTopTabParamList,
  Product,
  HomeStackParamList,
} from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCategories } from '../utils/useCategories';

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

// Import dummy data
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

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Memuat kategori...</Text>
  </View>
);

const ErrorScreen: React.FC<{ error: string }> = ({ error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Gagal Memuat</Text>
    <Text style={styles.errorMessage}>{error}</Text>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { categories, isLoading, error, isUsingCache } = useCategories();

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.nama,
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen error={error} />
    );
  }

  return (
    <View style={styles.container}>
      {/* Cache Indicator */}
      {isUsingCache && (
        <View style={styles.cacheIndicator}>
          <Text style={styles.cacheText}>
            📦 Menggunakan data cache
          </Text>
        </View>
      )}
      
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
          swipeEnabled: true,
          lazy: true,
          animationEnabled: true,
        }}
      >
        {categories.map(category => {
          const products = dummyProducts[category.id] || [];
          
          return (
            <Tab.Screen
              key={category.id}
              name={category.id as keyof HomeTopTabParamList}
              component={createTabWrapper(
                getTabComponent(category.id),
                products,
                handleProductPress,
              )}
              options={{ 
                title: `${category.icon} ${category.displayName}`
              }}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
}

// Helper function untuk mendapatkan komponen tab yang sesuai
const getTabComponent = (categoryId: string) => {
  const tabComponents: Record<string, React.ComponentType<any>> = {
    popular: PopularTab,
    new: NewTab,
    discount: DiscountTab,
    electronics: ElectronicsTab,
    clothing: ClothingTab,
    food: FoodTab,
    automotive: AutomotiveTab,
    entertainment: EntertainmentTab,
    baby: BabyTab,
  };
  
  return tabComponents[categoryId] || PopularTab;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  cacheIndicator: {
    backgroundColor: colors.primary + '20',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '40',
  },
  cacheText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});