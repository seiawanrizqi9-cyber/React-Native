import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomDrawerContent from '../components/CustomDrawerContent';
import BottomTabNavigator from './BottomTabNavigator';
import { colors } from '../color/colors';
import { RootDrawerParamList } from './types';
import { StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

// ✅ PERBAIKI: Gunakan FontAwesome6 untuk header icons
const HeaderLeft = ({ onPress }: { onPress: () => void }) => (
  <FontAwesome6 
    name="bars" 
    size={24} 
    color={colors.textOnPrimary} 
    style={styles.headerLeftIcon}
    onPress={onPress}
  />
);

const HeaderRight = () => (
  <FontAwesome6 
    name="magnifying-glass" 
    size={24} 
    color={colors.textOnPrimary} 
    style={styles.headerRightIcon}
    onPress={() => console.log('Search pressed')}
  />
);

const getScreenOptions = ({ navigation }: any) => ({
  drawerStyle: {
    backgroundColor: colors.card,
    width: 320,
  },
  drawerActiveTintColor: colors.primary,
  drawerInactiveTintColor: colors.text,
  headerStyle: { 
    backgroundColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
  },
  headerTintColor: colors.textOnPrimary,
  headerTitleStyle: { 
    fontWeight: 'bold' as const,
    fontSize: 18,
  },
  headerTitleAlign: 'center' as const,
  headerLeft: () => <HeaderLeft onPress={() => navigation.toggleDrawer()} />,
  headerRight: () => <HeaderRight />,
  headerTitle: 'Belanja Skuy',
  swipeEnabled: false,
});

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent} 
      screenOptions={getScreenOptions}
    >
      <Drawer.Screen 
        name="Home" 
        component={BottomTabNavigator}
        options={{ 
          title: 'Belanja Skuy',
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeftIcon: {
    marginLeft: 15,
  },
  headerRightIcon: {
    marginRight: 15,
  },
});