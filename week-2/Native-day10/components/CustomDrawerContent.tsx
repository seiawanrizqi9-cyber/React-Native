import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';

export default function CustomDrawerContent({
  navigation,
  state,
}: DrawerContentComponentProps) {
  const { height } = useWindowDimensions();
  const { isLoggedIn, user, logout, loadAuthData } = useAuth();

  // PERBAIKI: Gunakan useCallback untuk loadAuthData
  const refreshAuthData = useCallback(() => {
    loadAuthData();
  }, [loadAuthData]);

  // Refresh data ketika drawer dibuka atau screen berubah
  useEffect(() => {
    refreshAuthData();
  }, [state.index, refreshAuthData]); 

  const handleLogout = async () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Sukses', 'Anda telah berhasil keluar');
            } catch (error) {
              Alert.alert('Error', 'Gagal keluar, coba lagi');
            }
          }
        },
      ]
    );
  };

  const handleLogin = () => {
    navigation.navigate('Profile');
  };

  const menuItems = [
    { label: 'Beranda', icon: '🏠', route: 'Home' },
    { label: 'Tentang', icon: '📱', route: 'About' },
    { label: 'Dashboard', icon: '📊', route: 'Dashboard' },
    { label: 'Profil', icon: '👤', route: 'Profile' },
  ];

  return (
    <View style={[styles.container, { maxHeight: height * 0.9 }]}>
      <View style={styles.header}>
        {isLoggedIn && user ? (
          <>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </>
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
            <Text style={styles.userName}>Belum Login</Text>
            <Text style={styles.userEmail}>Silakan masuk untuk akses penuh</Text>
          </>
        )}
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.menuItem,
              state.routes[state.index].name === item.route && styles.menuItemActive
            ]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[
              styles.menuLabel,
              state.routes[state.index].name === item.route && styles.menuLabelActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutLabel}>Keluar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginIcon}>🔑</Text>
            <Text style={styles.loginLabel}>Masuk</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.cardSecondary,
  },
  menuItemActive: {
    backgroundColor: colors.primary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.error + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  logoutLabel: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  loginIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  loginLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});