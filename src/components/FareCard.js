import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TRANSPORT_LABELS } from '../data/fareData';
import { useSettings } from '../context/SettingsContext';

export default function FareCard({ type, data, isSelected, onPress }) {
  const { theme, language } = useSettings();
  
  if (!data.available) {
    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.5 }]}>
        <Text style={[styles.transportLabel, { color: theme.text }]}>{TRANSPORT_LABELS[type]}</Text>
        <Text style={[styles.unavailableText, { color: theme.textSecondary }]}>{data.reason}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { backgroundColor: theme.card, borderColor: theme.border },
        isSelected && { borderColor: theme.primary, backgroundColor: `${theme.primary}10`, borderWidth: 2 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <Text style={[styles.transportLabel, { color: theme.text }]}>{TRANSPORT_LABELS[type]}</Text>
        {isSelected && <Text style={[styles.selectedBadge, { color: theme.primary }]}>
          {language === 'bn' ? '✓ নির্বাচিত' : '✓ Selected'}
        </Text>}
      </View>

      <View style={styles.fareRow}>
        <View style={styles.fareItem}>
          <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'ন্যূনতম' : 'Min'}</Text>
          <Text style={[styles.fareValue, { color: theme.accent }]}>
            ৳{data.minFare}
          </Text>
        </View>
        <View style={styles.fareItem}>
          <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'আনুমানিক' : 'Est'}</Text>
          <Text style={[styles.fareValue, { color: theme.warning, fontSize: 20 }]}>
            ৳{data.estimatedFare}
          </Text>
        </View>
        <View style={styles.fareItem}>
          <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'সর্বোচ্চ' : 'Max'}</Text>
          <Text style={[styles.fareValue, { color: theme.primary }]}>
            ৳{data.maxFare}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  cardSelected: {
    borderColor: '#e94560',
    borderWidth: 2,
    backgroundColor: '#e9456010',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transportLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedBadge: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '600',
  },
  unavailableText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fareItem: {
    alignItems: 'center',
  },
  fareLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  fareValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});