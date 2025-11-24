import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../navigation/types';

const WISHLIST_IDS_KEY = '@wishlist_ids';
const WISHLIST_META_KEY = '@wishlist_meta';

interface WishlistMeta {
  count: number;
  updatedAt: string;
  version: string;
}

interface WishlistState {
  items: Product[];
  wishlistIds: string[];
  meta: WishlistMeta;
  isLoading: boolean;
  error: string | null;
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loadWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Hook untuk menggunakan wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WishlistState>({
    items: [],
    wishlistIds: [],
    meta: {
      count: 0,
      updatedAt: new Date().toISOString(),
      version: '1.0'
    },
    isLoading: true,
    error: null
  });

  // Load wishlist dari storage
  const loadWishlist = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load kedua key secara paralel
      const [idsData, metaData] = await Promise.all([
        AsyncStorage.getItem(WISHLIST_IDS_KEY),
        AsyncStorage.getItem(WISHLIST_META_KEY)
      ]);

      const wishlistIds = idsData ? JSON.parse(idsData) : [];
      const meta = metaData ? JSON.parse(metaData) : {
        count: 0,
        updatedAt: new Date().toISOString(),
        version: '1.0'
      };

      setState(prev => ({
        ...prev,
        wishlistIds,
        meta,
        isLoading: false
      }));

    } catch (error: any) {
      console.error('Gagal memuat wishlist:', error);
      setState(prev => ({
        ...prev,
        error: 'Gagal memuat wishlist',
        isLoading: false
      }));
    }
  }, []);

  // Simpan wishlist ke storage
  const saveWishlist = useCallback(async (wishlistIds: string[], meta: WishlistMeta) => {
    try {
      await AsyncStorage.multiSet([
        [WISHLIST_IDS_KEY, JSON.stringify(wishlistIds)],
        [WISHLIST_META_KEY, JSON.stringify(meta)]
      ]);
    } catch (error: any) {
      console.error('Gagal menyimpan wishlist:', error);
      throw error;
    }
  }, []);

  // Tambah produk ke wishlist
  const addToWishlist = useCallback(async (product: Product) => {
    try {
      setState(prev => {
        const newWishlistIds = [...prev.wishlistIds, product.id];
        const newMeta = {
          count: newWishlistIds.length,
          updatedAt: new Date().toISOString(),
          version: '1.0'
        };

        // Simpan ke storage
        saveWishlist(newWishlistIds, newMeta);

        return {
          ...prev,
          wishlistIds: newWishlistIds,
          meta: newMeta
        };
      });
    } catch (error: any) {
      console.error('Gagal menambah wishlist:', error);
      throw error;
    }
  }, [saveWishlist]);

  // Hapus produk dari wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      setState(prev => {
        const newWishlistIds = prev.wishlistIds.filter(id => id !== productId);
        const newMeta = {
          count: newWishlistIds.length,
          updatedAt: new Date().toISOString(),
          version: '1.0'
        };

        // Simpan ke storage
        saveWishlist(newWishlistIds, newMeta);

        return {
          ...prev,
          wishlistIds: newWishlistIds,
          meta: newMeta
        };
      });
    } catch (error: any) {
      console.error('Gagal menghapus wishlist:', error);
      throw error;
    }
  }, [saveWishlist]);

  // Toggle wishlist (add/remove)
  const toggleWishlist = useCallback(async (product: Product) => {
    const isCurrentlyInWishlist = state.wishlistIds.includes(product.id);
    
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }, [state.wishlistIds, addToWishlist, removeFromWishlist]);

  // Cek apakah produk ada di wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return state.wishlistIds.includes(productId);
  }, [state.wishlistIds]);

  // Kosongkan wishlist
  const clearWishlist = useCallback(async () => {
    try {
      const newMeta = {
        count: 0,
        updatedAt: new Date().toISOString(),
        version: '1.0'
      };

      await AsyncStorage.multiSet([
        [WISHLIST_IDS_KEY, JSON.stringify([])],
        [WISHLIST_META_KEY, JSON.stringify(newMeta)]
      ]);

      setState(prev => ({
        ...prev,
        wishlistIds: [],
        meta: newMeta
      }));
    } catch (error: any) {
      console.error('Gagal mengosongkan wishlist:', error);
      throw error;
    }
  }, []);

  // Load wishlist saat startup
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const contextValue: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlist
  };

  // Gunakan React.createElement untuk menghindari JSX di file .ts
  return React.createElement(
    WishlistContext.Provider,
    { value: contextValue },
    children
  );
};