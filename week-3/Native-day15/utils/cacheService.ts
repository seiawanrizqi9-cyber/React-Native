import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cache_';
const TTL_30_MINUTES = 30 * 60 * 1000; // 30 menit dalam milliseconds

export interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class CacheService {
  private static instance: CacheService;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Simpan data ke cache dengan TTL
  async set<T>(key: string, data: T, ttl: number = TTL_30_MINUTES): Promise<void> {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };
      
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`Gagal menyimpan cache untuk key: ${key}`, error);
      throw error;
    }
  }

  // Ambil data dari cache, return null jika expired atau tidak ada
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      
      if (!cached) {
        return null;
      }

      const cacheData: CacheData<T> = JSON.parse(cached);
      
      // Cek apakah cache sudah expired
      if (Date.now() > cacheData.expiry) {
        console.log(`Cache expired untuk key: ${key}`);
        await this.remove(key); // Hapus cache yang expired
        return null;
      }

      console.log(`Cache HIT untuk key: ${key}, usia: ${Date.now() - cacheData.timestamp}ms`);
      return cacheData.data;
    } catch (error) {
      console.error(`Gagal mengambil cache untuk key: ${key}`, error);
      return null;
    }
  }

  // Hapus cache tertentu
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Gagal menghapus cache untuk key: ${key}`, error);
    }
  }

  // Hapus semua cache
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`Berhasil menghapus ${cacheKeys.length} cache`);
      }
    } catch (error) {
      console.error('Gagal menghapus cache', error);
    }
  }

  // Cek usia cache (dalam milliseconds)
  async getCacheAge(key: string): Promise<number | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      
      if (!cached) {
        return null;
      }

      const cacheData: CacheData<any> = JSON.parse(cached);
      return Date.now() - cacheData.timestamp;
    } catch (error) {
      console.error(`Gagal mendapatkan usia cache untuk key: ${key}`, error);
      return null;
    }
  }

  // Cek apakah cache masih valid
  async isValid(key: string): Promise<boolean> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      
      if (!cached) {
        return false;
      }

      const cacheData: CacheData<any> = JSON.parse(cached);
      return Date.now() <= cacheData.expiry;
    } catch (error) {
      console.error(`Gagal memvalidasi cache untuk key: ${key}`, error);
      return false;
    }
  }
}

export default CacheService.getInstance();