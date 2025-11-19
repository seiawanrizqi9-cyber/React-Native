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
        
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        gestureResponseDistance: 135,
        
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
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={({ route }) => {
          // Dynamic title berdasarkan nama produk dari deep link
          const productName = route.params?.productName;
          const fromDeepLink = route.params?.fromDeepLink;
          
          let title = 'Detail Produk';
          if (productName) {
            title = productName;
          } else if (fromDeepLink) {
            title = 'Memuat Produk...';
          }

          return {
            title: title,
            headerBackTitle: 'Kembali',
            headerTintColor: colors.textOnPrimary,
            
            gestureEnabled: false,
          };
        }}
      />
    </Stack.Navigator>
  );
}