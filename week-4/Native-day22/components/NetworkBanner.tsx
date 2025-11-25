import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../color/colors';
import { useNetwork } from '../context/NetworkContext';

const NetworkBanner: React.FC = () => {
  const { isOnline, showBanner } = useNetwork();

  if (isOnline || !showBanner) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        📶 Koneksi terputus. Menggunakan mode offline.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
  },
  bannerText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NetworkBanner;
