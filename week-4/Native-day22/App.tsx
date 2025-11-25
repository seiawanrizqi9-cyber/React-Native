import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './src/Project-E-Commerce/navigation/DrawerNavigator';
import { colors } from './src/Project-E-Commerce/color/colors';
import { CartProvider } from './src/Project-E-Commerce/utils/useCart';
import ErrorBoundary from './src/Project-E-Commerce/utils/ErrorBoundary';
import { NetworkProvider } from './src/Project-E-Commerce/context/NetworkContext';
import NetworkBanner from './src/Project-E-Commerce/components/NetworkBanner';
import { useAppInitialization } from './src/Project-E-Commerce/utils/useAppInitialization';
import { WishlistProvider } from './src/Project-E-Commerce/utils/useWishlist';
import { deepLinkHandler } from './src/Project-E-Commerce/utils/deepLinkHandler';
import { linkingConfig } from './src/Project-E-Commerce/navigation/types';
import PermissionService from './src/Project-E-Commerce/utils/permissionService';
import { BiometricProvider } from './src/Project-E-Commerce/utils/useBiometric';

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

const InitializationLoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Preparing application...</Text>
    <Text style={styles.loadingSubtext}>Loading preferences and security</Text>
  </View>
);

const ErrorScreen: React.FC<{ error: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Failed to Load</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    {onRetry && (
      <View style={styles.retryButtonContainer}>
        <Text style={styles.retryButton} onPress={onRetry}>
          Try Again
        </Text>
      </View>
    )}
  </View>
);

// BUAT WRAPPER COMPONENT YANG DIDALAM NavigationContainer
const AppNavigator: React.FC = () => {
  const { data: initData } = useAppInitialization();
  const isLoggedIn = initData?.isAuthenticated || false;
  
  const navigationRef = React.useRef<any>(null);
  const routeNameRef = React.useRef<string>('');
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Initialize permissions on app start
  useEffect(() => {
    const initializePermissions = async () => {
      try {
        const permissions = await PermissionService.checkAllPermissions();
        console.log('📱 App permissions status:', permissions);
      } catch (error) {
        console.error('❌ Failed to check permissions:', error);
      }
    };

    initializePermissions();
  }, []);

  // Process pending deep link actions when app becomes active
  useEffect(() => {
    const processPendingActions = () => {
      const pendingActions = deepLinkHandler.getPendingActions();
      
      if (pendingActions.length > 0 && isLoggedIn) {
        console.log(`🔄 App: Processing ${pendingActions.length} pending deep link actions`);
        
        pendingActions.forEach((action: any) => {
          if (action.type === 'ADD_TO_CART' && action.productId) {
            console.log('📦 App: Processing add-to-cart deep link:', action.productId);
            navigationRef.current?.navigate('AddToCart', {
              productId: action.productId,
              fromDeepLink: true
            });
          }
          deepLinkHandler.removePendingAction(action.timestamp);
        });
      } else if (pendingActions.length > 0 && !isLoggedIn) {
        console.log('🚫 App: Blocking deep links - user not logged in');
        deepLinkHandler.clearPendingActions();
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        console.log('📱 App: Returning to foreground, processing pending actions');
        processPendingActions();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    processPendingActions();

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn]);

  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);
      routeNameRef.current = currentRouteName;

      // ✅ BARU: Log navigation untuk debugging auto-refresh
      console.log('📍 App: Navigation changed to:', currentRouteName);
      
      if (currentRouteName === 'ProductDetail') {
        console.log('🔗 App: Product Detail screen activated via deep link');
      } else if (currentRouteName === 'Checkout') {
        console.log('🔗 App: Checkout screen activated via deep link');
      } else if (currentRouteName === 'AddToCart') {
        console.log('🔗 App: AddToCart screen activated via deep link');
      } else if (currentRouteName === 'Profile') {
        console.log('🔗 App: Profile screen activated - ready for auto-refresh');
      }
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linkingConfig}
      onStateChange={handleNavigationStateChange}
      onReady={() => {
        const currentRoute = navigationRef.current?.getCurrentRoute();
        routeNameRef.current = currentRoute?.name || '';
        console.log('🚀 App: Navigation Container Ready');
        
        const pendingActions = deepLinkHandler.getPendingActions();
        if (pendingActions.length > 0) {
          console.log(`📥 App: ${pendingActions.length} pending deep links detected`);
        }
      }}
      fallback={
        <View style={styles.fallbackContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.fallbackText}>Loading navigation...</Text>
        </View>
      }
    >
      <DrawerNavigator />
    </NavigationContainer>
  );
};

const AppContent: React.FC = () => {
  const {
    isLoading: appInitLoading,
    error: initError,
    initializeApp,
  } = useAppInitialization();

  const handleRetryInitialization = React.useCallback(() => {
    console.log('🔄 App: Retrying initialization...');
    initializeApp();
  }, [initializeApp]);

  if (appInitLoading) {
    return <InitializationLoadingScreen />;
  }

  if (initError) {
    return (
      <ErrorScreen error={initError} onRetry={handleRetryInitialization} />
    );
  }

  return (
    <NetworkProvider>
      <CartProvider>
        <WishlistProvider>
          <BiometricProvider>
            <ErrorBoundary>
              <NetworkBanner />
              <AppNavigator />
            </ErrorBoundary>
          </BiometricProvider>
        </WishlistProvider>
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