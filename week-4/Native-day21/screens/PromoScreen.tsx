import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../color/colors';
import { geofencingService } from '../utils/geofencingService';
import { locationService } from '../utils/locationService';

const PromoScreen: React.FC = () => {
  const [isGeofencingActive, setIsGeofencingActive] = useState(false);
  const [distanceToStore, setDistanceToStore] = useState<number | null>(null);
  const [_userLocation, setUserLocation] = useState<any>(null); // ✅ FIX: Tambahkan underscore

  // Start geofencing monitoring
  const startGeofencing = async () => {
    try {
      // Check location permission first
      const hasPermission = await locationService.checkLocationPermission();
      if (!hasPermission) {
        const granted = await locationService.requestLocationPermission();
        if (!granted) {
          Alert.alert('Izin Diperlukan', 'Aktifkan izin lokasi untuk fitur promo radius.');
          return;
        }
      }

      geofencingService.startPromoGeofencing();
      setIsGeofencingActive(true);
      
      Alert.alert(
        'Promo Monitoring Aktif',
        'Sistem akan memberi notifikasi ketika Anda berada dalam radius 100m dari toko.',
        [{ text: 'Mengerti', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to start geofencing:', error);
      Alert.alert('Error', 'Gagal memulai monitoring promo.');
    }
  };

  // Stop geofencing monitoring
  const stopGeofencing = () => {
    geofencingService.stopPromoGeofencing();
    setIsGeofencingActive(false);
    setDistanceToStore(null);
  };

  // Check current distance manually
  const checkCurrentDistance = async () => {
    try {
      const location = await locationService.getCurrentLocationWithOptimization();
      if (location) {
        setUserLocation(location); // ✅ Tetap simpan untuk future use
        const result = geofencingService.checkPromoRadius(location);
        setDistanceToStore(result.distance || null);
        
        if (result.isWithinRadius) {
          Alert.alert(
            'Anda Dekat Toko!',
            `Jarak Anda: ${result.distance}m\nAnda dalam radius promo!`,
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.error('Failed to check distance:', error);
      Alert.alert('Error', 'Gagal mendapatkan lokasi.');
    }
  };

  // Get geofencing status on component mount
  useEffect(() => {
    const status = geofencingService.getGeofencingStatus();
    setIsGeofencingActive(status.isMonitoring);

    return () => {
      // Cleanup on unmount
      geofencingService.stopPromoGeofencing();
    };
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Promo Radius 🎯</Text>
        <Text style={styles.headerSubtitle}>
          Dapatkan notifikasi promo ketika mendekati toko
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Status Monitoring</Text>
        <View style={styles.statusIndicator}>
          <View 
            style={[
              styles.statusDot, 
              isGeofencingActive ? styles.statusActive : styles.statusInactive
            ]} 
          />
          <Text style={styles.statusText}>
            {isGeofencingActive ? 'MONITORING AKTIF' : 'MONITORING NON-AKTIF'}
          </Text>
        </View>
        
        {distanceToStore !== null && (
          <View style={styles.distanceInfo}>
            <Text style={styles.distanceLabel}>Jarak ke Toko:</Text>
            <Text style={styles.distanceValue}>{distanceToStore} meter</Text>
            <Text style={[
              styles.radiusStatus,
              distanceToStore <= 100 ? styles.withinRadius : styles.outsideRadius
            ]}>
              {distanceToStore <= 100 ? '🎉 DALAM RADIUS PROMO!' : '⏳ Di luar radius promo'}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {!isGeofencingActive ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGeofencing}
          >
            <Text style={styles.buttonText}>🎯 Mulai Monitoring Promo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopGeofencing}
          >
            <Text style={styles.buttonText}>🛑 Hentikan Monitoring</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkCurrentDistance}
        >
          <Text style={styles.checkButtonText}>📍 Cek Jarak Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Promo Information */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Info Promo Radius</Text>
        <Text style={styles.infoItem}>• Radius: 100 meter dari toko</Text>
        <Text style={styles.infoItem}>• Diskon: 20% semua produk</Text>
        <Text style={styles.infoItem}>• Monitoring: Setiap 50 meter pergerakan</Text>
        <Text style={styles.infoItem}>• Notifikasi: Otomatis ketika dalam radius</Text>
      </View>

      {/* Technical Info */}
      <View style={styles.techCard}>
        <Text style={styles.techTitle}>Cara Kerja:</Text>
        <Text style={styles.techText}>
          Sistem menggunakan GPS untuk memantau pergerakan Anda. 
          Setiap kali Anda bergerak 50 meter, sistem akan mengecek 
          jarak ke toko. Jika dalam radius 100m, notifikasi promo 
          akan muncul otomatis.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  statusCard: {
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
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusInactive: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  distanceInfo: {
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  distanceLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  radiusStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  withinRadius: {
    color: colors.success,
  },
  outsideRadius: {
    color: colors.textLight,
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  techCard: {
    backgroundColor: colors.primary + '10',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  techText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
});

export default PromoScreen;