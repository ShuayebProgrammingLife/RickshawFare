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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { showAlert } from '../utils/alert';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { theme, t, language } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('⚠️ ত্রুটি', 'ইমেইল এবং পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', email.split('@')[0]);

      await login(userCredential.user.uid);
    } catch (error) {
      console.error('Login Error:', error);
      let errorMsg = 'লগইন ব্যর্থ হয়েছে';
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'এই ইমেইলে কোনো অ্যাকাউন্ট নেই';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'পাসওয়ার্ড ভুল হয়েছে';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'সঠিক ইমেইল ঠিকানা দিন';
      }
      showAlert('❌ ত্রুটি', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    await AsyncStorage.setItem('userName', 'Guest User');
    await login('guest-token');
  };

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
          {/* Top Illustration/Logo Area */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="rickshaw" size={80} color="#e94560" />
            </View>
            <Text style={styles.appName}>RickshawFare</Text>
            <Text style={styles.tagline}>Fair Fare for Everyone 🇧🇩</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t('login')}</Text>
            
            {/* Email Input */}
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

            {/* Password Input */}
            <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color={theme.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1, color: theme.text }]}
                placeholder={t('password')}
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>{t('forgot_password')}</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>{t('login')}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
              <Text style={[styles.orText, { color: theme.textSecondary }]}>{language === 'bn' ? 'অথবা' : 'OR'}</Text>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            </View>

            {/* Guest Login */}
            <TouchableOpacity style={[styles.guestButton, { borderColor: theme.border }]} onPress={handleGuestLogin}>
              <MaterialCommunityIcons name="account-outline" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <Text style={[styles.guestButtonText, { color: theme.textSecondary }]}>{language === 'bn' ? 'গেস্ট হিসেবে প্রবেশ করুন' : 'Enter as Guest'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.adminLink, { marginTop: 15 }]} 
              onPress={() => navigation.navigate('AdminLogin')}
            >
              <MaterialCommunityIcons name="shield-account-outline" size={18} color={theme.textSecondary} style={{ marginRight: 5 }} />
              <Text style={[styles.adminLinkText, { color: theme.textSecondary }]}>
                {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>{t('no_account')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: theme.primary }]}>{t('create_account')}</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 14,
    color: '#e94560',
    marginTop: 5,
    fontWeight: '600',
    opacity: 0.9,
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
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
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
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  orText: {
    color: '#888',
    marginHorizontal: 12,
    fontSize: 14,
  },
  guestButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  guestButtonText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
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
  registerLink: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: 'bold',
  },
  adminLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  adminLinkText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});