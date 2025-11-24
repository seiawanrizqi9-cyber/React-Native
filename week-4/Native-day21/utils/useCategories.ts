import { useState, useCallback, useEffect } from 'react';
import { useNetInfo } from './useNetInfo';
import CacheService from './cacheService';
import { dummyProducts, getAllProducts } from '../data/dummyProducts';
import { useRetry } from './useRetry'; // ✅ TAMBAH IMPORT

const CATEGORIES_CACHE_KEY = 'product_categories';

export interface Category {
  id: string;
  name: string;
  displayName: string;
  productCount: number;
  icon: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);
  const netInfo = useNetInfo();
  const { executeWithRetry, retryCount } = useRetry<Category[]>(); // ✅ TAMBAH RETRY HOOK

  const generateCategories = useCallback((): Category[] => {
    const allProducts = getAllProducts();
    
    const categoryMap = allProducts.reduce((acc, product) => {
      if (!acc[product.kategori]) {
        acc[product.kategori] = 0;
      }
      acc[product.kategori]++;
      return acc;
    }, {} as Record<string, number>);

    const categoryIcons: Record<string, string> = {
      popular: '🔥',
      new: '🆕',
      discount: '💰',
      electronics: '📱',
      clothing: '👕',
      food: '🍕',
      automotive: '🚗',
      entertainment: '🎮',
      baby: '👶'
    };

    const categoryNames: Record<string, string> = {
      popular: 'Populer',
      new: 'Terbaru',
      discount: 'Diskon',
      electronics: 'Elektronik',
      clothing: 'Pakaian',
      food: 'Makanan',
      automotive: 'Otomotif',
      entertainment: 'Hiburan',
      baby: 'Perlengkapan Bayi'
    };

    return Object.entries(categoryMap).map(([categoryId, count]) => ({
      id: categoryId,
      name: categoryId,
      displayName: categoryNames[categoryId] || categoryId,
      productCount: count,
      icon: categoryIcons[categoryId] || '📦'
    }));
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsUsingCache(false);

      // ✅ CEK CACHE PERTAMA
      const cachedCategories = await CacheService.get<Category[]>(CATEGORIES_CACHE_KEY);
      
      if (cachedCategories) {
        console.log('✅ Menggunakan cached categories');
        setCategories(cachedCategories);
        setIsUsingCache(true);
        setIsLoading(false);
        return;
      }

      if (!netInfo.isInternetReachable) {
        console.log('📶 Offline mode - generate categories dari dummy data');
        const generatedCategories = generateCategories();
        setCategories(generatedCategories);
        
        await CacheService.set(CATEGORIES_CACHE_KEY, generatedCategories);
        setIsLoading(false);
        return;
      }

      // ✅ GUNAKAN RETRY LOGIC UNTUK LOAD CATEGORIES
      console.log('🌐 Online mode - loading categories dengan retry logic');
      const result = await executeWithRetry(async () => {
        // Simulasi API call yang bisa fail
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const shouldFail = Math.random() < 0.2; // 20% failure rate untuk testing
            if (shouldFail) {
              reject(new Error('Categories API timeout'));
            } else {
              resolve(true);
            }
          }, 1500);
        });

        const generatedCategories = generateCategories();
        
        // Simpan ke cache setelah berhasil
        await CacheService.set(CATEGORIES_CACHE_KEY, generatedCategories);
        
        return generatedCategories;
      }, {
        maxRetries: 2,
        baseDelay: 1000
      });

      if (result) {
        setCategories(result);
      }

    } catch (loadError) {
      console.error('Gagal memuat categories:', loadError);
      setError('Gagal memuat kategori produk');
      
      // Fallback ke generated categories
      const fallbackCategories = generateCategories();
      setCategories(fallbackCategories);
    } finally {
      setIsLoading(false);
    }
  }, [netInfo.isInternetReachable, generateCategories, executeWithRetry]);

  const refreshCategories = useCallback(async () => {
    await CacheService.remove(CATEGORIES_CACHE_KEY);
    await loadCategories();
  }, [loadCategories]);

  const getProductsByCategory = useCallback(async (categoryId: string) => {
    const cacheKey = `products_${categoryId}`;
    
    const cachedProducts = await CacheService.get(cacheKey);
    if (cachedProducts) {
      console.log(`✅ Menggunakan cached products untuk kategori: ${categoryId}`);
      return cachedProducts;
    }

    const products = dummyProducts[categoryId] || [];
    
    await CacheService.set(cacheKey, products);
    
    return products;
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const cacheAge = await CacheService.getCacheAge(CATEGORIES_CACHE_KEY);
      if (cacheAge && cacheAge > 25 * 60 * 1000) {
        console.log('🔄 Auto-refresh categories cache');
        await refreshCategories();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshCategories]);

  return {
    categories,
    isLoading,
    error,
    isUsingCache,
    retryCount, // ✅ EXPORT RETRY COUNT
    refreshCategories,
    getProductsByCategory,
    loadCategories
  };
};