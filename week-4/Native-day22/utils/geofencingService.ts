import { Alert } from 'react-native';
import { locationService, Location } from './locationService';

export interface GeofenceResult {
  success: boolean;
  distance?: number;
  isWithinRadius?: boolean;
  message?: string;
}

class GeofencingService {
  private watchId: number | null = null;
  private storeLocation = {
    latitude: -6.2088,  // Contoh: Lokasi Toko Utama Jakarta
    longitude: 106.8456
  };
  private promoRadius = 100; // 100 meter
  private promoShown = false;

  // ✅ TAHAP 5: Hitung jarak antara dua titik koordinat (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance); // Dalam meter
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // ✅ TAHAP 5: Cek apakah user dalam radius promo
  checkPromoRadius(userLocation: Location): GeofenceResult {
    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      this.storeLocation.latitude,
      this.storeLocation.longitude
    );

    const isWithinRadius = distance <= this.promoRadius;

    console.log(`📍 Geofencing Check - Distance: ${distance}m, Within Radius: ${isWithinRadius}`);

    return {
      success: true,
      distance,
      isWithinRadius,
      message: isWithinRadius ? `Anda dalam radius ${this.promoRadius}m dari toko!` : `Jarak dari toko: ${distance}m`
    };
  }

  // ✅ TAHAP 5: Start geofencing monitoring dengan distanceFilter 50m
  startPromoGeofencing(): void {
    try {
      console.log('🎯 Starting promo geofencing monitoring...');

      this.watchId = locationService.startLiveTracking(
        (location: Location) => {
          // Callback ketika lokasi update setiap 50 meter
          const result = this.checkPromoRadius(location);
          
          if (result.isWithinRadius && !this.promoShown) {
            // ✅ TAHAP 5: Tampilkan alert promo dan matikan tracking
            this.showPromoAlert();
            this.stopPromoGeofencing();
          }
        },
        (error: string) => {
          console.error('🎯 Geofencing error:', error);
        },
        50 // distanceFilter: 50 meter
      );

      if (this.watchId) {
        console.log('✅ Promo geofencing started successfully');
      }
    } catch (error) {
      console.error('❌ Failed to start promo geofencing:', error);
    }
  }

  // ✅ TAHAP 5: Tampilkan alert promo
  private showPromoAlert(): void {
    this.promoShown = true;
    
    Alert.alert(
      '🎉 PROMO DEKAT TOKO!',
      `Anda berada dalam radius ${this.promoRadius}m dari Toko Utama!\n\n💎 Dapatkan diskon 20% untuk semua produk!\n🕒 Berlaku hari ini saja!`,
      [
        {
          text: 'Lihat Promo',
          onPress: () => {
            console.log('📱 User membuka promo details');
            // Navigasi ke halaman promo bisa ditambahkan di sini
          }
        },
        {
          text: 'Nanti',
          style: 'cancel',
          onPress: () => {
            console.log('📱 User menunda promo');
            this.resetPromoAlert(); // Reset agar bisa muncul lagi next time
          }
        }
      ],
      { cancelable: false }
    );
  }

  // ✅ TAHAP 5: Stop geofencing monitoring
  stopPromoGeofencing(): void {
    if (this.watchId) {
      locationService.stopLiveTracking(this.watchId);
      this.watchId = null;
      console.log('🛑 Promo geofencing stopped');
    }
  }

  // Reset status promo alert
  resetPromoAlert(): void {
    this.promoShown = false;
    console.log('🔄 Promo alert reset - ready for next trigger');
  }

  // Get current geofencing status
  getGeofencingStatus(): { isMonitoring: boolean; promoShown: boolean } {
    return {
      isMonitoring: this.watchId !== null,
      promoShown: this.promoShown
    };
  }

  // Set custom store location (jika perlu)
  setStoreLocation(latitude: number, longitude: number): void {
    this.storeLocation = { latitude, longitude };
    console.log(`🏪 Store location updated to: ${latitude}, ${longitude}`);
  }

  // Set custom promo radius (jika perlu)
  setPromoRadius(radius: number): void {
    this.promoRadius = radius;
    console.log(`🎯 Promo radius updated to: ${radius}m`);
  }

  // Cleanup
  cleanup(): void {
    this.stopPromoGeofencing();
    this.resetPromoAlert();
    console.log('🧹 Geofencing service cleanup completed');
  }
}

export const geofencingService = new GeofencingService();
export default geofencingService;