import React from 'react';
import { biometricService } from './biometricService';

// Buat context terpisah agar bisa di-export
export const BiometricContext = React.createContext<{
  biometryType: string | null;
  biometricAvailable: boolean;
  checkBiometricAvailability: () => Promise<void>;
}>({
  biometryType: null,
  biometricAvailable: false,
  checkBiometricAvailability: async () => {},
});

export const useBiometric = () => {
  const context = React.useContext(BiometricContext);
  if (context === undefined) {
    throw new Error('useBiometric must be used within a BiometricProvider');
  }
  return context;
};

// Biometric Provider Component
export const BiometricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [biometryType, setBiometryType] = React.useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = React.useState(false);

  const checkBiometricAvailability = React.useCallback(async () => {
    try {
      const availability = await biometricService.checkBiometricAvailability();
      setBiometricAvailable(availability.available);
      setBiometryType(availability.biometryType || null);
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
      setBiometricAvailable(false);
      setBiometryType(null);
    }
  }, []);

  React.useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  const value = {
    biometryType,
    biometricAvailable,
    checkBiometricAvailability,
  };

  return React.createElement(
    BiometricContext.Provider,
    { value },
    children
  );
};