import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { showAlert } from '../utils/alert';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const { theme, t, language } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('dhaka');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      showAlert('⚠️ ত্রুটি', 'সবগুলো তথ্য পূরণ করুন');
      return;
    }

    if (password.length < 6) {
      showAlert('⚠️ ত্রুটি', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('⚠️ ত্রুটি', 'পাসওয়ার্ড দুটি মেলেনি');
      return;
    }

    setLoading(true);
    try {
      // Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save to Firestore with 'passenger' role
      const userData = {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        city,
        role: 'passenger',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // Save to local storage
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userPhone', phone);
      await AsyncStorage.setItem('userCity', city);

      showAlert('✅ সফল!', 'আপনার অ্যাকাউন্ট তৈরি হয়েছে!', [
        { text: 'ঠিক আছে', onPress: () => login(userCredential.user.uid) },
      ]);
    } catch (error) {
      console.error('Registration Error:', error);
      let errorMsg = 'রেজিস্ট্রেশন ব্যর্থ হয়েছে';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'সঠিক ইমেইল ঠিকানা দিন';
      } else if (error.message.includes('400')) {
        errorMsg = 'সার্ভার থেকে ত্রুটি (400)। দয়া করে Firebase কনসোলে Email/Password Auth চালু আছে কিনা চেক করুন।';
      }
      showAlert('❌ ত্রুটি', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    { id: 'dhaka', name: 'ঢাকা', icon: 'city' },
    { id: 'chittagong', name: 'চট্টগ্রাম', icon: 'home-city' },
    { id: 'sylhet', name: 'সিলেট', icon: 'office-building' },
    { id: 'rajshahi', name: 'রাজশাহী', icon: 'town-hall' },
    { id: 'khulna', name: 'খুলনা', icon: 'domain' },
  ];

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#e94560" />
            </TouchableOpacity>
            <Text style={styles.title}>নতুন অ্যাকাউন্ট</Text>
            <Text style={styles.subtitle}>RickshawFare পরিবারে স্বাগতম! 🚲</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Name */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="account-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t('name')}
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="email-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t('email')}
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="phone-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t('phone')}
                placeholderTextColor={theme.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            {/* City Label */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              {language === 'bn' ? 'আপনার শহর বেছে নিন' : 'Choose your city'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cityScroll}
            >
              {cities.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.cityChip,
                    { backgroundColor: theme.background, borderColor: theme.border },
                    city === c.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setCity(c.id)}
                >
                  <MaterialCommunityIcons 
                    name={c.icon} 
                    size={16} 
                    color={city === c.id ? '#fff' : theme.textSecondary} 
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.cityChipText,
                      { color: theme.textSecondary },
                      city === c.id && { color: '#fff' },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Password */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t('password')}
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>{t('create_account')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>{language === 'bn' ? 'আগেই অ্যাকাউন্ট আছে? ' : 'Already have an account? '} </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>{t('login')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  sectionLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  cityScroll: {
    marginBottom: 24,
  },
  cityChip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cityChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  cityChipText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#888',
    fontSize: 15,
  },
  loginLink: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: 'bold',
  },
});