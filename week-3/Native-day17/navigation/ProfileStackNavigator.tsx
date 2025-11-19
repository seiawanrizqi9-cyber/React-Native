import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../color/colors';
import { ProfileStackParamList } from './types';

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: colors.background,
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => {
          // Dynamic options berdasarkan deep link parameters
          const fromDeepLink = route.params?.fromDeepLink;
          const deepLinkUserId = route.params?.deepLinkUserId;
          const validationError = route.params?.validationError;

          let headerTitle = 'Profil';
          
          if (fromDeepLink && deepLinkUserId && !validationError) {
            headerTitle = `Profil - ${deepLinkUserId}`;
          } else if (fromDeepLink && validationError) {
            headerTitle = 'Profil Tidak Ditemukan';
          }

          return {
            title: headerTitle,
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.textOnPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          };
        }}
        // ✅ PERBAIKAN: Pass parameter dengan route params
        initialParams={{
          userID: 'U123',
          fromDrawer: true,
          timestamp: new Date().toISOString(),
          featureFlags: {
            enableNewUI: true,
            enableAnalytics: true,
          },
        }}
      />
    </Stack.Navigator>
  );
}