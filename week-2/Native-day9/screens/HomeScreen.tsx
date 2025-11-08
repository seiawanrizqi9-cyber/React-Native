// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import { colors } from '../color/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sambutan */}
        <View style={styles.introSection}>
          <Text style={styles.title}>Selamat datang di Belanja Skuy!</Text>
          <Text style={styles.description}>
            Tempat belanja online paling santai tapi lengkap!{'\n'}
            Dari fashion, gadget, sampai kebutuhan harian — semua ada di sini dengan harga yang bersahabat dan promo yang nggak bikin dompet nangis 💸
          </Text>
          <Text style={styles.callToAction}>
            Yuk, jelajahi produk pilihan terbaik dan nikmati pengalaman belanja yang cepat, aman, dan pastinya anti ribet!
          </Text>
        </View>

        {/* Card Kelebihan */}
        <View style={styles.featuresTitleContainer}>
          <Text style={styles.featuresTitle}>Kenapa Belanja di Sini?</Text>
        </View>

        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureCardTitle}>Cepat & Praktis</Text>
            <Text style={styles.featureCardText}>
              Proses belanja hanya dalam hitungan menit, langsung dikirim!
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureCardTitle}>Harga Terjangkau</Text>
            <Text style={styles.featureCardText}>
              Produk berkualitas dengan harga ramah di kantong.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureCardTitle}>Aman & Terpercaya</Text>
            <Text style={styles.featureCardText}>
              Transaksi aman, seller terverifikasi, garansi uang kembali.
            </Text>
          </View>
        </View>

        {/* Slogan Penutup */}
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>
            "Belanja Skuy — Santai, Cepat, Hemat!"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  introSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  callToAction: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresTitleContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  featureCardText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  sloganContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 40,
  },
  slogan: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});