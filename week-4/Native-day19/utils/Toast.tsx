import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors } from '../color/colors';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  visible, 
  duration = 3000, 
  onHide 
}) => {
  // PERBAIKAN: Gunakan useMemo untuk prevent recreate pada setiap render
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <View style={styles.toast}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60, // Di bawah status bar
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    maxWidth: '80%',
  },
  toastText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;