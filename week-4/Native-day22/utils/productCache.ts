import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../navigation/types';

const CACHE_PREFIX = '@product_detail:';
const TTL_30_MINUTES = 30 * 60 * 1000;

interface CacheData {
  value: Product;
  ttl: number;
  cachedAt: number;
}

class ProductCache {
  private static getCacheKey(productId: string): string {
    return `${CACHE_PREFIX}${productId}`;
  }

  static async set(productId: string, product: Product, ttl: number = TTL_30_MINUTES): Promise<void> {
    try {
      const cacheData: CacheData = {
        value: product,
        ttl: Date.now() + ttl,
        cachedAt: Date.now()
      };

      await AsyncStorage.setItem(
        this.getCacheKey(productId),
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.error(`Failed to save product cache ${productId}:`, error);
      throw error;
    }
  }

  static async get(productId: string): Promise<Product | null> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(productId));
      
      if (!cached) {
        return null;
      }

      const cacheData: CacheData = JSON.parse(cached);
      
      if (Date.now() > cacheData.ttl) {
        await this.remove(productId);
        return null;
      }

      return cacheData.value;
    } catch (error) {
      console.error(`Failed to get product cache ${productId}:`, error);
      return null;
    }
  }

  static async remove(productId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getCacheKey(productId));
    } catch (error) {
      console.error(`Failed to remove product cache ${productId}:`, error);
    }
  }

  static async clearAllProductCaches(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const productCacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      if (productCacheKeys.length > 0) {
        await AsyncStorage.multiRemove(productCacheKeys);
        console.log(`✅ Cleared ${productCacheKeys.length} product caches during logout`);
      } else {
        console.log('ℹ️ No product caches found to clear');
      }
    } catch (error) {
      console.error('Failed to clear all product caches:', error);
      throw error;
    }
  }

  static async getCacheAge(productId: string): Promise<number | null> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(productId));
      
      if (!cached) {
        return null;
      }

      const cacheData: CacheData = JSON.parse(cached);
      return Date.now() - cacheData.cachedAt;
    } catch (error) {
      console.error(`Failed to get cache age for ${productId}:`, error);
      return null;
    }
  }

  static async isValid(productId: string): Promise<boolean> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(productId));
      
      if (!cached) {
        return false;
      }

      const cacheData: CacheData = JSON.parse(cached);
      return Date.now() <= cacheData.ttl;
    } catch (error) {
      console.error(`Failed to validate cache for ${productId}:`, error);
      return false;
    }
  }

  static async cleanupExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const productCacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      let removedCount = 0;
      
      for (const key of productCacheKeys) {
        try {
          const cached = await AsyncStorage.getItem(key);
          if (cached) {
            const cacheData: CacheData = JSON.parse(cached);
            if (Date.now() > cacheData.ttl) {
              await AsyncStorage.removeItem(key);
              removedCount++;
            }
          }
        } catch (error) {
          console.error(`Error cleaning up cache ${key}:`, error);
        }
      }
      
      if (removedCount > 0) {
        console.log(`🧹 Cleaned up ${removedCount} expired product caches`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired product caches:', error);
    }
  }
}

export const clearAllProductCaches = ProductCache.clearAllProductCaches.bind(ProductCache);
export default ProductCache;