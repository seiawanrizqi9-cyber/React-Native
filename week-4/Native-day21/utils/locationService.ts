import { Alert } from 'react-native';
import PermissionService from './permissionService';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationError {
  code: number;
  message: string;
  PERMISSION_DENIED?: number;
  POSITION_UNAVAILABLE?: number;
  TIMEOUT?: number;
}

class LocationService {
  private watchId: number | null = null;

  // ✅ TAHAP 1: Request location permission dengan rationale
  async requestLocationPermission(): Promise<boolean> {
    try {
      console.log('📍 Requesting location permission...');
      const granted = await PermissionService.requestLocationPermission();
      
      if (granted) {
        console.log('✅ Location permission granted');
        return true;
      } else {
        console.log('❌ Location permission denied');
        PermissionService.showPermissionDeniedAlert('lokasi');
        return false;
      }
    } catch (error) {
      console.error('📍 Location permission error:', error);
      return false;
    }
  }

  // Check if location permission is granted
  async checkLocationPermission(): Promise<boolean> {
    try {
      const permissions = await PermissionService.checkAllPermissions();
      return permissions.location;
    } catch (error) {
      console.error('📍 Check location permission error:', error);
      return false;
    }
  }

  // ✅ TAHAP 2: Optimasi Baterai - One-Time Fetch dengan timeout dan cache
  async getCurrentLocationWithOptimization(): Promise<Location | null> {
    try {
      // Check permission first
      const hasPermission = await this.checkLocationPermission();
      if (!hasPermission) {
        const permissionGranted = await this.requestLocationPermission();
        if (!permissionGranted) {
          throw new Error('Location permission denied');
        }
      }

      console.log('📍 Getting current location with optimization...');

      return new Promise((resolve, reject) => {
        const geolocation = require('@react-native-community/geolocation');
        
        // ✅ Konfigurasi optimasi baterai:
        const options = {
          enableHighAccuracy: true,    // Akurasi tinggi untuk hasil tepat
          timeout: 10000,              // Timeout 10 detik
          maximumAge: 60000            // Gunakan cache jika umur lokasi < 1 menit
        };

        geolocation.getCurrentPosition(
          // Success callback
          (position: any) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            
            console.log('📍 Location fetched successfully:', location);
            resolve(location);
          },
          // Error callback
          (error: LocationError) => {
            console.error('📍 Location error:', error);
            
            // ✅ Handle timeout error (Code 3)
            if (error.code === error.TIMEOUT || error.code === 3) {
              Alert.alert(
                'GPS Timeout',
                'Periksa koneksi GPS Anda. Pastikan GPS aktif dan memiliki sinyal yang baik.',
                [{ text: 'OK', style: 'default' }]
              );
              reject(new Error('GPS timeout - Please check your GPS connection'));
            } 
            // Handle permission denied
            else if (error.code === error.PERMISSION_DENIED || error.code === 1) {
              reject(new Error('Location permission denied'));
            }
            // Handle position unavailable
            else if (error.code === error.POSITION_UNAVAILABLE || error.code === 2) {
              reject(new Error('Location service unavailable'));
            }
            // Other errors
            else {
              reject(new Error(error.message || 'Failed to get location'));
            }
          },
          options
        );
      });

    } catch (error: any) {
      console.error('📍 Get current location error:', error);
      throw error;
    }
  }

  // ✅ TAHAP 3: Live Tracking untuk Kurir dengan Cleanup
  startLiveTracking(
    onLocationUpdate: (location: Location) => void,
    onError?: (error: string) => void,
    distanceFilter: number = 20 // Update setiap 20 meter
  ): number | null {
    try {
      console.log('🚚 Starting live tracking for courier navigation...');

      const geolocation = require('@react-native-community/geolocation');
      
      // Konfigurasi live tracking
      const options = {
        enableHighAccuracy: true,
        distanceFilter: distanceFilter, // Update setiap 20 meter
        timeout: 15000,
        maximumAge: 0 // Selalu dapatkan posisi terbaru untuk live tracking
      };

      this.watchId = geolocation.watchPosition(
        (position: any) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          console.log('📍 Live tracking update:', {
            lat: location.latitude,
            lng: location.longitude,
            accuracy: location.accuracy,
            distance: `${distanceFilter}m filter`
          });
          
          onLocationUpdate(location);
        },
        (error: LocationError) => {
          console.error('📍 Live tracking error:', error);
          
          let errorMessage = 'Live tracking failed';
          if (error.code === error.PERMISSION_DENIED || error.code === 1) {
            errorMessage = 'Location permission denied for live tracking';
          } else if (error.code === error.POSITION_UNAVAILABLE || error.code === 2) {
            errorMessage = 'Location service unavailable';
          } else if (error.code === error.TIMEOUT || error.code === 3) {
            errorMessage = 'GPS timeout during live tracking';
          }
          
          if (onError) {
            onError(errorMessage);
          }
        },
        options
      );

      console.log(`✅ Live tracking started with watchId: ${this.watchId}`);
      return this.watchId;

    } catch (error: any) {
      console.error('❌ Failed to start live tracking:', error);
      if (onError) {
        onError(error.message || 'Failed to start live tracking');
      }
      return null;
    }
  }

  // ✅ TAHAP 3: Stop live tracking dengan cleanup
  stopLiveTracking(watchId?: number): void {
    try {
      const geolocation = require('@react-native-community/geolocation');
      
      const idToStop = watchId || this.watchId;
      
      if (idToStop) {
        geolocation.clearWatch(idToStop);
        console.log(`🛑 Live tracking stopped for watchId: ${idToStop}`);
        
        if (idToStop === this.watchId) {
          this.watchId = null;
        }
      } else {
        console.log('ℹ️ No active live tracking to stop');
      }
    } catch (error) {
      console.error('❌ Error stopping live tracking:', error);
    }
  }

  // ✅ TAHAP 4: Get location untuk analitik dengan optimasi maximumAge
  async getLocationForAnalytics(userId?: string): Promise<boolean> {
    try {
      console.log('📊 Getting location for analytics...');
      
      const location = await this.getCurrentLocationWithOptimization();
      
      if (location) {
        // Simulasi kirim data ke server
        console.log('📍 Analytics location:', {
          userId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date().toISOString()
        });
        
        // Simulate API call to server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ Analytics data sent to server');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Analytics location error:', error);
      return false;
    }
  }

  // ✅ TAHAP 4: Periodic analytics dengan optimasi hemat data
  startPeriodicAnalytics(
    userId?: string, 
    interval: number = 300000 // 5 menit default
  ): NodeJS.Timeout {
    console.log(`📊 Starting periodic analytics every ${interval/1000}s`);
    
    const intervalId = setInterval(async () => {
      try {
        // Gunakan maximumAge: 120000 (2 menit) untuk hemat data & baterai
        // Ini mengurangi beban server dengan tidak mengambil data GPS baru 
        // jika data lokasi masih fresh (< 2 menit)
        const location = await this.getCurrentLocationWithOptimization();
        
        if (location) {
          console.log('📊 Periodic analytics - Location sent:', {
            userId,
            lat: location.latitude,
            lng: location.longitude,
            accuracy: location.accuracy
          });
          
          // Simulasi kirim ke server analytics
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error('Periodic analytics error:', error);
      }
    }, interval);
    
    return intervalId;
  }

  // ✅ TAHAP 4: Stop periodic analytics
  stopPeriodicAnalytics(intervalId: NodeJS.Timeout): void {
    if (intervalId) {
      clearInterval(intervalId);
      console.log('🛑 Periodic analytics stopped');
    }
  }

  // ✅ TAHAP 4: Get location untuk shipping calculation
  async getLocationForShipping(): Promise<Location | null> {
    try {
      console.log('🚚 Getting location for shipping calculation...');
      
      // Gunakan maximumAge: 60000 (1 menit) untuk shipping
      // Karena ongkir perlu data yang cukup akurat tapi tetap hemat baterai
      const location = await this.getCurrentLocationWithOptimization();
      
      if (location) {
        console.log('✅ Shipping location obtained:', {
          lat: location.latitude,
          lng: location.longitude,
          accuracy: location.accuracy
        });
      }
      
      return location;
    } catch (error: any) {
      console.error('❌ Failed to get shipping location:', error);
      
      if (error.message.includes('GPS timeout')) {
        Alert.alert(
          'Gagal Mendapatkan Lokasi',
          'Tidak dapat menentukan lokasi Anda. Periksa koneksi GPS dan coba lagi.',
          [{ text: 'OK', style: 'default' }]
        );
      }
      
      return null;
    }
  }

  // ✅ TAHAP 3: Cleanup semua tracking
  cleanup(): void {
    this.stopLiveTracking();
    console.log('🧹 Location service cleanup completed');
  }
}

export const locationService = new LocationService();
export default locationService;