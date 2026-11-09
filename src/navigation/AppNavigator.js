import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FareChartScreen from '../screens/FareChartScreen';
import ComplaintScreen from '../screens/ComplaintScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FavoriteRoutesScreen from '../screens/FavoriteRoutesScreen';
import BusRouteScreen from '../screens/BusRouteScreen';
import BargainBotScreen from '../screens/BargainBotScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';

import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { t, theme } = useSettings();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'History') iconName = focused ? 'history' : 'history';
          else if (route.name === 'FareChart') iconName = focused ? 'chart-bar' : 'chart-bar';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: t('map') }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t('history') }} />
      <Tab.Screen name="FareChart" component={FareChartScreen} options={{ tabBarLabel: t('fare_chart') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ToastProvider>
          <AppNavigatorContent />
        </ToastProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

function AppNavigatorContent() {
  const { isLoggedIn, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          </>
        ) : userRole === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Complaint" component={ComplaintScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="FavoriteRoutes" component={FavoriteRoutesScreen} />
            <Stack.Screen name="BusRoutes" component={BusRouteScreen} />
            <Stack.Screen name="BargainBot" component={BargainBotScreen} />
            <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}