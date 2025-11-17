import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Custom hook untuk network information
export const useNetInfo = () => {
  const [netInfo, setNetInfo] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable ?? true,
        type: state.type ?? 'unknown',
      });
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setNetInfo({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable ?? true,
        type: state.type ?? 'unknown',
      });
    });

    return unsubscribe;
  }, []);

  return netInfo;
};