import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../color/colors';

interface UploadProgressProps {
  visible: boolean;
  currentFile?: number;
  totalFiles?: number;
  progress?: number;
  fileName?: string;
  overallProgress?: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  visible,
  currentFile = 1,
  totalFiles = 1,
  progress = 0,
  fileName = '',
  overallProgress = 0,
}) => {
  const isMultipleFiles = totalFiles > 1;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              📤 Uploading {isMultipleFiles ? 'Files' : 'File'}
            </Text>
            {isMultipleFiles && (
              <Text style={styles.subtitle}>
                File {currentFile} of {totalFiles}
              </Text>
            )}
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            {/* File-specific progress */}
            <View style={styles.progressInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {fileName || `File ${currentFile}`}
              </Text>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>

            {/* Overall progress for multiple files */}
            {isMultipleFiles && (
              <View style={styles.overallProgress}>
                <Text style={styles.overallText}>
                  Overall Progress: {overallProgress}%
                </Text>
                <View style={styles.overallBar}>
                  <View 
                    style={[
                      styles.overallFill, 
                      { width: `${overallProgress}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>

          {/* Loading Indicator */}
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {progress === 100 ? 'Processing...' : 'Uploading...'}
            </Text>
          </View>

          {/* Note */}
          <Text style={styles.note}>
            Jangan tutup aplikasi selama proses upload
          </Text>
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
    maxWidth: 320,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  overallProgress: {
    marginTop: 12,
  },
  overallText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  overallBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  loadingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  note: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UploadProgress;