import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

type LoginScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Login'>;

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();

  // Dummy data untuk login - sederhana seperti sebelumnya
  const dummyAccounts = [
    {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe'
    }
  ];

  const handleLogin = async () => {
    if (!username && !email) {
      Alert.alert('Error', 'Username atau Email harus diisi');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Password harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      // Simulasi proses login dengan dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cek credentials dengan dummy data
      const validAccount = dummyAccounts.find(account => 
        (account.username === username || account.email === email) && 
        account.password === password
      );

      if (validAccount) {
        // Simulasi token response
        const mockToken = 'dummy_token_' + Date.now();
        
        console.log('🔐 Login Success - Token:', mockToken);
        
        // Simpan user data
        const userData = {
          name: validAccount.name,
          email: validAccount.email,
          phone: '08123456789',
          address: 'Jl. Contoh Alamat No. 123',
        };

        await login(userData);
        
        Alert.alert('Sukses', `Login berhasil! 🎉\nSelamat datang, ${userData.name}`);
        
        // Kembali ke ProfileScreen
        navigation.goBack();
      } else {
        throw new Error('Username/Email atau password salah');
      }
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = () => {
    setUsername('johndoe');
    setEmail('john@example.com');
    setPassword('password123');
    Alert.alert('Akun Demo', 'Form telah diisi dengan akun demo!');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header dengan back button */}
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

          <Text style={styles.loginTitle}>Masuk ke Akun Anda</Text>
          <Text style={styles.loginSubtitle}>
            Akses semua fitur Belanja Skuy
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            autoComplete="username"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textLight}
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={useDemoAccount}>
            <Text style={styles.demoButtonText}>🚀 Pakai Akun Demo</Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoTitle}>Akun Demo:</Text>
            <Text style={styles.demoInfoText}>Username: johndoe</Text>
            <Text style={styles.demoInfoText}>Email: john@example.com</Text>
            <Text style={styles.demoInfoText}>Password: password123</Text>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
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
  demoButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  demoButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  demoInfoText: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 2,
  },
});