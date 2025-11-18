import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../color/colors';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Belanja Skuy 🛍️</Text>
        <Text style={styles.heroSubtitle}>
          Platform E-Commerce Terpercaya di Indonesia
        </Text>
      </View>

      {/* About Content */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang Kami</Text>
          <Text style={styles.sectionText}>
            Belanja Skuy hadir sebagai solusi belanja online terdepan yang 
            menghubungkan pembeli dan penjual dengan pengalaman yang mudah, 
            aman, dan menyenangkan. Didirikan pada tahun 2024, kami berkomitmen 
            untuk memberikan layanan terbaik kepada seluruh pelanggan.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visi Kami</Text>
          <Text style={styles.sectionText}>
            Menjadi platform e-commerce terbesar di Indonesia yang memberikan 
            nilai tambah bagi semua pihak melalui teknologi inovatif dan 
            layanan berkualitas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misi Kami</Text>
          <View style={styles.missionList}>
            <Text style={styles.missionItem}>• Memberikan pengalaman belanja terbaik</Text>
            <Text style={styles.missionItem}>• Menjaga keamanan transaksi</Text>
            <Text style={styles.missionItem}>• Menyediakan produk berkualitas</Text>
            <Text style={styles.missionItem}>• Mendukung UMKM lokal</Text>
            <Text style={styles.missionItem}>• Inovasi terus menerus</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>Pencapaian Kami</Text>
          <View style={styles.achievementGrid}>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementNumber}>50K+</Text>
              <Text style={styles.achievementText}>Produk Terdaftar</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementNumber}>10K+</Text>
              <Text style={styles.achievementText}>Penjual Aktif</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementNumber}>100K+</Text>
              <Text style={styles.achievementText}>Pelanggan</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementNumber}>99%</Text>
              <Text style={styles.achievementText}>Kepuasan</Text>
            </View>
          </View>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mengapa Belanja di Sini?</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureTitle}>Gratis Ongkir</Text>
              <Text style={styles.featureText}>
                Gratis pengiriman untuk order di atas Rp 100.000
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureTitle}>Aman & Terpercaya</Text>
              <Text style={styles.featureText}>
                Transaksi aman dengan sistem escrow
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureTitle}>Bantuan 24/7</Text>
              <Text style={styles.featureText}>
                Customer service siap membantu kapan saja
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>↩️</Text>
              <Text style={styles.featureTitle}>Garansi</Text>
              <Text style={styles.featureText}>
                Garansi uang kembali 30 hari
              </Text>
            </View>
          </View>
        </View>

        {/* Closing */}
        <View style={styles.closingSection}>
          <Text style={styles.closingText}>
            "Bergabunglah dengan komunitas Belanja Skuy dan rasakan pengalaman 
            belanja online yang berbeda - lebih mudah, lebih aman, dan lebih menyenangkan!"
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  missionList: {
    marginTop: 8,
  },
  missionItem: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },
  achievementSection: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: colors.primary + '15',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  achievementNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  closingSection: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 16,
    marginTop: 8,
  },
  closingText: {
    fontSize: 16,
    color: colors.textOnPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});