import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../color/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@app_settings';

interface AppSettings {
  swipeDrawer: boolean;
  notifications: boolean;
  darkMode: boolean;
  biometricLogin: boolean;
  chatSounds: boolean;
  autoSync: boolean;
  analytics: boolean;
}

const defaultSettings: AppSettings = {
  swipeDrawer: true,
  notifications: true,
  darkMode: false,
  biometricLogin: false,
  chatSounds: true,
  autoSync: true,
  analytics: true,
};

const SettingItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isFunctional?: boolean;
}> = ({ icon, title, description, value, onValueChange, isFunctional = false }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingInfo}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>
          {title} {isFunctional && '🔧'}
        </Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={value ? colors.textOnPrimary : colors.textLight}
    />
  </View>
);

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings && isMounted) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Gagal load settings:', error);
      }
    };

    loadSettings();

    const intervalId = setInterval(loadSettings, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Gagal save settings:', error);
      Alert.alert('Error', 'Gagal menyimpan pengaturan');
      return false;
    }
  };

  const handleSettingChange = async (key: keyof AppSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    
    if (key === 'swipeDrawer') {
      const saved = await saveSettings(newSettings);
      if (saved) {
        console.log(`Swipe Drawer ${value ? 'DIHIDUPKAN' : 'DIMATIKAN'}`);
      }
    } else {
      Alert.alert(
        'Fitur Pajangan 🎨',
        `Fitur "${key}" masih dalam pengembangan!`,
        [{ text: 'Mengerti' }]
      );
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Pengaturan',
      'Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await saveSettings(defaultSettings);
            Alert.alert('Sukses', 'Pengaturan telah direset ke default');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan ⚙️</Text>
        <Text style={styles.headerSubtitle}>
          Swipe Drawer: {settings.swipeDrawer ? '🟢 AKTIF' : '🔴 NONAKTIF'}
        </Text>
        <Text style={styles.headerNote}>
          Perubahan berlaku real-time
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Umum</Text>
        
        <SettingItem
          icon="↔️"
          title="Swipe Drawer Gesture"
          description={`Swipe dari tepi ${settings.swipeDrawer ? 'AKTIF - Bisa swipe dari edge screen' : 'DIMATIKAN - Hanya bisa lewat menu'}`}
          value={settings.swipeDrawer}
          onValueChange={(value) => handleSettingChange('swipeDrawer', value)}
          isFunctional={true}
        />

        <SettingItem
          icon="🔔"
          title="Notifikasi"
          description="Terima notifikasi promo dan update"
          value={settings.notifications}
          onValueChange={(value) => handleSettingChange('notifications', value)}
        />

        <SettingItem
          icon="🔄"
          title="Auto Sync"
          description="Sinkronisasi data otomatis"
          value={settings.autoSync}
          onValueChange={(value) => handleSettingChange('autoSync', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privasi & Keamanan</Text>
        
        <SettingItem
          icon="👁️"
          title="Biometric Login"
          description="Gunakan sidik jari/wajah untuk login"
          value={settings.biometricLogin}
          onValueChange={(value) => handleSettingChange('biometricLogin', value)}
        />

        <SettingItem
          icon="📊"
          title="Analytics"
          description="Bantu kami meningkatkan aplikasi dengan data anonim"
          value={settings.analytics}
          onValueChange={(value) => handleSettingChange('analytics', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tampilan</Text>
        
        <SettingItem
          icon="🌙"
          title="Dark Mode"
          description="Tampilan gelap yang nyaman di mata"
          value={settings.darkMode}
          onValueChange={(value) => handleSettingChange('darkMode', value)}
        />

        <SettingItem
          icon="💬"
          title="Chat Sounds"
          description="Suara notifikasi chat"
          value={settings.chatSounds}
          onValueChange={(value) => handleSettingChange('chatSounds', value)}
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Info Aplikasi</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Versi</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2024.01.001</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Belanja Skuy Team</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
        <Text style={styles.resetButtonText}>🔄 Reset Semua Pengaturan</Text>
      </TouchableOpacity>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          💡 <Text style={styles.footerHighlight}>Hanya Swipe Drawer</Text> yang functional. 
          Fitur lainnya masih dalam pengembangan.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
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
    marginBottom: 4,
    fontWeight: '600',
  },
  headerNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  infoSection: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: colors.error + '15',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  resetButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  footerNote: {
    backgroundColor: colors.primary + '15',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  footerHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});