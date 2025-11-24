import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuth } from '../utils/useAuth';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import { colors } from '../color/colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackTo?: keyof RootDrawerParamList;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackTo = 'Login' 
}) => {
  const { isLoggedIn, isLoading, validateToken } = useAuth();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading) {
        const isValid = await validateToken();
        setIsCheckingToken(false);
        
        if (!isValid && !isLoggedIn) {
          console.log('🔒 ProtectedRoute: Redirecting to login');
          // FIX: Gunakan navigate dengan string langsung untuk screen tanpa params
          navigation.navigate(fallbackTo as any);
        }
      }
    };

    checkAuth();
  }, [isLoggedIn, isLoading, validateToken, navigation, fallbackTo]);

  // Tampilkan loading saat checking token
  if (isLoading || isCheckingToken) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // Jika tidak login, tidak render children
  if (!isLoggedIn) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedText}>Access Denied</Text>
        <Text style={styles.accessDeniedSubtext}>
          Please login to access this page
        </Text>
      </View>
    );
  }

  // Jika login, render children
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  accessDeniedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  accessDeniedSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default ProtectedRoute;