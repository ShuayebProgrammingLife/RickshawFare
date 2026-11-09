import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('passenger'); // 'passenger' or 'admin'

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role || 'passenger');
      setIsLoggedIn(!!user);
    } catch (e) {
      setIsLoggedIn(false);
    }
    setTimeout(() => setIsLoading(false), 2000);
  };

  const login = async (token, role = 'passenger') => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'userToken',
      'userName',
      'userEmail',
      'userPhone',
      'userCity',
      'userRole'
    ]);
    setIsLoggedIn(false);
    setUserRole('passenger');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
