import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../color/colors';
import ProductForm from '../components/ProductForm';
import { Product } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';
import ProductImagePicker from '../components/ProductImagePicker';

type DashboardScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const [showProductForm, setShowProductForm] = useState(false);
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  // Data dummy untuk dashboard
  const dashboardData = {
    weeklyRevenue: 12500000,
    monthlyRevenue: 48500000,
    totalOrders: 156,
    completedOrders: 142,
    progress: 75,
    topProducts: [
      { name: 'iPhone 14', sales: 45 },
      { name: 'MacBook Air', sales: 32 },
      { name: 'Samsung S23', sales: 28 },
    ]
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    Alert.alert('Sukses', `Produk "${product.nama}" berhasil ditambahkan!`);
    setShowProductForm(false);
  };

  const handleFiturHiasan = () => {
    Alert.alert('Info', 'Fitur ini sedang dalam pengembangan 🚧');
  };

  // ✅ PERBAIKI: Navigate ke Settings di Drawer
  const handleOpenSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard 📊</Text>
        <Text style={styles.headerSubtitle}>Ringkasan performa toko Anda</Text>
      </View>

      {/* Revenue Cards */}
      <View style={styles.revenueSection}>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Pendapatan Mingguan</Text>
          <Text style={styles.revenueValue}>
            Rp {dashboardData.weeklyRevenue.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.revenueTrend}>↑ 12% dari minggu lalu</Text>
        </View>
        
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Pendapatan Bulanan</Text>
          <Text style={styles.revenueValue}>
            Rp {dashboardData.monthlyRevenue.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.revenueTrend}>↑ 8% dari bulan lalu</Text>
        </View>
      </View>

      {/* Orders Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleCenter}>Ringkasan Pesanan</Text>
        <View style={styles.ordersGrid}>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{dashboardData.totalOrders}</Text>
            <Text style={styles.orderLabel}>Total Pesanan</Text>
          </View>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{dashboardData.completedOrders}</Text>
            <Text style={styles.orderLabel}>Selesai</Text>
          </View>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>
              {dashboardData.totalOrders - dashboardData.completedOrders}
            </Text>
            <Text style={styles.orderLabel}>Dalam Proses</Text>
          </View>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{dashboardData.progress}%</Text>
            <Text style={styles.orderLabel}>Progress</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleCenter}>Progress Mingguan</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${dashboardData.progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {dashboardData.progress}% Tercapai
          </Text>
        </View>
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleCenter}>Produk Terlaris</Text>
        {dashboardData.topProducts.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSales}>{product.sales} terjual</Text>
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Product Image Picker Section */}
      <View style={styles.imagePickerSection}>
        <Text style={styles.sectionTitle}>Upload Foto Produk</Text>
        <Text style={styles.sectionSubtitle}>
          Pilih maksimal 5 foto untuk produk baru Anda
        </Text>
        
        <ProductImagePicker
          onImagesChange={(images) => {
            console.log('Selected product images:', images.length);
          }}
          maxImages={5}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setShowProductForm(true)}
        >
          <Text style={styles.primaryButtonText}>➕ Tambah Barang</Text>
        </TouchableOpacity>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleFiturHiasan}
          >
            <Text style={styles.featureIcon}>📈</Text>
            <Text style={styles.featureText}>Analitik Lanjutan</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleFiturHiasan}
          >
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>Manajemen Staf</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleFiturHiasan}
          >
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureText}>Laporan Detail</Text>
          </TouchableOpacity>

          {/* ✅ BUTTON PENGATURAN TOKO YANG BARU */}
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleOpenSettings}
          >
            <Text style={styles.featureIcon}>⚙️</Text>
            <Text style={styles.featureText}>Pengaturan Toko</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Form Modal */}
      <ProductForm
        visible={showProductForm}
        onSubmit={handleAddProduct}
        onClose={() => setShowProductForm(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  revenueSection: {
    padding: 16,
    gap: 12,
  },
  revenueCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  revenueTrend: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitleCenter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  ordersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  orderCard: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  orderLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: colors.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  productSales: {
    fontSize: 12,
    color: colors.textLight,
  },
  rankBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 10,
    color: colors.textOnPrimary,
    fontWeight: 'bold',
  },
  imagePickerSection: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  actionSection: {
    padding: 16,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureButton: {
    width: '48%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});