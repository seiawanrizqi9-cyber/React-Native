import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Product } from '../screens/HomeScreen';
import { colors } from '../color/colors';

interface Props {
  visible: boolean;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export default function ProductForm({ visible, onSubmit, onClose }: Props) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('1');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState('');

  const handleSubmit = () => {
    if (!nama || !harga) {
      Alert.alert('Error', 'Nama dan harga harus diisi');
      return;
    }

    if (isNaN(Number(harga))) {
      Alert.alert('Error', 'Harga harus berupa angka');
      return;
    }

    onSubmit({
      nama,
      harga: Number(harga),
      stok: Number(stok),
      deskripsi,
      gambar: gambar || null,
    });

    setNama('');
    setHarga('');
    setStok('1');
    setDeskripsi('');
    setGambar('');
  };

  const handleClose = () => {
    setNama('');
    setHarga('');
    setStok('1');
    setDeskripsi('');
    setGambar('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Tambah Produk Baru</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>URL Gambar</Text>
            <TextInput
              style={styles.input}
              value={gambar}
              onChangeText={setGambar}
              placeholder="https://example.com/gambar.jpg"
              placeholderTextColor={colors.textLight}
            />

            {gambar ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: gambar }} style={styles.previewImage} />
                <Text style={styles.previewText}>Preview Gambar</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Nama Produk *</Text>
            <TextInput
              style={styles.input}
              value={nama}
              onChangeText={setNama}
              placeholder="Masukkan nama produk"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.label}>Harga *</Text>
            <TextInput
              style={styles.input}
              value={harga}
              onChangeText={setHarga}
              placeholder="Contoh: 250000"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.label}>Stok</Text>
            <TextInput
              style={styles.input}
              value={stok}
              onChangeText={setStok}
              placeholder="1"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={deskripsi}
              onChangeText={setDeskripsi}
              placeholder="Deskripsi produk..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Simpan Produk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: colors.text,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imagePreview: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: colors.background,
  },
  previewText: {
    fontSize: 12,
    color: colors.textLight,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});