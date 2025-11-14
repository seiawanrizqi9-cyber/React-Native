import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/Project-E-Commerce/navigation/DrawerNavigator';
import { colors } from './src/Project-E-Commerce/color/colors';
import { CartProvider } from './src/Project-E-Commerce/utils/useCart';
import ErrorBoundary from './src/Project-E-Commerce/utils/ErrorBoundary';
import { NetworkProvider } from './src/Project-E-Commerce/context/NetworkContext'; // IMPORT BARU
import NetworkBanner from './src/Project-E-Commerce/components/NetworkBanner'; // IMPORT BARU

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

export default function App() {
  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);
      console.log(`Current Route: ${currentRouteName}`);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent
      />
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaView style={styles.safeArea}>
          {/* NETWORK PROVIDER BARU */}
          <NetworkProvider>
            <CartProvider>
              <ErrorBoundary>
                {/* NETWORK BANNER BARU */}
                <NetworkBanner />
                <NavigationContainer onStateChange={handleNavigationStateChange}>
                  <DrawerNavigator />
                </NavigationContainer>
              </ErrorBoundary>
            </CartProvider>
          </NetworkProvider>
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