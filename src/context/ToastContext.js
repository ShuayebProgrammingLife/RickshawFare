import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ visible: true, message, type });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToast({ visible: false, message: '', type: 'success' });
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View style={[
          styles.toastContainer, 
          { opacity: fadeAnim },
          toast.type === 'error' ? styles.errorToast : styles.successToast
        ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 9999,
  },
  successToast: {
    backgroundColor: '#4ecca3',
  },
  errorToast: {
    backgroundColor: '#e94560',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
