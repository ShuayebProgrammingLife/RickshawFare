import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { showAlert } from '../utils/alert';
import { useSettings } from '../context/SettingsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BANGLADESH_DIVISIONS, DISTRICTS_BY_DIVISION } from '../data/bangladeshLocations';

export default function SettingsScreen({ navigation }) {
  const { 
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
    t 
  } = useSettings();

  // Division/District picker state
  const [divPickerStep, setDivPickerStep] = useState('division'); // 'division' | 'district'
  const [pickerSelectedDiv, setPickerSelectedDiv] = useState(null);
  const [isEditingDistrict, setIsEditingDistrict] = useState(false);
  
  const [notifications, setNotifications] = useState(true);
  const [autoDetectPeak, setAutoDetectPeak] = useState(true);
  const [showBargainTips, setShowBargainTips] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [autoDetectWeather, setAutoDetectWeather] = useState(true);

  useEffect(() => {
    loadOtherSettings();
  }, []);

  const loadOtherSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotifications(parsed.notifications !== false);
        setAutoDetectPeak(parsed.autoDetectPeak !== false);
        setShowBargainTips(parsed.showBargainTips !== false);
        setEmergencyContact(parsed.emergencyContact || '');
        setAutoDetectWeather(parsed.autoDetectWeather !== false);
      }
    } catch (e) {
      console.log('Settings load error:', e);
    }
  };

  const saveOtherSettings = async (key, value) => {
    try {
      const settingsStr = await AsyncStorage.getItem('appSettings');
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      settings[key] = value;
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (e) {
      console.log('Settings save error:', e);
    }
  };

  const handleToggle = (key, value, setter) => {
    setter(value);
    saveOtherSettings(key, value);
  };

  const clearAllData = () => {
    showAlert(
      `🗑️ ${t('clear_data')}`,
      t('clear_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove([
              'tripHistory',
              'complaints',
              'appSettings',
            ]);
            showAlert('✅', t('success'));
          },
        },
      ]
    );
  };

  const languages = [
    { id: 'bn', label: '🇧🇩 বাংলা' },
    { id: 'en', label: '🇬🇧 English' },
  ];

  const cities = [
    { id: 'dhaka', label: language === 'bn' ? '🏙️ ঢাকা' : '🏙️ Dhaka' },
    { id: 'chittagong', label: language === 'bn' ? '🏙️ চট্টগ্রাম' : '🏙️ Chittagong' },
    { id: 'sylhet', label: language === 'bn' ? '🏙️ সিলেট' : '🏙️ Sylhet' },
    { id: 'rajshahi', label: language === 'bn' ? '🏙️ রাজশাহী' : '🏙️ Rajshahi' },
  ];

  const transports = [
    { id: 'rickshaw', label: language === 'bn' ? '🚲 রিকশা' : '🚲 Rickshaw' },
    { id: 'cng', label: language === 'bn' ? '🛺 সিএনজি' : '🛺 CNG' },
    { id: 'bus', label: language === 'bn' ? '🚌 বাস' : '🚌 Bus' },
  ];

  const shouldShowDistrictPicker = isEditingDistrict || !defaultDivision || !defaultDistrict;

  const startDistrictEdit = () => {
    setIsEditingDistrict(true);
    setPickerSelectedDiv(defaultDivision || null);
    setDivPickerStep(defaultDivision ? 'district' : 'division');
  };

  const stopDistrictEdit = () => {
    setIsEditingDistrict(false);
    setPickerSelectedDiv(null);
    setDivPickerStep('division');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={t('settings')}
        subtitle={language === 'bn' ? 'অ্যাপ কাস্টমাইজ করুন' : 'Customize your app'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🌐 {t('language')}</Text>
          <View style={styles.optionRow}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.optionChip,
                  { backgroundColor: theme.background, borderColor: theme.border },
                  language === lang.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => changeLanguage(lang.id)}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: theme.textSecondary },
                    language === lang.id && { color: '#fff' }
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🎨 {t('appearance')}</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>🌙 {t('dark_mode')}</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                {t('dark_desc')}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(v) => toggleDarkMode(v)}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={darkMode ? theme.primary : '#888'}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🔔 {t('notifications')}</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>{t('push_notif')}</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>{t('notif_desc')}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(v) => handleToggle('notifications', v, setNotifications)}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={notifications ? theme.primary : '#888'}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>🆘 {language === 'bn' ? 'জরুরি যোগাযোগ' : 'Emergency Contact'}</Text>
          <Text style={[styles.toggleDesc, { color: theme.textSecondary, marginBottom: 10 }]}>
            {language === 'bn' ? 'SOS বাটনের জন্য একটি নম্বর দিন' : 'Enter a number for the SOS button'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
            placeholder="01XXXXXXXXX"
            placeholderTextColor={theme.textSecondary}
            value={emergencyContact}
            onChangeText={(v) => handleToggle('emergencyContact', v, setEmergencyContact)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Fare Settings */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>💰 {t('fare_settings')}</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>⏰ {t('peak_detection')}</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>{t('peak_desc')}</Text>
            </View>
            <Switch
              value={autoDetectPeak}
              onValueChange={(v) => handleToggle('autoDetectPeak', v, setAutoDetectPeak)}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={autoDetectPeak ? theme.primary : '#888'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>😎 {t('show_tips')}</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>{t('tips_desc')}</Text>
            </View>
            <Switch
              value={showBargainTips}
              onValueChange={(v) => handleToggle('showBargainTips', v, setShowBargainTips)}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={showBargainTips ? theme.primary : '#888'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>🌧️ {language === 'bn' ? 'অটো আবহাওয়া ডিটেকশন' : 'Auto Weather Detection'}</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                {language === 'bn' ? 'বৃষ্টি হলে অটোমেটিক ভাড়া সমন্বয় করবে' : 'Automatically adjust fare during rain'}
              </Text>
            </View>
            <Switch
              value={autoDetectWeather}
              onValueChange={(v) => handleToggle('autoDetectWeather', v, setAutoDetectWeather)}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={autoDetectWeather ? theme.primary : '#888'}
            />
          </View>
        </View>

        {/* Default District — Division → District Picker */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              📍 {language === 'bn' ? 'ডিফল্ট জেলা' : 'Default District'}
            </Text>
            {defaultDivision && (
              <TouchableOpacity onPress={isEditingDistrict ? stopDistrictEdit : startDistrictEdit}>
                <Text style={[styles.changeLink, { color: theme.primary }]}>
                  {isEditingDistrict
                    ? (language === 'bn' ? 'বন্ধ করুন' : 'Close')
                    : (language === 'bn' ? 'পরিবর্তন করুন' : 'Change')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Show selected district badge */}
          {defaultDivision && defaultDistrict ? (
            <View style={[styles.selectedDistrictBadge, { backgroundColor: theme.primary + '20', borderColor: theme.primary + '50' }]}>
              <MaterialCommunityIcons name="map-marker-check" size={18} color={theme.primary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.selectedDistrictText, { color: theme.primary }]}>
                  {language === 'bn' ? defaultDistrict.name_bn : defaultDistrict.name_en}
                </Text>
                <Text style={[styles.selectedDivisionText, { color: theme.textSecondary }]}>
                  {language === 'bn' ? defaultDivision.name_bn : defaultDivision.name_en} {language === 'bn' ? 'বিভাগ' : 'Division'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.pickerHint, { color: theme.textSecondary }]}>
              {divPickerStep === 'division'
                ? (language === 'bn' ? 'প্রথমে বিভাগ বেছে নিন:' : 'First select a division:')
                : (language === 'bn' ? 'এখন জেলা বেছে নিন:' : 'Now select a district:')}
            </Text>
          )}

          {/* Step: Division */}
          {shouldShowDistrictPicker && (
            <>
              {defaultDivision && defaultDistrict && (
                <Text style={[styles.pickerHint, { color: theme.textSecondary, marginTop: 14 }]}>
                  {divPickerStep === 'division'
                    ? (language === 'bn' ? 'নতুন বিভাগ বেছে নিন:' : 'Select a new division:')
                    : (language === 'bn' ? 'এখন নতুন জেলা বেছে নিন:' : 'Now select a new district:')}
                </Text>
              )}

              {divPickerStep === 'division' && (
                <View style={styles.pickerGrid}>
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <TouchableOpacity
                      key={div.id}
                      style={[styles.pickerChip, { backgroundColor: theme.background, borderColor: theme.border }]}
                      onPress={() => {
                        setPickerSelectedDiv(div);
                        setDivPickerStep('district');
                      }}
                    >
                      <Text style={styles.pickerEmoji}>{div.emoji}</Text>
                      <Text style={[styles.pickerChipText, { color: theme.text }]}>
                        {language === 'bn' ? div.name_bn : div.name_en}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {divPickerStep === 'district' && pickerSelectedDiv && (
                <>
              <TouchableOpacity
                style={styles.backToDivision}
                onPress={() => setDivPickerStep('division')}
              >
                <MaterialCommunityIcons name="arrow-left" size={16} color={theme.primary} />
                <Text style={[styles.backToDivisionText, { color: theme.primary }]}>
                  {language === 'bn' ? pickerSelectedDiv.name_bn : pickerSelectedDiv.name_en}
                </Text>
              </TouchableOpacity>
              <View style={styles.pickerGrid}>
                {(DISTRICTS_BY_DIVISION[pickerSelectedDiv.id] || []).map((dist) => (
                  <TouchableOpacity
                    key={dist.id}
                  style={[styles.pickerChip, { backgroundColor: theme.background, borderColor: theme.border }]}
                  onPress={() => {
                      updateDefaultDivision(pickerSelectedDiv);
                      updateDefaultDistrict(dist);
                      updateDefaultCity(dist.id);
                      stopDistrictEdit();
                    }}
                  >
                    <Text style={[styles.pickerChipText, { color: theme.text }]}>
                      {language === 'bn' ? dist.name_bn : dist.name_en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
                </>
              )}
            </>
          )}
        </View>

        {/* Default Transport */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🚗 {t('default_transport')}</Text>
          <View style={styles.optionRow}>
            {transports.map((t_item) => (
              <TouchableOpacity
                key={t_item.id}
                style={[
                  styles.optionChip,
                  { backgroundColor: theme.background, borderColor: theme.border },
                  defaultTransport === t_item.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => {
                  updateDefaultTransport(t_item.id);
                }}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: theme.textSecondary },
                    defaultTransport === t_item.id && { color: '#fff' },
                  ]}
                >
                  {t_item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            ⚠️ {t('danger_zone')}
          </Text>
          <TouchableOpacity style={[styles.dangerButton, { backgroundColor: theme.primary + '20', borderColor: theme.primary + '50' }]} onPress={clearAllData}>
            <Text style={[styles.dangerButtonText, { color: theme.primary }]}>🗑️ {t('clear_data')}</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={[styles.aboutTitle, { color: theme.text }]}>RickshawFare 🚲</Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>Fair Fare for Everyone 🇧🇩</Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary, marginTop: 10 }]}>
            {language === 'bn' ? 'এই অ্যাপটি বাংলাদেশের মানুষের জন্য তৈরি' : 'This app is made for the people of Bangladesh'}
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>{language === 'bn' ? 'ন্যায্য ভাড়া নিশ্চিত করতে!' : 'To ensure fair fares!'}</Text>
        </View>

        <View style={{ height: 30 }} />
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
    padding: 15,
  },
  section: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: '#0f3460',
  },
  optionChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  optionChipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0,
  },
  optionChipTextActive: {
    color: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f346030',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 15,
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  toggleDesc: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
  },
  dangerButton: {
    backgroundColor: '#e9456020',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9456050',
  },
  dangerButtonText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: 'bold',
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  aboutTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    color: '#666',
    fontSize: 13,
    marginVertical: 2,
  },
  // Division/District picker styles
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedDistrictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 5,
  },
  selectedDistrictText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDivisionText: {
    fontSize: 12,
    marginTop: 2,
  },
  pickerHint: {
    fontSize: 13,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  pickerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  pickerEmoji: {
    fontSize: 16,
  },
  pickerChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backToDivision: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingVertical: 6,
  },
  backToDivisionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
