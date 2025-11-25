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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';

export default function CustomDrawerContent({
  navigation,
}: DrawerContentComponentProps) {
  const { height } = useWindowDimensions();
  const { isLoggedIn, user, logout, loadAuthData } = useAuth();

  const refreshAuthData = useCallback(() => {
    loadAuthData();
  }, [loadAuthData]);

  useEffect(() => {
    refreshAuthData();
  }, [refreshAuthData]);

  const handleLogout = useCallback(async () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
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
        },
      },
    ]);
  }, [logout]);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login', {
      screen: 'ProfileStack',
    });
  }, [navigation]);

  const menuItems = [
    { label: 'Beranda', icon: 'house', tab: 'HomeStack' },
    { label: 'Tentang', icon: 'circle-info', tab: 'About' },
    { label: 'Dashboard', icon: 'chart-simple', tab: 'Dashboard' },
    { label: 'Profil', icon: 'user', tab: 'ProfileStack' },
  ];

  const handleMenuPress = useCallback(
    (tab: string) => {
      navigation.navigate('Home', { screen: tab });
    },
    [navigation],
  );

  return (
    <View style={[styles.container, { maxHeight: height * 0.9 }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {isLoggedIn && user ? (
            <>
              <Text style={styles.userName}>
                {
                  user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'User' // ✅ PERBAIKAN: hapus user?.name
                }
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.userName}>Guest</Text>
              <Text style={styles.userEmail}>
                Silakan masuk untuk akses penuh
              </Text>
            </>
          )}
        </View>

        <View style={styles.avatarContainer}>
          {isLoggedIn && user ? (
            <View style={styles.avatarWithLetter}>
              <Text style={styles.avatarLetter}>
                {user?.firstName || user?.username ? (
                  <Text style={styles.avatarLetter}>
                    {(user.firstName || user.username).charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <FontAwesome6
                    name="circle-user"
                    size={40}
                    color={colors.textOnPrimary}
                  />
                )}
              </Text>
            </View>
          ) : (
            <FontAwesome6
              name="circle-user"
              size={40}
              color={colors.textOnPrimary}
            />
          )}
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.tab}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.tab)}
          >
            <FontAwesome6
              name={item.icon}
              size={20}
              color={colors.text}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome6
              name="right-from-bracket"
              size={16}
              color={colors.error}
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutLabel}>Keluar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <FontAwesome6
              name="right-to-bracket"
              size={16}
              color={colors.primary}
              style={styles.loginIcon}
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWithLetter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
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
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
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
    marginRight: 10,
  },
  loginLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
