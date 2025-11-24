import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { biometricService } from '../utils/biometricService';
import ApiKeyManager from '../utils/api/apiKeyManager';

type LoginScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Login'>;

// HANYA SATU DEMO ACCOUNT - emilys
const demoAccount = {
  username: 'emilys',
  password: 'emilyspass',
  description: 'Demo user account'
};

export default function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = React.useState(false);
  const [biometricAvailable, setBiometricAvailable] = React.useState(false);
  const [biometryType, setBiometryType] = React.useState<string | null>(null);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, loadAuthData } = useAuth();

  // Cek ketersediaan biometric saat component mount
  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const availability = await biometricService.checkBiometricAvailability();
      setBiometricAvailable(availability.available);
      setBiometryType(availability.biometryType || null);
      
      console.log('🔐 Biometric availability on login:', availability);
    } catch (error) {
      console.error('❌ Failed to check biometric availability:', error);
    }
  };

  const fillDemoAccount = () => {
    setUsername(demoAccount.username);
    setPassword(demoAccount.password);
    Alert.alert('Demo Account', `Account filled: ${demoAccount.description}`);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and Password are required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username.trim(), password.trim());
      
      // ✅ SIMPAN TOKEN KE KEYCHAIN SETELAH LOGIN MANUAL SUKSES
      if (result.token) {
        await ApiKeyManager.saveUserToken(result.token, 24 * 60 * 60 * 1000);
        console.log('✅ Token saved to Keychain after manual login');
      }
      
      Alert.alert('Login Success', `Welcome back, ${result.user.firstName}! 🎉`);
      
      // Navigate back to previous screen or home
      navigation.goBack();
      
    } catch (error: any) {
      console.error('Login screen error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIN CEPAT DENGAN BIOMETRIC - VERSI DIPERBAIKI
  const handleBiometricLogin = async () => {
    setIsBiometricLoading(true);
    
    try {
      console.log('🔐 Starting biometric login...');
      
      const result = await biometricService.promptBiometricLogin();
      
      if (result.success) {
        console.log('✅ Biometric authentication successful, retrieving token...');
        
        // ✅ AMBIL TOKEN DARI KEYCHAIN
        const tokenResult = await ApiKeyManager.getUserToken();
        
        if (tokenResult.success && tokenResult.token) {
          console.log('✅ Token retrieved from Keychain, auto-login...');
          
          // Trigger auth data reload untuk auto-login
          await loadAuthData();
          
          Alert.alert(
            'Login Berhasil! 🎉', 
            `Selamat datang kembali! Autentikasi ${result.biometryType} berhasil.`,
            [{ text: 'OK' }]
          );
          
          navigation.goBack();
        } else {
          Alert.alert(
            'Token Tidak Ditemukan',
            'Silakan login manual terlebih dahulu untuk menyimpan token.',
            [{ text: 'Mengerti' }]
          );
        }
      } else {
        // Handle berbagai jenis error biometric
        if (result.errorCode === 'NOT_ENROLLED') {
          Alert.alert(
            'Biometric Belum Diatur',
            result.error || 'Silakan atur biometric di pengaturan perangkat terlebih dahulu.',
            [
              { text: 'Settings', onPress: () => {} }, // Buka settings device
              { text: 'Login Manual', style: 'default' }
            ]
          );
        } else if (result.errorCode === 'LOCKOUT') {
          // Handle lockout scenario
          await biometricService.handleBiometricLockout();
          navigation.navigate('Login' as any); // Force reload login screen
        } else if (result.errorCode === 'USER_CANCEL') {
          // User membatalkan login biometric - tidak perlu alert
          console.log('User cancelled biometric login');
        } else {
          Alert.alert('Autentikasi Gagal', result.error || 'Biometric authentication failed');
        }
      }
    } catch (error: any) {
      console.error('❌ Biometric login error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login biometric');
    } finally {
      setIsBiometricLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
  };

  // Tampilkan icon biometric berdasarkan tipe
  const getBiometricIcon = () => {
    if (biometryType === 'FaceID') return '👁️';
    if (biometryType === 'TouchID') return '👆';
    return '🔐';
  };

  // Tampilkan teks biometric berdasarkan tipe
  const getBiometricText = () => {
    if (biometryType === 'FaceID') return 'Pindai Wajah';
    if (biometryType === 'TouchID') return 'Tempelkan Jari';
    return 'Login Cepat';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome6 name="arrow-left" size={20} color={colors.textOnPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <TouchableOpacity onPress={clearForm}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome6 name="circle-user" size={50} color={colors.textOnPrimary} />
            </View>
          </View>

          <Text style={styles.loginTitle}>Login to Your Account</Text>
          <Text style={styles.loginSubtitle}>
            Access all Shopping App features
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              autoComplete="username"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textLight}
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* ✅ TOMBOL LOGIN CEPAT DENGAN BIOMETRIC - VERSI DIPERBAIKI */}
          {biometricAvailable && (
            <TouchableOpacity
              style={[
                styles.biometricButton,
                (isBiometricLoading || isLoading) && styles.biometricButtonDisabled
              ]}
              onPress={handleBiometricLogin}
              disabled={isBiometricLoading || isLoading}
            >
              <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text>
              <Text style={styles.biometricButtonText}>
                {isBiometricLoading ? 'Memproses...' : getBiometricText()}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Login</Text>
            
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={fillDemoAccount}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>🚀 Use Demo Account</Text>
            </TouchableOpacity>

            {/* Info ketersediaan biometric */}
            {!biometricAvailable && (
              <View style={styles.biometricInfo}>
                <Text style={styles.biometricInfoText}>
                  ⓘ Login biometric tidak tersedia di perangkat ini
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  clearText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginCard: {
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles untuk tombol biometric
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  biometricButtonDisabled: {
    opacity: 0.6,
  },
  biometricIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  biometricButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  demoButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  biometricInfo: {
    backgroundColor: colors.textLight + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  biometricInfoText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});