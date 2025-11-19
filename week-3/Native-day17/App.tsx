import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationState, LinkingOptions } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator, AppState, AppStateStatus, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/Project-E-Commerce/navigation/DrawerNavigator';
import { colors } from './src/Project-E-Commerce/color/colors';

import { CartProvider } from './src/Project-E-Commerce/utils/useCart';
import ErrorBoundary from './src/Project-E-Commerce/utils/ErrorBoundary';
import { NetworkProvider } from './src/Project-E-Commerce/context/NetworkContext';
import NetworkBanner from './src/Project-E-Commerce/components/NetworkBanner';
import { useAuth } from './src/Project-E-Commerce/utils/useAuth';
import { useAppInitialization } from './src/Project-E-Commerce/utils/useAppInitialization';
import SecurityAlertModal from './src/Project-E-Commerce/components/SecurityAlertModal';
import { RootDrawerParamList } from './src/Project-E-Commerce/navigation/types';

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

// Deep Linking Configuration
const linking: LinkingOptions<RootDrawerParamList> = {
  prefixes: [
    'ecommerceapp://',
    'https://ecommerceapp.com' // ✅ TAMBAH HTTPS FALLBACK
  ],
  
  // Config untuk mapping URL ke screens
  config: {
    screens: {
      // Root Drawer Navigator
      Home: {
        screens: {
          // HomeStack melalui BottomTab
          HomeStack: {
            screens: {
              // HomeScreen dengan Top Tabs
              Home: 'home',
              ProductDetail: 'produk/:id',
            },
          },
        },
      },
      Checkout: 'keranjang',
      ProfileStack: {
        screens: {
          Profile: 'profil/:userId',
        },
      },
      // Fallback routes
      About: 'tentang',
      Dashboard: 'dashboard',
      Settings: 'pengaturan',
      ProductList: 'produk',
      Login: 'login',
    },
  },
};

const InitializationLoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Mempersiapkan aplikasi...</Text>
    <Text style={styles.loadingSubtext}>Memuat preferensi dan keamanan</Text>
  </View>
);

const ErrorScreen: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Gagal Memuat</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    {onRetry && (
      <View style={styles.retryButtonContainer}>
        <Text style={styles.retryButton} onPress={onRetry}>
          Coba Lagi
        </Text>
      </View>
    )}
  </View>
);

const AppContent: React.FC = () => {
  const { 
    isLoading: authLoading, 
    securityError, 
    clearSecurityError,
    logout 
  } = useAuth();
  
  const { 
    isLoading: appInitLoading, 
    error: initError, 
    initializeApp 
  } = useAppInitialization();

  const navigationRef = React.useRef<any>(null);
  const routeNameRef = React.useRef<string>('');
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);
      routeNameRef.current = currentRouteName;
      console.log(`Current Route: ${currentRouteName}`);
      
      // Log deep linking activity
      if (currentRouteName === 'ProductDetail') {
        console.log('Deep Link: Product Detail screen activated');
      } else if (currentRouteName === 'Checkout') {
        console.log('Deep Link: Checkout screen activated');
      }
    }
  };

  // Handle App State Changes untuk Warm Start
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log('App State Changed:', appStateRef.current, '→', nextAppState);
      
      // App kembali ke foreground (warm start scenario)
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('🔄 App kembali ke foreground - checking for pending deep links...');
        
        // Check jika ada pending URL yang perlu di-handle
        // React Navigation biasanya handle ini otomatis, tapi kita log untuk debugging
        Linking.getInitialURL().then((url: string | null) => {
          if (url) {
            console.log('📱 Pending deep link detected on warm start:', url);
          }
        });
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSecurityAlertConfirm = React.useCallback(() => {
    clearSecurityError();
    logout();
  }, [clearSecurityError, logout]);

  const handleSecurityAlertCancel = React.useCallback(() => {
    clearSecurityError();
  }, [clearSecurityError]);

  const handleRetryInitialization = React.useCallback(() => {
    initializeApp();
  }, [initializeApp]);

  if (authLoading || appInitLoading) {
    return <InitializationLoadingScreen />;
  }

  if (initError) {
    return (
      <ErrorScreen 
        error={initError} 
        onRetry={handleRetryInitialization}
      />
    );
  }

  if (securityError) {
    return (
      <>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Belanja Skuy</Text>
          <Text style={styles.loginSubtitle}>Terjadi masalah keamanan</Text>
        </View>
        <SecurityAlertModal
          visible={!!securityError}
          message={securityError}
          onConfirm={handleSecurityAlertConfirm}
          onCancel={handleSecurityAlertCancel}
        />
      </>
    );
  }

  return (
    <NetworkProvider>
      <CartProvider>
        <ErrorBoundary>
          <NetworkBanner />
          <NavigationContainer 
            ref={navigationRef}
            linking={linking}
            onStateChange={handleNavigationStateChange}
            onReady={() => {
              routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name || '';
              console.log('🚀 Navigation Container Ready');
            }}
            fallback={
              <View style={styles.fallbackContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.fallbackText}>Memuat navigasi...</Text>
              </View>
            }
          >
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButtonContainer: {
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  fallbackText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
});