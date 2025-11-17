import { NavigatorScreenParams } from '@react-navigation/native';

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
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>; // ❌ HAPUS userID dari sini
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
  };
};

// Profile Stack Navigator Types
export type ProfileStackParamList = {
  Profile: {
    userID?: string;
    fromDrawer?: boolean; // ✅ TAMBAH
    timestamp?: string; // ✅ TAMBAH
    featureFlags?: {
      // ✅ TAMBAH (optional)
      enableNewUI?: boolean;
      enableAnalytics?: boolean;
    };
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
