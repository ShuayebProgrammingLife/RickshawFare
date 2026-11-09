import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const { theme, t, language, darkMode } = useSettings();
  const { showToast } = useToast();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCity, setUserCity] = useState('dhaka');
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    complaints: 0,
    memberSince: 'জানুয়ারি ২০২৪',
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    const name = await AsyncStorage.getItem('userName');
    const email = await AsyncStorage.getItem('userEmail');
    const phone = await AsyncStorage.getItem('userPhone');
    const city = await AsyncStorage.getItem('userCity');
    const image = await AsyncStorage.getItem('userProfileImage');

    setUserName(name || 'User');
    setUserEmail(email || 'user@example.com');
    setUserPhone(phone || '');
    setUserCity(city || 'dhaka');
    setProfileImage(image || '');
  };

  const loadStats = async () => {
    try {
      const historyStr = await AsyncStorage.getItem('tripHistory');
      const history = historyStr ? JSON.parse(historyStr) : [];
      const complaintsStr = await AsyncStorage.getItem('complaints');
      const complaints = complaintsStr ? JSON.parse(complaintsStr) : [];

      setStats({
        totalTrips: history.length,
        totalSpent: history.reduce((sum, t) => sum + (t.fare || 0), 0),
        complaints: complaints.length,
        memberSince: 'জানুয়ারি ২০২৪',
      });
    } catch (e) {
      console.log('Stats load error:', e);
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userPhone', userPhone);
    await AsyncStorage.setItem('userCity', userCity);
    setIsEditing(false);
    showToast(language === 'bn' ? '✅ প্রোফাইল আপডেট করা হয়েছে!' : '✅ Profile updated!');
  };

  const pickProfileImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAlert(
          '📷',
          language === 'bn'
            ? 'ছবি বাছাই করতে gallery permission দিন'
            : 'Please allow gallery access to pick a photo'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('userProfileImage', uri);
      showToast(language === 'bn' ? '📸 প্রোফাইল ছবি আপডেট হয়েছে' : '📸 Profile photo updated');
    } catch (e) {
      console.log('Profile image pick error:', e);
      showAlert('⚠️', language === 'bn' ? 'ছবি যোগ করা যায়নি' : 'Could not add profile photo');
    }
  };

  const handleLogout = () => {
    showAlert(`🚪 ${t('logout')}`, language === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?' : 'Are you sure you want to logout?', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('ok'),
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const cityNamesEn = {
    dhaka: 'Dhaka',
    chittagong: 'Chittagong',
    sylhet: 'Sylhet',
    rajshahi: 'Rajshahi',
    khulna: 'Khulna',
  };

  const cityNamesBn = {
    dhaka: 'ঢাকা',
    chittagong: 'চট্টগ্রাম',
    sylhet: 'সিলেট',
    rajshahi: 'রাজশাহী',
    khulna: 'খুলনা',
  };

  const cityNames = language === 'bn' ? cityNamesBn : cityNamesEn;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={t('profile')}
        subtitle={language === 'bn' ? 'আপনার ব্যক্তিগত তথ্য' : 'Your personal information'}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <LinearGradient
          colors={darkMode ? [theme.card, theme.background] : ['#ffffff', '#f8f9fa']}
          style={[styles.profileCard, { borderColor: theme.border }]}
        >
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons name="account" size={50} color="#fff" />
              )}
            </View>
            <TouchableOpacity
              style={[styles.editAvatarBtn, { backgroundColor: theme.secondary, borderColor: theme.background }]}
              onPress={pickProfileImage}
            >
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileName, { color: theme.text }]}>{userName}</Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{userEmail}</Text>
          
          <View style={[styles.badge, { backgroundColor: `${theme.accent}15` }]}>
            <MaterialCommunityIcons name="shield-check" size={14} color={theme.accent} style={{ marginRight: 5 }} />
            <Text style={[styles.badgeText, { color: theme.accent }]}>
              {language === 'bn' ? 'ভেরিফাইড প্যাসেঞ্জার' : 'Verified Passenger'}
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.totalTrips}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('trips_completed')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.accent }]}>৳{stats.totalSpent}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.warning }]}>{stats.complaints}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'অভিযোগ' : 'Complaints'}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('personal_info')}</Text>
            <TouchableOpacity onPress={() => isEditing ? saveProfile() : setIsEditing(true)}>
              <Text style={[styles.editLink, { color: theme.primary }]}>
                {isEditing ? t('save') : (language === 'bn' ? 'সম্পাদনা' : 'Edit')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-outline" size={20} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{t('name')}</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: theme.text, borderBottomColor: theme.primary }]}
                  value={userName}
                  onChangeText={setUserName}
                />
              ) : (
                <Text style={[styles.infoValue, { color: theme.text }]}>{userName}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="phone-outline" size={20} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{t('phone')}</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { color: theme.text, borderBottomColor: theme.primary }]}
                  value={userPhone}
                  onChangeText={setUserPhone}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.infoValue, { color: theme.text }]}>{userPhone || (language === 'bn' ? 'যোগ করুন' : 'Add phone')}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{t('city')}</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{cityNames[userCity] || userCity}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.menuSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate('History')}
          >
            <MaterialCommunityIcons name="history" size={22} color={theme.textSecondary} />
            <Text style={[styles.menuText, { color: theme.text }]}>{t('history')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate('Complaint')}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={22} color={theme.textSecondary} />
            <Text style={[styles.menuText, { color: theme.text }]}>
              {language === 'bn' ? 'অভিযোগ জমা দিন' : 'Submit Complaint'}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog-outline" size={22} color={theme.textSecondary} />
            <Text style={[styles.menuText, { color: theme.text }]}>{t('settings')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={[theme.primary, '#b92b45']}
            style={styles.logoutGradient}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0f3460',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(78, 204, 163, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  badgeText: {
    color: '#4ecca3',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: '100%',
  },
  infoSection: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  editLink: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
  },
  infoInput: {
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e94560',
    paddingVertical: 4,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#ccc',
    marginLeft: 15,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
