import { NavigatorScreenParams } from '@react-navigation/native';

// Root Drawer Navigator Types - ✅ PERBAIKI: Hanya satu screen
export type RootDrawerParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
};

// Bottom Tab Navigator Types - ✅ PERBAIKI: Semua screen di sini
export type BottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  About: undefined;
  Dashboard: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Navigator Types
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string; productName?: string };
};

// Profile Stack Navigator Types  
export type ProfileStackParamList = {
  Profile: undefined;
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