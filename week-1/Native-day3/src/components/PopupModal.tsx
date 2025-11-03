import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PopupModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.text}>Hai Rizqi, ini pesan dari Modal! 😄</Text>
          <Button title="Tutup" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: { fontSize: 16, marginBottom: 10 },
});

export default PopupModal;
