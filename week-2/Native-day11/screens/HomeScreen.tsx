import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../color/colors';
import {
  HomeTopTabParamList,
  Product,
  HomeStackParamList,
} from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

// Import tab screens
import PopularTab from './tabs/PopularTab';
import NewTab from './tabs/NewTab';
import DiscountTab from './tabs/DiscountTab';
import ElectronicsTab from './tabs/ElectronicsTab';
import ClothingTab from './tabs/ClothingTab';
import FoodTab from './tabs/FoodTab';
import AutomotiveTab from './tabs/AutomotiveTab';
import EntertainmentTab from './tabs/EntertainmentTab';
import BabyTab from './tabs/BabyTab';

const Tab = createMaterialTopTabNavigator<HomeTopTabParamList>();
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

// Data dummy produk
export const dummyProducts: { [key: string]: Product[] } = {
  popular: [
    {
      id: '1',
      nama: 'iPhone 14 Pro Max',
      harga: 18999000,
      stok: 15,
      deskripsi: 'Smartphone flagship Apple dengan Dynamic Island',
      gambar:
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      kategori: 'popular',
    },
    {
      id: '2',
      nama: 'MacBook Air M2',
      harga: 15999000,
      stok: 8,
      deskripsi: 'Laptop ultra tipis dengan chip M2, performa maksimal',
      gambar:
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
      kategori: 'popular',
    },
    {
      id: '3',
      nama: 'Samsung Galaxy S23',
      harga: 12999000,
      stok: 20,
      deskripsi: 'Android terbaik dengan kamera 200MP',
      gambar:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      kategori: 'popular',
    },
    {
      id: '4',
      nama: 'Nike Air Jordan 1',
      harga: 2499000,
      stok: 12,
      deskripsi: 'Sepatu basket iconic, limited edition',
      gambar:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      kategori: 'popular',
    },
    {
      id: '5',
      nama: 'Sony WH-1000XM5',
      harga: 4999000,
      stok: 25,
      deskripsi: 'Headphone noise cancelling terbaik di kelasnya',
      gambar:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      kategori: 'popular',
    },
  ],
  new: [
    {
      id: '6',
      nama: 'iPad Pro 2024',
      harga: 14999000,
      stok: 10,
      deskripsi: 'Tablet profesional dengan chip M3, layar Liquid Retina',
      gambar:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      kategori: 'new',
    },
    {
      id: '7',
      nama: 'Google Pixel 8 Pro',
      harga: 13999000,
      stok: 18,
      deskripsi: 'Smartphone Android dengan AI terintegrasi',
      gambar:
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
      kategori: 'new',
    },
    {
      id: '8',
      nama: 'Dyson V15 Detect',
      harga: 8999000,
      stok: 7,
      deskripsi: 'Vacuum cleaner dengan laser detection technology',
      gambar:
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      kategori: 'new',
    },
    {
      id: '9',
      nama: 'Apple Watch Series 9',
      harga: 6999000,
      stok: 30,
      deskripsi: 'Smartwatch dengan sensor kesehatan lengkap',
      gambar:
        'https://images.unsplash.com/photo-1579586337278-3f4364269b5a?w=400&h=300&fit=crop',
      kategori: 'new',
    },
    {
      id: '10',
      nama: 'PlayStation 5 Pro',
      harga: 11999000,
      stok: 5,
      deskripsi: 'Konsol gaming next-gen dengan ray tracing',
      gambar:
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      kategori: 'new',
    },
  ],
  discount: [
    {
      id: '11',
      nama: 'TV Samsung 55" 4K',
      harga: 7999000,
      stok: 6,
      deskripsi: 'Smart TV 4K UHD dengan Quantum Dot Technology',
      gambar:
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      kategori: 'discount',
      diskon: 25,
    },
    {
      id: '12',
      nama: 'Kulkas LG Side by Side',
      harga: 12999000,
      stok: 4,
      deskripsi: 'Kulkas hemat energi dengan dispenser air dan es',
      gambar:
        'https://images.unsplash.com/photo-1599620433053-ffc66ec2d7c2?w=400&h=300&fit=crop',
      kategori: 'discount',
      diskon: 30,
    },
    {
      id: '13',
      nama: 'AC Daikin 1/2 PK',
      harga: 3999000,
      stok: 15,
      deskripsi: 'AC inverter hemat listrik, teknologi flash streamer',
      gambar:
        'https://images.unsplash.com/photo-1562158085-d0e3f0789b0a?w=400&h=300&fit=crop',
      kategori: 'discount',
      diskon: 20,
    },
    {
      id: '14',
      nama: 'Mesin Cuci Sharp 8kg',
      harga: 2999000,
      stok: 12,
      deskripsi: 'Top loading dengan teknologi plasmacluster',
      gambar:
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      kategori: 'discount',
      diskon: 15,
    },
    {
      id: '15',
      nama: 'Microwave Panasonic',
      harga: 1499000,
      stok: 20,
      deskripsi: 'Microwave 25L dengan inverter technology',
      gambar:
        'https://images.unsplash.com/photo-1615789591457-74a573dd8d72?w=400&h=300&fit=crop',
      kategori: 'discount',
      diskon: 10,
    },
  ],
  electronics: [
    {
      id: '16',
      nama: 'Speaker JBL Charge 5',
      harga: 2999000,
      stok: 25,
      deskripsi: 'Bluetooth speaker waterproof dengan bass yang powerful',
      gambar:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
      kategori: 'electronics',
    },
    {
      id: '17',
      nama: 'Monitor Dell 27" 4K',
      harga: 4999000,
      stok: 8,
      deskripsi: 'Monitor gaming dengan refresh rate 144Hz',
      gambar:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
      kategori: 'electronics',
    },
  ],
  clothing: [
    {
      id: '18',
      nama: "Jaket Denim Levi's",
      harga: 899000,
      stok: 35,
      deskripsi: 'Jaket denim classic, bahan premium cotton',
      gambar:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
      kategori: 'clothing',
    },
    {
      id: '19',
      nama: 'Kemeja Linen Pria',
      harga: 459000,
      stok: 50,
      deskripsi: 'Kemeja linen casual, nyaman untuk sehari-hari',
      gambar:
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop',
      kategori: 'clothing',
    },
  ],
  food: [
    {
      id: '20',
      nama: 'Kopi Arabika Gayo',
      harga: 125000,
      stok: 100,
      deskripsi: 'Biji kopi specialty grade, aroma dan rasa kompleks',
      gambar:
        'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=300&fit=crop',
      kategori: 'food',
    },
    {
      id: '21',
      nama: 'Madu Hutan Asli',
      harga: 185000,
      stok: 45,
      deskripsi: 'Madu murni dari hutan Sumatera, 100% natural',
      gambar:
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
      kategori: 'food',
    },
  ],
  automotive: [
    {
      id: '22',
      nama: 'Ban Michelin Pilot Sport 4',
      harga: 2499000,
      stok: 16,
      deskripsi: 'Ban performa tinggi untuk mobil sport',
      gambar:
        'https://images.unsplash.com/photo-1603712610496-5362a2c6c0a1?w=400&h=300&fit=crop',
      kategori: 'automotive',
    },
    {
      id: '23',
      nama: 'Oli Mobil Mobil 1',
      harga: 289000,
      stok: 80,
      deskripsi: 'Oli synthetic full protection untuk mesin bensin',
      gambar:
        'https://images.unsplash.com/photo-1622483767072-8c6b2f56f1b5?w=400&h=300&fit=crop',
      kategori: 'automotive',
    },
  ],
  entertainment: [
    {
      id: '24',
      nama: 'Gitar Akustik Yamaha',
      harga: 1899000,
      stok: 9,
      deskripsi: 'Gitar akustik dengan suara yang jernih dan natural',
      gambar:
        'https://images.unsplash.com/photo-1525202019637-ec6c79d07363?w=400&h=300&fit=crop',
      kategori: 'entertainment',
    },
    {
      id: '25',
      nama: 'Drone DJI Mini 3',
      harga: 7999000,
      stok: 6,
      deskripsi: 'Drone compact dengan kamera 4K, mudah dibawa',
      gambar:
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
      kategori: 'entertainment',
    },
  ],
  baby: [
    {
      id: '26',
      nama: 'Stroller Premium',
      harga: 1899000,
      stok: 11,
      deskripsi: 'Kereta bayi dengan sistem suspensi yang nyaman',
      gambar:
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
      kategori: 'baby',
    },
    {
      id: '27',
      nama: 'Baby Monitor Digital',
      harga: 899000,
      stok: 18,
      deskripsi: 'Monitor bayi dengan night vision dan two-way audio',
      gambar:
        'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?w=400&h=300&fit=crop',
      kategori: 'baby',
    },
  ],
};

// PERBAIKI: Wrapper function dengan onProductPress
const createTabWrapper = (
  Component: React.ComponentType<{
    products: Product[];
    onProductPress?: (product: Product) => void;
  }>,
  products: Product[],
  onProductPress: (product: Product) => void,
) => {
  return () => (
    <Component products={products} onProductPress={onProductPress} />
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // SOAL 2: Handle navigation ke ProductDetail
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.nama,
    });
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.textOnPrimary,
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarActiveTintColor: colors.textOnPrimary,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            paddingHorizontal: 16, // ✅ KURANGI PADDING
            minHeight: 48, // ✅ TAMBAH MIN HEIGHT
          },
          lazy: true,
          lazyPreloadDistance: 0, // ✅ KURANGI PRELOAD
          swipeEnabled: true, // ✅ AKTIFKAN SWIPE
          animationEnabled: true, // ✅ AKTIFKAN ANIMASI
        }}
      >
        <Tab.Screen
          name="Popular"
          component={createTabWrapper(
            PopularTab,
            dummyProducts.popular,
            handleProductPress,
          )}
          options={{ title: 'Populer' }}
        />
        <Tab.Screen
          name="New"
          component={createTabWrapper(
            NewTab,
            dummyProducts.new,
            handleProductPress,
          )}
          options={{ title: 'Terbaru' }}
        />
        <Tab.Screen
          name="Discount"
          component={createTabWrapper(
            DiscountTab,
            dummyProducts.discount,
            handleProductPress,
          )}
          options={{ title: 'Diskon' }}
        />
        <Tab.Screen
          name="Electronics"
          component={createTabWrapper(
            ElectronicsTab,
            dummyProducts.electronics,
            handleProductPress,
          )}
          options={{ title: 'Elektronik' }}
        />
        <Tab.Screen
          name="Clothing"
          component={createTabWrapper(
            ClothingTab,
            dummyProducts.clothing,
            handleProductPress,
          )}
          options={{ title: 'Pakaian' }}
        />
        <Tab.Screen
          name="Food"
          component={createTabWrapper(
            FoodTab,
            dummyProducts.food,
            handleProductPress,
          )}
          options={{ title: 'Makanan' }}
        />
        <Tab.Screen
          name="Automotive"
          component={createTabWrapper(
            AutomotiveTab,
            dummyProducts.automotive,
            handleProductPress,
          )}
          options={{ title: 'Otomotif' }}
        />
        <Tab.Screen
          name="Entertainment"
          component={createTabWrapper(
            EntertainmentTab,
            dummyProducts.entertainment,
            handleProductPress,
          )}
          options={{ title: 'Hiburan' }}
        />
        <Tab.Screen
          name="Baby"
          component={createTabWrapper(
            BabyTab,
            dummyProducts.baby,
            handleProductPress,
          )}
          options={{ title: 'Bayi' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
