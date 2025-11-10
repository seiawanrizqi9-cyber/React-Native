import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/Project-E-Commerce/navigation/DrawerNavigator';
import { colors } from './src/Project-E-Commerce/color/colors';

// HAPUS import AuthProvider jika pakai versi sederhana
// import { AuthProvider } from './utils/authContext';

export default function App() {
  return (
    // HAPUS AuthProvider wrapper jika pakai versi sederhana
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.primary}
        translucent 
      />
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <NavigationContainer >
            <DrawerNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});