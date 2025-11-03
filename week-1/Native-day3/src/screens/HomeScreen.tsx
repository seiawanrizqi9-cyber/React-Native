import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import ProfileImage from '../components/ProfileImage';
import CustomButton from '../components/CustomButton';
import PopupModal from '../components/PopupModal';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <ProfileImage />

      <Text style={styles.title}>Halo, Rizqi 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Tulis sesuatu..."
        value={text}
        onChangeText={setText}
      />

      <View style={styles.switchRow}>
        <Text>Mode Aktif:</Text>
        <Switch value={isEnabled} onValueChange={setIsEnabled} />
      </View>

      <CustomButton title="Tampilkan Pesan" onPress={() => setShowModal(true)} />

      <PopupModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
});

export default HomeScreen;
