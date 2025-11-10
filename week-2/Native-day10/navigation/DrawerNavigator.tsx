import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { colors } from '../color/colors';

const Drawer = createDrawerNavigator();

const screenOptions = {
  drawerStyle: {
    backgroundColor: colors.card,
    width: 320,
  },
  drawerActiveTintColor: colors.primary,
  drawerInactiveTintColor: colors.text,
  headerStyle: { 
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.textOnPrimary,
  headerTitleStyle: { 
    fontWeight: 'bold' as const,
    fontSize: 18,
  },
  headerTitleAlign: 'center' as const,
  swipeEnabled: false,
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent} 
      screenOptions={screenOptions}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Beranda' }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'Tentang Kami' }}
      />
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil Saya' }}
      />
    </Drawer.Navigator>
  );
}