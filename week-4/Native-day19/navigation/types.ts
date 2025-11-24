import { NavigatorScreenParams } from '@react-navigation/native';
import { LinkingOptions } from '@react-navigation/native'; // ✅ TAMBAH IMPORT

// Root Drawer Navigator Types
export type RootDrawerParamList = {
  Home: NavigatorScreenParams<BottomTabParamList> & {
    userID?: string;
    headerTitle?: string;
    fromDrawer?: string;
    timestamp?: string;
    featureFlags?: {
      enableNewUI: boolean;
      enableAnalytics: boolean;
      experimentalFeatures: boolean;
    };
  };
  Settings: undefined;
  About: undefined;
  Dashboard: undefined;
  Checkout: undefined;
  ProductList: undefined;
  Login: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  Wishlist: undefined;
  // ✅ TAMBAH: Routes untuk cart actions
  AddToCart: { productId: string; fromDeepLink?: boolean };
  RemoveFromCart: { productId: string; fromDeepLink?: boolean };
};

// Bottom Tab Navigator Types
export type BottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> & {
    fromTab?: string;
    inheritedFromDrawer?: boolean;
  };
  ProductList: undefined;
  About: undefined;
  Dashboard: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Navigator Types
export type HomeStackParamList = {
  Home: {
    fromStack?: string;
    passToTabs?: boolean;
    customTitle?: string;
  };
  ProductDetail: {
    productId: string;
    productName?: string;
    navigationChain?: any;
    fromDeepLink?: boolean;
  };
};

// Profile Stack Navigator Types
export type ProfileStackParamList = {
  Profile: {
    userID?: string;
    fromDrawer?: boolean;
    timestamp?: string;
    featureFlags?: {
      enableNewUI?: boolean;
      enableAnalytics?: boolean;
    };
    redirectToCheckout?: boolean;
    fromDeepLink?: boolean;
    deepLinkUserId?: string;
    validationError?: string;
  };
};

// Home Top Tabs Types
export type HomeTopTabParamList = {
  Popular: undefined;
  New: undefined;
  Discount: undefined;
  Electronics: undefined;
  Clothing: undefined;
  Food: undefined;
  Automotive: undefined;
  Entertainment: undefined;
  Baby: undefined;
};

// Product Interface
export interface Product {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  gambar: string;
  kategori: string;
  diskon?: number;
}

// User Interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  gender: string;
  image: string;
  token?: string;
  phone?: string;
  address?: string;
  userId?: string;
}

// Deep Linking Types
export type DeepLinkParams = {
  productId?: string;
  userId?: string;
};

// Types untuk deep link product handling
export type ProductDeepLinkResult = {
  success: boolean;
  product?: Product;
  error?: string;
  isFromDeepLink?: boolean;
};

// Types untuk profile deep link handling
export type ProfileDeepLinkResult = {
  success: boolean;
  userId?: string;
  error?: string;
  isValidFormat?: boolean;
  userExists?: boolean;
};

// Enhanced error types untuk deep linking
export type DeepLinkErrorType = 
  | 'INVALID_URL' 
  | 'SCHEME_NOT_SUPPORTED' 
  | 'ROUTE_NOT_FOUND' 
  | 'PARAMETER_INVALID'
  | 'ANDROID_INTENT_FAILED';

export interface DeepLinkError {
  type: DeepLinkErrorType;
  message: string;
  url?: string;
  timestamp: number;
}

// ✅ FIXED: Extended Linking Config
export const linkingConfig: LinkingOptions<RootDrawerParamList> = {
  prefixes: [
    'ecommerceapp://',
    'https://ecommerceapp.com',
  ],
  config: {
    screens: {
      Home: {
        screens: {
          HomeStack: {
            screens: {
              Home: 'home',
              ProductDetail: 'produk/:id',
            },
          },
        },
      },
      Checkout: 'keranjang',
      ProfileStack: {
        screens: {
          Profile: 'profil/:userId',
        },
      },
      // ✅ TAMBAH: Cart action routes
      AddToCart: 'add-to-cart/:productId',
      RemoveFromCart: 'remove-from-cart/:productId',
      // Fallback routes
      About: 'tentang',
      Dashboard: 'dashboard',
      Settings: 'pengaturan',
      ProductList: 'produk',
      Login: 'login',
      Wishlist: 'wishlist',
    },
  },
};