import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const LoginPrompt: React.FC<{ onLoginPress: () => void }> = ({ onLoginPress }) => (
  <View style={styles.loginPromptContainer}>
    <View style={styles.avatar}>
      <FontAwesome6 name="circle-user" size={60} color={colors.textLight} />
    </View>
    <Text style={styles.loginTitle}>Belum Login</Text>
    <Text style={styles.loginSubtitle}>
      Masuk untuk mengakses profil dan fitur lengkap
    </Text>
    <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
      <Text style={styles.loginButtonText}>🚪 Masuk ke Akun</Text>
    </TouchableOpacity>
  </View>
);

const ProfileContent: React.FC<{
  user: UserData;
  onLogout: () => void;
  onEditProfile: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}> = ({ user, onLogout, onEditProfile, onRefresh, refreshing }) => {
  const userStats = {
    orders: 15,
    favorites: 8,
    discounts: 12,
    memberSince: 2,
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil 👤</Text>
        <Text style={styles.headerSubtitle}>Kelola informasi akun Anda</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {refreshing && (
            <Text style={styles.refreshingText}>Memperbarui data...</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Informasi Profil</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Lengkap</Text>
            <Text style={styles.infoValue}>{user?.name || 'Belum diatur'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'Belum diatur'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Telepon</Text>
            <Text style={styles.infoValue}>
              {user?.phone || '08123456789'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Alamat</Text>
            <Text style={styles.infoValue}>
              {user?.address || 'Jl. Contoh Alamat No. 123'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Text style={styles.editButtonText}>✏️ Edit Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>🚪 Keluar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Aktivitas Anda</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.orders}</Text>
              <Text style={styles.statLabel}>Pesanan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.favorites}</Text>
              <Text style={styles.statLabel}>Favorit</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.discounts}</Text>
              <Text style={styles.statLabel}>Diskon</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.memberSince}</Text>
              <Text style={styles.statLabel}>Tahun</Text>
            </View>
          </View>
        </View>

        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoTitle}>Status Akun</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✅ Aktif</Text>
          </View>
          <Text style={styles.memberSince}>
            Member sejak: {new Date().getFullYear() - userStats.memberSince}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default function ProfileScreen() {
  const { isLoggedIn, user, logout, loadAuthData } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRedirectToCheckout, setShouldRedirectToCheckout] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 ProfileScreen: DI FOCUS - Load auth data');
      loadAuthData();
      
      if (shouldRedirectToCheckout && isLoggedIn) {
        console.log('✅ Login berhasil, redirect ke checkout...');
        setShouldRedirectToCheckout(false);
        
        setTimeout(() => {
          const parent = navigation.getParent();
          if (parent) {
            (parent as any).navigate('Checkout');
          }
        }, 1500);
      }
      
      return () => {
        console.log('🔄 ProfileScreen: DI TINGGALKAN');
      };
    }, [loadAuthData, isLoggedIn, shouldRedirectToCheckout, navigation])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 Manual refresh profile data');
    await loadAuthData();
    setRefreshing(false);
  }, [loadAuthData]);

  const handleLoginPress = useCallback(() => {
    setShouldRedirectToCheckout(true);
    
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('Login');
    } else {
      Alert.alert('Error', 'Tidak dapat membuka halaman login');
    }
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar?', [
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

  const handleEditProfile = useCallback(() => {
    Alert.alert('Info', 'Fitur edit profil akan segera hadir!');
  }, []);

  useEffect(() => {
    console.log('👤 ProfileScreen State:', {
      isLoggedIn,
      user: user ? `${user.name} (${user.email})` : 'null',
      refreshing,
      shouldRedirectToCheckout
    });
  }, [isLoggedIn, user, refreshing, shouldRedirectToCheckout]);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <LoginPrompt onLoginPress={handleLoginPress} />
      </View>
    );
  }

  return (
    <ProfileContent
      user={user!}
      onLogout={handleLogout}
      onEditProfile={handleEditProfile}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4b4b4bff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  refreshingText: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.error + '15',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
    alignItems: 'center',
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.success + '40',
    marginBottom: 8,
  },
  statusText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 12,
    color: colors.textLight,
  },
});