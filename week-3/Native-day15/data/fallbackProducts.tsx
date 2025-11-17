import { Product } from '../navigation/types';

export const getFallbackProduct = (productId?: string): Product => ({
  id: productId || 'fallback',
  nama: 'Produk Tidak Tersedia',
  harga: 0,
  stok: 0,
  deskripsi: 'Maaf, informasi produk ini sedang tidak dapat diakses. Silakan coba lagi beberapa saat lagi.',
  gambar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  kategori: 'unknown',
});