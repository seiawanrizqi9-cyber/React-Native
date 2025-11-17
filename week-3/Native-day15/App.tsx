import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/Project-E-Commerce/navigation/DrawerNavigator';
import { colors } from './src/Project-E-Commerce/color/colors';
import { CartProvider } from './src/Project-E-Commerce/utils/useCart';
import ErrorBoundary from './src/Project-E-Commerce/utils/ErrorBoundary';
import { NetworkProvider } from './src/Project-E-Commerce/context/NetworkContext';
import NetworkBanner from './src/Project-E-Commerce/components/NetworkBanner';
import { useAuth } from './src/Project-E-Commerce/utils/useAuth';

// Component untuk Auth Loading Screen
const AuthLoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Memeriksa autentikasi...</Text>
  </View>
);

// Component untuk Login Screen (sementara)
const LoginScreen: React.FC = () => (
  <View style={styles.loginContainer}>
    <Text style={styles.loginTitle}>Belanja Skuy</Text>
    <Text style={styles.loginSubtitle}>Silakan login untuk melanjutkan</Text>
    <Text style={styles.loginHint}>
      🔐 Authentication Guard Active{'\n'}
      Token akan diperiksa secara otomatis
    </Text>
    <Text style={styles.loginInstruction}>
      Buka drawer menu → Login untuk mengakses aplikasi
    </Text>
  </View>
);

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

const AppContent: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);
      console.log(`Current Route: ${currentRouteName}`);
    }
  };

  // Handle loading state
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Handle unauthenticated state - GUARD FLOW
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Authenticated state - render main app
  return (
    <NetworkProvider>
      <CartProvider>
        <ErrorBoundary>
          <NetworkBanner />
          <NavigationContainer onStateChange={handleNavigationStateChange}>
            <DrawerNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </CartProvider>
    </NetworkProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent
      />
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaView style={styles.safeArea}>
          <AppContent />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginHint: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: colors.primary + '15',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 16,
  },
  loginInstruction: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});