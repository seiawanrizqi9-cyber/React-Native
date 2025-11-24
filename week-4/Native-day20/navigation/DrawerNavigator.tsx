import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomDrawerContent from '../components/CustomDrawerContent';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProductListScreen from '../screens/ProductListScreen';
import LoginScreen from '../screens/LoginScreen';
import { colors } from '../color/colors';
import { RootDrawerParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../utils/useCart';
import WishlistScreen from '../screens/WishlistScreen';
import WishlistIndicator from '../components/WishlistIndicator';
// ✅ TAMBAH: Import AddToCartScreen
import AddToCartScreen from '../screens/AddToCartScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const HeaderLeft = ({ navigation }: { navigation: any }) => (
  <FontAwesome6
    name="bars"
    size={24}
    color={colors.textOnPrimary}
    style={styles.headerLeftIcon}
    onPress={() => navigation.toggleDrawer()}
  />
);

interface TouchableCartIconProps {
  getTotalItems: () => number;
  onPress: () => void;
}

const TouchableCartIcon: React.FC<TouchableCartIconProps> = ({
  getTotalItems,
  onPress,
}) => {
  const totalItems = getTotalItems();

  return (
    <View style={styles.cartContainer}>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome6
          name="cart-shopping"
          size={24}
          color={colors.textOnPrimary}
        />
      </TouchableOpacity>
      {totalItems > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

interface HeaderRightProps {
  navigation: any;
  getTotalItems: () => number;
}

const HeaderRight: React.FC<HeaderRightProps> = ({
  navigation,
  getTotalItems,
}) => (
  <View style={styles.headerRightContainer}>
    <WishlistIndicator />
    <FontAwesome6
      name="magnifying-glass"
      size={24}
      color={colors.textOnPrimary}
      style={styles.headerRightIcon}
      onPress={() => console.log('Search pressed')}
    />
    <TouchableCartIcon
      getTotalItems={getTotalItems}
      onPress={() => navigation.navigate('Checkout')}
    />
  </View>
);

// ✅ FIXED: Hapus ModalHeaderLeft yang tidak digunakan

const useSwipeSettingsRealTime = () => {
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const loadSwipeSetting = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('@app_settings');
        if (storedSettings && isMounted) {
          const settings = JSON.parse(storedSettings);
          setSwipeEnabled(settings.swipeDrawer);
        }
      } catch (error) {
        console.error('Gagal load swipe setting:', error);
      }
    };

    loadSwipeSetting();

    intervalId = setInterval(loadSwipeSetting, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return swipeEnabled;
};

const createScreenOptions = (
  swipeEnabled: boolean,
  getTotalItems: () => number,
) => {
  return ({ navigation, route }: any) => ({
    drawerStyle: {
      backgroundColor: colors.card,
      width: 320,
    },
    drawerActiveTintColor: colors.primary,
    drawerInactiveTintColor: colors.text,
    headerStyle: {
      backgroundColor: colors.primary,
      elevation: 0,
      shadowOpacity: 0,
      height: 70,
    },
    headerTintColor: colors.textOnPrimary,
    headerTitleStyle: {
      fontWeight: 'bold' as const,
      fontSize: 18,
    },
    headerTitleAlign: 'center' as const,

    headerLeft: () => <HeaderLeft navigation={navigation} />,

    headerRight: () => (
      <HeaderRight navigation={navigation} getTotalItems={getTotalItems} />
    ),
    headerTitle: route.params?.headerTitle || 'Belanja Skuy',

    swipeEnabled: swipeEnabled,
    gestureEnabled: swipeEnabled,
    swipeEdgeWidth: swipeEnabled ? 30 : 0,

    drawerType: 'front' as const,
    lazy: true,
    detachInactiveScreens: true,
  });
};

const CheckoutScreenOptions = ({ navigation }: any) => ({
  title: 'Keranjang Belanja',
  headerShown: true,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.modalCloseButton}
    >
      <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
    </TouchableOpacity>
  ),
  swipeEnabled: false,
  gestureEnabled: false,
});

// ✅ TAMBAH: Options untuk AddToCartScreen (hidden)
const AddToCartScreenOptions = {
  headerShown: false,
  swipeEnabled: false,
  gestureEnabled: false,
};

export default function DrawerNavigator() {
  const swipeEnabled = useSwipeSettingsRealTime();
  const { getTotalItems } = useCart();

  const screenOptions = createScreenOptions(swipeEnabled, getTotalItems);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={screenOptions}
      defaultStatus="closed"
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          title: 'Beranda',
          headerShown: true,
        }}
        initialParams={{
          userID: 'U123',
          fromDrawer: 'Data dari Root Drawer',
          timestamp: new Date().toISOString(),
          featureFlags: {
            enableNewUI: true,
            enableAnalytics: true,
            experimentalFeatures: false,
          },
        }}
      />
      <Drawer.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: 'Favorit Saya',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Tentang Kami',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={CheckoutScreenOptions}
      />
      <Drawer.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Product List (API)',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          headerShown: true,
        }}
      />
      {/* ✅ TAMBAH: AddToCart Screen */}
      <Drawer.Screen
        name="AddToCart"
        component={AddToCartScreen}
        options={AddToCartScreenOptions}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeftIcon: {
    marginLeft: 15,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerRightIcon: {
    marginRight: 20,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginLeft: 15,
    padding: 8,
  },
});