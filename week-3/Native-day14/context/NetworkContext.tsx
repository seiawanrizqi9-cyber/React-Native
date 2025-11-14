import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetInfo } from '../utils/useNetInfo';

interface NetworkContextType {
  isOnline: boolean;
  showBanner: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  showBanner: false,
});

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const netInfo = useNetInfo();
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const onlineStatus = netInfo.isInternetReachable ?? true;
    
    if (!onlineStatus) {
      // Koneksi terputus - tampilkan banner
      setIsOnline(false);
      setShowBanner(true);
    } else {
      // Koneksi pulih - sembunyikan banner dan log ke console
      setIsOnline(true);
      setShowBanner(false);
      console.log('Koneksi pulih. Melanjutkan operasi.');
    }
  }, [netInfo.isInternetReachable]);

  return (
    <NetworkContext.Provider value={{ isOnline, showBanner }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};