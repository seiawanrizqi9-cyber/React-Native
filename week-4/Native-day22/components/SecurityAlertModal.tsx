import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../color/colors';

interface SecurityAlertModalProps {
  visible: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDeepLinkError?: boolean; // ✅ PROP BARU
  deepLinkUrl?: string; // ✅ PROP BARU
}

const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({
  visible,
  message = 'Keamanan perangkat diubah, mohon login ulang.',
  onConfirm,
  onCancel,
  isDeepLinkError = false, // ✅ DEFAULT VALUE
  deepLinkUrl, // ✅ PROP BARU
}) => {
  const handleConfirm = React.useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = React.useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Auto confirm setelah 5 detik jika user tidak merespon
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        handleConfirm();
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, handleConfirm]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header dengan icon warning */}
          <View style={styles.header}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.title}>
              {isDeepLinkError ? 'Deep Link Error' : 'Peringatan Keamanan'}
            </Text>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
            
            {/* ✅ TAMBAH: Deep Link Info */}
            {isDeepLinkError && deepLinkUrl && (
              <View style={styles.deepLinkInfo}>
                <Text style={styles.deepLinkUrl}>URL: {deepLinkUrl}</Text>
                <Text style={styles.deepLinkHelp}>
                  🔗 Pastikan aplikasi terinstall dan URL sesuai format
                </Text>
              </View>
            )}
            
            {!isDeepLinkError && (
              <Text style={styles.subMessage}>
                Ini mungkin terjadi karena:
                {'\n'}• Pengaturan keamanan perangkat berubah
                {'\n'}• Aplikasi diinstall ulang
                {'\n'}• Data keamanan terreset
              </Text>
            )}
          </View>

          {/* Auto redirect info */}
          <View style={styles.autoRedirectInfo}>
            <Text style={styles.autoRedirectText}>
              Akan diarahkan otomatis {isDeepLinkError ? 'ke beranda' : 'ke login'} dalam 5 detik...
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Nanti</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {isDeepLinkError ? 'Kembali ke Beranda' : 'Login Ulang'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  // ✅ TAMBAH: Styles untuk deep link info
  deepLinkInfo: {
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginTop: 12,
  },
  deepLinkUrl: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
    marginBottom: 4,
  },
  deepLinkHelp: {
    fontSize: 11,
    color: colors.warning,
    fontStyle: 'italic',
  },
  autoRedirectInfo: {
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: 20,
  },
  autoRedirectText: {
    fontSize: 12,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecurityAlertModal;