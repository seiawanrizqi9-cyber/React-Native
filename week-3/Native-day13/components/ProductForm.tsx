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
import { Product } from '../navigation/types';
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
  const [kategori, setKategori] = useState('popular');
  const [diskon, setDiskon] = useState('');

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
      gambar: gambar || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      kategori,
      diskon: diskon ? Number(diskon) : undefined,
    });

    // Reset form
    setNama('');
    setHarga('');
    setStok('1');
    setDeskripsi('');
    setGambar('');
    setKategori('popular');
    setDiskon('');
  };

  const handleClose = () => {
    onClose();
  };

  const categories = [
    { value: 'popular', label: 'Populer' },
    { value: 'new', label: 'Terbaru' },
    { value: 'discount', label: 'Diskon' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'clothing', label: 'Pakaian' },
    { value: 'food', label: 'Makanan' },
    { value: 'automotive', label: 'Otomotif' },
    { value: 'entertainment', label: 'Hiburan' },
    { value: 'baby', label: 'Perlengkapan Bayi' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Tambah Produk Baru</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
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

            <Text style={styles.label}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.categories}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryButton,
                      kategori === cat.value && styles.categoryButtonActive
                    ]}
                    onPress={() => setKategori(cat.value)}
                  >
                    <Text style={[
                      styles.categoryText,
                      kategori === cat.value && styles.categoryTextActive
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Harga *</Text>
                <TextInput
                  style={styles.input}
                  value={harga}
                  onChangeText={setHarga}
                  placeholder="250000"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />
              </View>
              
              <View style={styles.column}>
                <Text style={styles.label}>Diskon (%)</Text>
                <TextInput
                  style={styles.input}
                  value={diskon}
                  onChangeText={setDiskon}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            </View>

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
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scrollView: {
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
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
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: colors.background,
  },
  previewText: {
    fontSize: 12,
    color: colors.textLight,
  },
  categoryScroll: {
    marginHorizontal: -5,
  },
  categories: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginLeft: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});