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
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        cardStyle: {
          backgroundColor: colors.background,
        },
        
        // ✅ TAHAP 3: KONFIGURASI GESTURE UNTUK STACK NAVIGATOR
        // Biarkan gesture enabled untuk back navigation
        gestureEnabled: true,
        
        // 🎯 GESTURE DIRECTION: Horizontal untuk natural feel
        gestureDirection: 'horizontal',
        
        // 🎯 GESTURE RESPONSE: Optimasi untuk coordination dengan drawer
        gestureResponseDistance: 135, // 👈 Default distance untuk gesture
        
        // 🎯 CARD STYLE INTERPOLATOR: Untuk smooth animation (simplified)
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Jelajahi Produk',
          headerLeft: () => null, // Akan dioverride oleh Drawer navigator
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params?.productName || 'Detail Produk',
          headerBackTitle: 'Kembali',
          headerTintColor: colors.textOnPrimary,
          
          // ✅ TAHAP 3: DISABLE GESTURE UNTUK BACK NAVIGATION DI PRODUCT DETAIL
          // Karena kita ingin prioritaskan drawer lock mode
          gestureEnabled: false, // 👈 Nonaktifkan gesture back di ProductDetail
        })}
      />
    </Stack.Navigator>
  );
}