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
import { useAppInitialization } from './src/Project-E-Commerce/utils/useAppInitialization';
import SecurityAlertModal from './src/Project-E-Commerce/components/SecurityAlertModal';

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

  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRouteName = getActiveRouteName(state);
      console.log(`Current Route: ${currentRouteName}`);
    }
  };

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
});