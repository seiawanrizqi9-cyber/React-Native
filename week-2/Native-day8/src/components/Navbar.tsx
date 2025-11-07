import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../color/colors';

interface Props {
  onAddProduct: () => void;
}

export default function Navbar({ onAddProduct }: Props) {
  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🏪</Text>
        <Text style={styles.logoText}>Belanja Skuy</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onAddProduct}>
        <Text style={styles.buttonText}>Mulai Berjualan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});