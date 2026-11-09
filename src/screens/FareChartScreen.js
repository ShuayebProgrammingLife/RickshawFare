import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { BASE_FARE_RATES, TRANSPORT_LABELS } from '../data/fareData';
import { useSettings } from '../context/SettingsContext';

export default function FareChartScreen({ navigation }) {
  const { theme, t, language } = useSettings();
  const transportKeys = Object.keys(BASE_FARE_RATES);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={t('fare_chart')}
        subtitle={language === 'bn' ? 'সরকারি এবং নির্ধারিত ভাড়া' : 'Govt and regular fixed fares'}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderLeftColor: theme.accent }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            💡 {language === 'bn' 
              ? 'নিচের ভাড়ার তালিকাটি একটি আনুমানিক ধারণা মাত্র। ট্রাফিক জ্যাম, বৃষ্টির সময় বা রাতের বেলা ভাড়ার তারতম্য হতে পারে।' 
              : 'The following fare list is an estimate. Fare may vary due to traffic, rain, or night time.'}
          </Text>
        </View>

        {transportKeys.map((key) => {
          const rates = BASE_FARE_RATES[key];
          return (
            <View key={key} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.cardHeader, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.transportName, { color: '#fff' }]}>{TRANSPORT_LABELS[key]}</Text>
              </View>

              <View style={styles.rateContainer}>
                <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                  <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'ন্যূনতম / বেস ভাড়া:' : 'Minimum / Base Fare:'}</Text>
                  <Text style={[styles.rateValue, { color: theme.accent }]}>৳{rates.baseFare}</Text>
                </View>
                
                <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                  <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'প্রতি কিলোমিটার:' : 'Per Kilometer:'}</Text>
                  <Text style={[styles.rateValue, { color: theme.accent }]}>৳{rates.perKm}</Text>
                </View>

                {rates.acPerKm && (
                  <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                    <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'এসি বাস (প্রতি কিমি):' : 'AC Bus (Per Km):'}</Text>
                    <Text style={[styles.rateValue, { color: theme.accent }]}>৳{rates.acPerKm}</Text>
                  </View>
                )}

                {rates.flagFall && (
                  <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                    <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'ফ্ল্যাগ ফল (মিটার चालू):' : 'Flag Fall (Meter Start):'}</Text>
                    <Text style={[styles.rateValue, { color: theme.accent }]}>৳{rates.flagFall}</Text>
                  </View>
                )}

                {rates.waitingPerMin > 0 && (
                  <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                    <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'ওয়েটিং চার্জ (প্রতি মিনিট):' : 'Waiting Charge (Per Min):'}</Text>
                    <Text style={[styles.rateValue, { color: theme.accent }]}>৳{rates.waitingPerMin}</Text>
                  </View>
                )}

                {rates.nightSurcharge > 1 && (
                  <View style={[styles.rateRow, { borderBottomColor: theme.background }]}>
                    <Text style={[styles.rateLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'রাতের সারচার্জ:' : 'Night Surcharge:'}</Text>
                    <Text style={[styles.rateValue, { color: theme.primary }]}>
                      {((rates.nightSurcharge - 1) * 100).toFixed(0)}% {language === 'bn' ? 'বেশি' : 'More'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  infoBox: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecca3',
  },
  infoText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  transportName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rateContainer: {
    padding: 15,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  rateLabel: {
    color: '#888',
    fontSize: 14,
  },
  rateValue: {
    color: '#4ecca3',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
