import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../navigation/types';

const CART_STORAGE_KEY = '@cart_items';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartLoading: boolean;
  cartError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const loadCartFromStorage = useCallback(async () => {
    try {
      setIsCartLoading(true);
      setCartError(null);
      
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Gagal memuat cart dari storage:', error);
      setCartError('Gagal memuat keranjang');
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  const saveCartToStorage = useCallback(async (newCartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartItems));
      setCartError(null);
    } catch (error: any) {
      console.error('Gagal menyimpan cart:', error);
      
      if (error?.name === 'QuotaExceededError' || error?.message?.includes('quota')) {
        setCartError('Penyimpanan penuh. Beberapa item mungkin tidak tersimpan.');
        
        if (newCartItems.length > 0) {
          const reducedCart = newCartItems.slice(-10);
          try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(reducedCart));
            setCartItems(reducedCart);
            setCartError('Penyimpanan penuh. Hanya 10 item terakhir yang disimpan.');
          } catch (fallbackError) {
            setCartError('Penyimpanan penuh. Data keranjang tidak dapat disimpan.');
          }
        }
      } else {
        setCartError('Gagal menyimpan keranjang');
      }
    }
  }, []);

  const mergeCartUpdate = useCallback(async (productId: string, quantity: number, operation: 'add' | 'update' | 'remove') => {
    try {
      const currentCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      let updatedCart: CartItem[] = currentCart ? JSON.parse(currentCart) : [];

      if (operation === 'add') {
        const existingItem = updatedCart.find(item => item.product.id === productId);
        if (existingItem) {
          updatedCart = updatedCart.map(item =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return false;
        }
      } else if (operation === 'update') {
        updatedCart = updatedCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      } else if (operation === 'remove') {
        updatedCart = updatedCart.filter(item => item.product.id !== productId);
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      return true;
    } catch (error) {
      console.error('Gagal merge update cart:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  const addToCart = useCallback(async (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      let newCart: CartItem[];
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        mergeCartUpdate(product.id, existingItem.quantity + 1, 'update');
      } else {
        newCart = [...prev, { product, quantity: 1 }];
        saveCartToStorage(newCart);
      }
      
      return newCart;
    });
  }, [mergeCartUpdate, saveCartToStorage]);

  const removeFromCart = useCallback(async (productId: string) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      saveCartToStorage(newCart);
      return newCart;
    });
    
    await mergeCartUpdate(productId, 0, 'remove');
  }, [saveCartToStorage, mergeCartUpdate]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => {
      const newCart = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newCart);
      return newCart;
    });
    
    await mergeCartUpdate(productId, quantity, 'update');
  }, [removeFromCart, saveCartToStorage, mergeCartUpdate]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      setCartError(null);
    } catch (error) {
      console.error('Gagal menghapus cart:', error);
      setCartError('Gagal mengosongkan keranjang');
    }
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product.diskon 
        ? item.product.harga * (1 - item.product.diskon / 100)
        : item.product.harga;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartLoading,
    cartError,
  };

  return React.createElement(
    CartContext.Provider,
    { value: contextValue },
    children
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};