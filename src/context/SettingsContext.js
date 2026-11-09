import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('bn'); // 'bn' or 'en'
  const [defaultCity, setDefaultCity] = useState('dhaka');
  const [defaultTransport, setDefaultTransport] = useState('rickshaw');
  const [defaultDivision, setDefaultDivision] = useState(null);
  const [defaultDistrict, setDefaultDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
        if (parsed.language !== undefined) setLanguage(parsed.language);
        if (parsed.defaultCity !== undefined) setDefaultCity(parsed.defaultCity);
        if (parsed.defaultTransport !== undefined) setDefaultTransport(parsed.defaultTransport);
        if (parsed.defaultDivision !== undefined) setDefaultDivision(parsed.defaultDivision);
        if (parsed.defaultDistrict !== undefined) setDefaultDistrict(parsed.defaultDistrict);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const current = await AsyncStorage.getItem('appSettings');
      const parsed = current ? JSON.parse(current) : {};
      const updated = { ...parsed, ...newSettings };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    saveSettings({ darkMode: value });
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    saveSettings({ language: lang });
  };

  const updateDefaultCity = (city) => {
    setDefaultCity(city);
    saveSettings({ defaultCity: city });
  };

  const updateDefaultTransport = (transport) => {
    setDefaultTransport(transport);
    saveSettings({ defaultTransport: transport });
  };

  const updateDefaultDivision = (division) => {
    setDefaultDivision(division);
    saveSettings({ defaultDivision: division });
  };

  const updateDefaultDistrict = (district) => {
    setDefaultDistrict(district);
    saveSettings({ defaultDistrict: district });
  };

  // Define themes
  const theme = {
    background: darkMode ? '#1a1a2e' : '#f8f9fa',
    card: darkMode ? '#16213e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#212529',
    textSecondary: darkMode ? '#888' : '#6c757d',
    primary: '#e94560',
    secondary: '#0f3460',
    border: darkMode ? '#0f3460' : '#dee2e6',
    accent: '#4ecca3',
    warning: '#ffa500',
  };

  // Basic translations helper
  const t = (key) => {
    const translations = {
      // Common
      'welcome': { bn: 'স্বাগতম', en: 'Welcome' },
      'home': { bn: 'হোম', en: 'Home' },
      'map': { bn: 'ম্যাপ', en: 'Map' },
      'history': { bn: 'ইতিহাস', en: 'History' },
      'fare_chart': { bn: 'ভাড়া চার্ট', en: 'Fare Chart' },
      'profile': { bn: 'প্রোফাইল', en: 'Profile' },
      'settings': { bn: 'সেটিংস', en: 'Settings' },
      'logout': { bn: 'লগআউট', en: 'Logout' },
      'calculate_fare': { bn: 'ভাড়া হিসাব করুন', en: 'Calculate Fare' },
      'from': { bn: 'কোথা থেকে?', en: 'From?' },
      'to': { bn: 'কোথায়?', en: 'To?' },
      'distance': { bn: 'দূরত্ব', en: 'Distance' },
      'km': { bn: 'কিমি', en: 'km' },
      'transport': { bn: 'পরিবহন', en: 'Transport' },
      'estimated_fare': { bn: 'আনুমানিক ভাড়া', en: 'Estimated Fare' },
      'loading': { bn: 'লোড হচ্ছে...', en: 'Loading...' },
      'error': { bn: 'ত্রুটি', en: 'Error' },
      'success': { bn: 'সফল', en: 'Success' },
      'ok': { bn: 'ঠিক আছে', en: 'OK' },
      'cancel': { bn: 'বাতিল', en: 'Cancel' },
      'save': { bn: 'সংরক্ষণ করুন', en: 'Save' },

      // Home Screen
      'today_where': { bn: 'আজ কোথায় যাবেন?', en: 'Where to today?' },
      'peak_hour': { bn: 'পিক আওয়ার', en: 'Peak Hour' },
      'night': { bn: 'রাত', en: 'Night' },
      'raining': { bn: 'বৃষ্টি হচ্ছে', en: 'It\'s Raining' },
      'no_rain': { bn: 'বৃষ্টি নেই', en: 'No Rain' },
      'trip_info': { bn: 'যাত্রার তথ্য', en: 'Trip Info' },
      'select_transport': { bn: 'পরিবহন নির্বাচন', en: 'Select Transport' },
      'popular_routes': { bn: 'জনপ্রিয় রুট', en: 'Popular Routes' },
      'fare_breakdown': { bn: 'ভাড়ার বিশ্লেষণ', en: 'Fare Breakdown' },
      'base_fare': { bn: 'বেস ভাড়া', en: 'Base Fare' },
      'distance_charge': { bn: 'দূরত্ব চার্জ', en: 'Distance Charge' },
      'extra_charge': { bn: 'অতিরিক্ত চার্জ', en: 'Extra Charge' },
      'bargain_tips': { bn: 'দরাদরি টিপস', en: 'Bargaining Tips' },
      'start_with': { bn: 'শুরু করুন', en: 'Start with' },
      'target': { bn: 'লক্ষ্য', en: 'Target' },
      'max_pay': { bn: 'সর্বোচ্চ', en: 'Max' },
      'compare_all': { bn: 'সব পরিবহনে তুলনা করুন', en: 'Compare all transports' },
      'hide_compare': { bn: 'তুলনা লুকান', en: 'Hide comparison' },
      'tip_of_day': { bn: 'আজকের টিপ', en: 'Tip of the Day' },
      'report_overcharge': { bn: 'ওভারচার্জ রিপোর্ট', en: 'Report Overcharge' },

      // Map Screen
      'city_map': { bn: 'এর ম্যাপ', en: 'Map' },
      'popular_landmarks': { bn: 'জনপ্রিয় ল্যান্ডমার্কসমূহ', en: 'Popular Landmarks' },

      // Profile Screen
      'edit_profile': { bn: 'প্রোফাইল এডিট করুন', en: 'Edit Profile' },
      'trips_completed': { bn: 'মোট ট্রিপ', en: 'Trips Done' },
      'money_saved': { bn: 'টাকা বাঁচিয়েছেন', en: 'Money Saved' },
      'personal_info': { bn: 'ব্যক্তিগত তথ্য', en: 'Personal Info' },
      'name': { bn: 'নাম', en: 'Name' },
      'email': { bn: 'ইমেইল', en: 'Email' },
      'phone': { bn: 'ফোন', en: 'Phone' },
      'city': { bn: 'শহর', en: 'City' },

      // Settings Screen
      'appearance': { bn: 'দেখতে', en: 'Appearance' },
      'dark_mode': { bn: 'ডার্ক মোড', en: 'Dark Mode' },
      'dark_desc': { bn: 'অন্ধকার থিম ব্যবহার করুন', en: 'Use dark theme' },
      'language': { bn: 'ভাষা', en: 'Language' },
      'notifications': { bn: 'বিজ্ঞপ্তি', en: 'Notifications' },
      'notif_desc': { bn: 'জ্বালানি মূল্য আপডেট ইত্যাদি', en: 'Fuel price updates, etc.' },
      'fare_settings': { bn: 'ভাড়া সেটিংস', en: 'Fare Settings' },
      'peak_detection': { bn: 'পিক আওয়ার ডিটেকশন', en: 'Peak Detection' },
      'peak_desc': { bn: 'স্বয়ংক্রিয় পিক আওয়ার চিনুন', en: 'Auto detect peak hours' },
      'show_tips': { bn: 'দরাদরি টিপস দেখান', en: 'Show bargain tips' },
      'tips_desc': { bn: 'ভাড়া হিসাবের সাথে টিপস দেখান', en: 'Show tips with calculation' },
      'default_city': { bn: 'ডিফল্ট শহর', en: 'Default City' },
      'default_transport': { bn: 'ডিফল্ট পরিবহন', en: 'Default Transport' },
      'danger_zone': { bn: 'বিপজ্জনক এলাকা', en: 'Danger Zone' },
      'clear_data': { bn: 'সব ডেটা মুছুন', en: 'Clear All Data' },
      'clear_confirm': { bn: 'সব ট্রিপ ইতিহাস এবং সেটিংস মুছে ফেলতে চান?', en: 'Clear all history and settings?' },

      // Auth
      'login': { bn: 'লগইন', en: 'Login' },
      'register': { bn: 'নিবন্ধন', en: 'Register' },
      'password': { bn: 'পাসওয়ার্ড', en: 'Password' },
      'forgot_password': { bn: 'পাসওয়ার্ড ভুলে গেছেন?', en: 'Forgot Password?' },
      'no_account': { bn: 'অ্যাকাউন্ট নেই?', en: 'No account?' },
      'create_account': { bn: 'নতুন অ্যাকাউন্ট তৈরি করুন', en: 'Create new account' },
      'already_have_account': { bn: 'আগেই অ্যাকাউন্ট আছে?', en: 'Already have account?' },
    };
    return translations[key] ? translations[key][language] : key;
  };

  return (
    <SettingsContext.Provider value={{ 
      darkMode, 
      language, 
      defaultCity, 
      defaultTransport,
      defaultDivision,
      defaultDistrict,
      toggleDarkMode, 
      changeLanguage, 
      updateDefaultCity, 
      updateDefaultTransport,
      updateDefaultDivision,
      updateDefaultDistrict,
      theme, 
      t, 
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
