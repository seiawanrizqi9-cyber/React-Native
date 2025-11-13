import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import HomeStackNavigator from './HomeStackNavigator';
import AboutScreen from '../screens/AboutScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import { colors } from '../color/colors';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ✅ ICON COMPONENTS TERPISAH
const HomeIcon = ({ focused, size }: { focused: boolean; size: number }) => (
  <FontAwesome6 
    name="house" 
    size={size} 
    color={focused ? colors.primary : '#000000ff'} 
  />
);

const AboutIcon = ({ focused, size }: { focused: boolean; size: number }) => (
  <FontAwesome6 
    name="circle-info" 
    size={size} 
    color={focused ? colors.primary : '#000000'}
  />
);

const DashboardIcon = ({ focused, size }: { focused: boolean; size: number }) => (
  <FontAwesome6 
    name="chart-simple" 
    size={size} 
    color={focused ? colors.primary : '#000000'}
  />
);

const ProfileIcon = ({ focused, size }: { focused: boolean; size: number }) => (
  <FontAwesome6 
    name="user" 
    size={size} 
    color={focused ? colors.primary : '#000000'}
  />
);

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: '#000000ff',    
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: 'Beranda',
          tabBarIcon: HomeIcon,
        }}
        // 🎯 TERUSKAN PARAMETER DARI DRAWER KE HOME STACK
        initialParams={{ 
          fromTab: 'Data dari Bottom Tab',
          inheritedFromDrawer: true
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Tentang',
          tabBarIcon: AboutIcon,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profil',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}