import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { colors } from '../color/colors';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // HEADER STACK DISEMBUNYIKAN - HANYA HEADER DRAWER YANG TAMPIL
        headerShown: false,
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Beranda',
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          title: 'Detail Produk',
          // HEADER TIDAK DITAMPILKAN DI DETAIL - Tetap pakai header drawer
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}