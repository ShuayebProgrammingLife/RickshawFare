import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { showAlert } from '../utils/alert';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export default function ComplaintScreen({ navigation }) {
  const { theme, t, language } = useSettings();
  const { showToast } = useToast();
  const [transportType, setTransportType] = useState('rickshaw');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [askedFare, setAskedFare] = useState('');
  const [expectedFare, setExpectedFare] = useState('');
  const [description, setDescription] = useState('');
  const [driverInfo, setDriverInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const transportOptions = [
    { id: 'rickshaw', label: language === 'bn' ? '🚲 রিকশা' : '🚲 Rickshaw' },
    { id: 'cng', label: language === 'bn' ? '🛺 সিএনজি' : '🛺 CNG' },
    { id: 'bus', label: language === 'bn' ? '🚌 বাস' : '🚌 Bus' },
    { id: 'tempo', label: language === 'bn' ? '🚐 টেম্পো' : '🚐 Tempo' },
  ];

  const handleSubmit = async () => {
    if (!from.trim() || !to.trim() || !askedFare.trim()) {
      showToast(language === 'bn' ? '⚠️ লাল তারা (*) চিহ্নিত ফিল্ডগুলো পূরণ করুন' : '⚠️ Fill all fields marked with (*)', 'error');
      return;
    }

    setLoading(true);
    try {
      // Local save
      const complaintsStr = await AsyncStorage.getItem('complaints');
      const complaints = complaintsStr ? JSON.parse(complaintsStr) : [];
      const newComplaint = {
        id: Date.now().toString(),
        transportType,
        from,
        to,
        askedFare: parseFloat(askedFare),
        expectedFare: parseFloat(expectedFare) || null,
        description,
        driverInfo,
        date: new Date().toISOString(),
        status: 'pending',
      };
      complaints.unshift(newComplaint);
      await AsyncStorage.setItem('complaints', JSON.stringify(complaints));

      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast(language === 'bn' ? '✅ আপনার অভিযোগ রেকর্ড করা হয়েছে' : '✅ Complaint recorded');
      navigation.goBack();
    } catch (error) {
      showToast(language === 'bn' ? '❌ জমা দিতে সমস্যা হয়েছে' : '❌ Error submitting', 'error');
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={language === 'bn' ? '⚠️ ওভারচার্জ রিপোর্ট' : '⚠️ Report Overcharge'}
        subtitle={language === 'bn' ? 'অতিরিক্ত ভাড়া নিলে জানান' : 'Let us know if overcharged'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: `${theme.secondary}80`, borderColor: theme.border }]}>
          <Text style={styles.infoBannerIcon}>📢</Text>
          <Text style={[styles.infoBannerText, { color: theme.textSecondary }]}>
            {language === 'bn' 
              ? 'যদি কোনো চালক অতিরিক্ত ভাড়া দাবি করে, এখানে জানান। এটি সবার জন্য ন্যায্য ভাড়া নিশ্চিত করতে সাহায্য করবে।' 
              : 'If a driver asks for extra fare, let us know here. This helps ensure fair fare for everyone.'}
          </Text>
        </View>

        {/* Transport Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🚗 {language === 'bn' ? 'পরিবহনের ধরন' : 'Transport Type'} *</Text>
          <View style={styles.transportGrid}>
            {transportOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.transportOption,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  transportType === opt.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => setTransportType(opt.id)}
              >
                <Text
                  style={[
                    styles.transportOptionText,
                    { color: theme.textSecondary },
                    transportType === opt.id && { color: '#fff' },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Route */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>📍 {language === 'bn' ? 'রুট' : 'Route'} *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder={t('from')}
            placeholderTextColor={theme.textSecondary}
            value={from}
            onChangeText={setFrom}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder={t('to')}
            placeholderTextColor={theme.textSecondary}
            value={to}
            onChangeText={setTo}
          />
        </View>

        {/* Fare Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>💰 {language === 'bn' ? 'ভাড়ার তথ্য' : 'Fare Info'} *</Text>
          <View style={styles.fareRow}>
            <View style={styles.fareInputContainer}>
              <Text style={[styles.fareInputLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'চালক যা চেয়েছে *' : 'Asked fare *'}</Text>
              <TextInput
                style={[styles.fareInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="৳"
                placeholderTextColor={theme.textSecondary}
                value={askedFare}
                onChangeText={setAskedFare}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fareInputContainer}>
              <Text style={[styles.fareInputLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'প্রত্যাশিত ভাড়া' : 'Expected fare'}</Text>
              <TextInput
                style={[styles.fareInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="৳"
                placeholderTextColor={theme.textSecondary}
                value={expectedFare}
                onChangeText={setExpectedFare}
                keyboardType="numeric"
              />
            </View>
          </View>
          {askedFare && expectedFare && (
            <View style={[styles.overchargeInfo, { backgroundColor: `${theme.primary}20`, borderColor: `${theme.primary}50` }]}>
              <Text style={[styles.overchargeText, { color: theme.textSecondary }]}>
                {language === 'bn' ? 'অতিরিক্ত চার্জ:' : 'Overcharge:'}{' '}
                <Text style={[styles.overchargeAmount, { color: theme.primary }]}>
                  ৳{Math.max(0, parseFloat(askedFare) - parseFloat(expectedFare))}
                </Text>
                {' '}
                ({Math.round(
                  ((parseFloat(askedFare) - parseFloat(expectedFare)) /
                    parseFloat(expectedFare)) *
                    100
                )}% {language === 'bn' ? 'বেশি' : 'more'})
              </Text>
            </View>
          )}
        </View>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>👤 {language === 'bn' ? 'চালকের তথ্য (ঐচ্ছিক)' : 'Driver Info (Optional)'}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder={language === 'bn' ? 'গাড়ির নম্বর / চালকের নাম বা বর্ণনা' : 'Vehicle number / Driver name'}
            placeholderTextColor={theme.textSecondary}
            value={driverInfo}
            onChangeText={setDriverInfo}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>📝 {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder={language === 'bn' ? 'কী ঘটেছে তা বিস্তারিত লিখুন...' : 'Describe what happened...'}
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <CustomButton
          title={loading ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : (language === 'bn' ? '📤 অভিযোগ জমা দিন' : '📤 Submit Complaint')}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />

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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#0f346080',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  infoBannerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  transportOption: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#16213e',
    borderWidth: 1.5,
    borderColor: '#0f3460',
  },
  transportOptionActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  transportOptionText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  transportOptionTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  fareRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fareInputContainer: {
    flex: 1,
  },
  fareInputLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
  },
  fareInput: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#0f3460',
    textAlign: 'center',
  },
  overchargeInfo: {
    backgroundColor: '#e9456020',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e9456050',
  },
  overchargeText: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
  },
  overchargeAmount: {
    color: '#e94560',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 10,
  },
});