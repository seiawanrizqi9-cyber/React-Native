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
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
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
