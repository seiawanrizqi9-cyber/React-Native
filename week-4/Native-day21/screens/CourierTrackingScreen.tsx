import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { colors } from '../color/colors';
import { locationService, Location } from '../utils/locationService';

const CourierTrackingScreen: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ TAHAP 3: Live Tracking dengan Cleanup
  const startCourierTracking = async () => {
    try {
      setIsLoading(true);
      
      // Check permission first
      const hasPermission = await locationService.checkLocationPermission();
      if (!hasPermission) {
        const granted = await locationService.requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Izin Diperlukan',
            'Izin lokasi diperlukan untuk fitur navigasi kurir.',
            [{ text: 'OK', style: 'default' }]
          );
          setIsLoading(false);
          return;
        }
      }

      console.log('🚀 Starting courier live tracking...');
      
      const newWatchId = locationService.startLiveTracking(
        (location) => {
          // Callback ketika lokasi update
          setCurrentLocation(location);
          setTrackingHistory(prev => [...prev.slice(-9), location]); // Simpan 10 history terakhir
          console.log(`📍 Kurir bergerak: ${location.latitude}, ${location.longitude}`);
        },
        (error) => {
          // Callback ketika error
          Alert.alert('Tracking Error', error);
          stopCourierTracking();
        },
        20 // distanceFilter: 20 meter
      );

      if (newWatchId) {
        setWatchId(newWatchId);
        setIsTracking(true);
        Alert.alert(
          'Live Tracking Dimulai',
          'Posisi kurir akan diupdate setiap 20 meter.',
          [{ text: 'OK', style: 'default' }]
        );
      }

    } catch (error: any) {
      Alert.alert('Error', 'Gagal memulai live tracking: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ TAHAP 3: Stop tracking dengan cleanup
  const stopCourierTracking = () => {
    if (watchId) {
      locationService.stopLiveTracking(watchId);
      setWatchId(null);
      setIsTracking(false);
      console.log('🛑 Courier tracking stopped');
      
      Alert.alert(
        'Tracking Dihentikan',
        'Live tracking kurir telah dihentikan.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // ✅ TAHAP 3: Cleanup saat komponen unmount
  useEffect(() => {
    return () => {
      // Cleanup function - dipanggil saat komponen di-unmount
      if (watchId) {
        console.log('🧹 Cleaning up live tracking on unmount');
        locationService.stopLiveTracking(watchId);
      }
    };
  }, [watchId]);

  const getCurrentPositionOnce = async () => {
    try {
      setIsLoading(true);
      const location = await locationService.getCurrentLocationWithOptimization();
      if (location) {
        setCurrentLocation(location);
        Alert.alert(
          'Posisi Saat Ini',
          `Lat: ${location.latitude.toFixed(6)}\nLng: ${location.longitude.toFixed(6)}`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigasi Kurir 🚚</Text>
        <Text style={styles.headerSubtitle}>
          Live tracking untuk monitoring pergerakan kurir
        </Text>
      </View>

      {/* Status Tracking */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Status Tracking</Text>
        <View style={styles.statusIndicator}>
          <View 
            style={[
              styles.statusDot, 
              isTracking ? styles.statusActive : styles.statusInactive
            ]} 
          />
          <Text style={styles.statusText}>
            {isTracking ? 'LIVE TRACKING AKTIF' : 'TRACKING NON-AKTIF'}
          </Text>
        </View>
        
        {currentLocation && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Posisi Terkini:</Text>
            <Text style={styles.locationText}>
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            {currentLocation.accuracy && (
              <Text style={styles.accuracyText}>
                Akurasi: ±{Math.round(currentLocation.accuracy)} meter
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.trackingButton, styles.startButton]}
            onPress={startCourierTracking}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>🚀 Mulai Live Tracking</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.trackingButton, styles.stopButton]}
            onPress={stopCourierTracking}
          >
            <Text style={styles.buttonText}>🛑 Hentikan Tracking</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={getCurrentPositionOnce}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>📍 Dapatkan Posisi Sekali</Text>
        </TouchableOpacity>
      </View>

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Pergerakan (10 Terakhir)</Text>
          {trackingHistory.slice().reverse().map((location, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {trackingHistory.length - index}. {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
              {location.timestamp && (
                <Text style={styles.historyTime}>
                  {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Information */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fitur Live Tracking:</Text>
        <Text style={styles.infoItem}>• Update otomatis setiap 20 meter</Text>
        <Text style={styles.infoItem}>• Akurasi tinggi dengan GPS</Text>
        <Text style={styles.infoItem}>• Auto-cleanup saat layar ditutup</Text>
        <Text style={styles.infoItem}>• Monitoring real-time pergerakan kurir</Text>
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
    marginBottom: 12,
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
  locationInfo: {
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  trackingButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  historyText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'monospace',
    flex: 1,
  },
  historyTime: {
    fontSize: 10,
    color: colors.textLight,
  },
  infoCard: {
    backgroundColor: colors.primary + '10',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
});

export default CourierTrackingScreen;