// HAPUS import yang tidak perlu, SIMPLIFIKASI types
export type RootDrawerParamList = {
  Home: undefined;
  About: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type HomeTopTabParamList = {
  Popular: undefined;
  New: undefined;
  Discount: undefined;
  Electronics: undefined;
  Clothing: undefined;
  Food: undefined;
  Automotive: undefined;
  Entertainment: undefined;
  Baby: undefined;
};

export interface Product {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  gambar: string;
  kategori: string;
  diskon?: number;
}