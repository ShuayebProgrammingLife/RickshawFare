import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TRANSPORT_LABELS } from '../data/fareData';
import { useSettings } from '../context/SettingsContext';

export default function TripCard({ trip, formatDate, onDelete }) {
  const { theme, language, t } = useSettings();
  const transportEmoji = {
    rickshaw: '🚲',
    cng: '🛺',
    bus: '🚌',
    tempo: '🚐',
    leguna: '🚙',
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.transportBadge, { backgroundColor: theme.background }]}>
          <Text style={styles.transportEmoji}>
            {transportEmoji[trip.transport] || '🚗'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.route, { color: theme.text }]}>
            {trip.from} → {trip.to}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{formatDate(trip.date)}</Text>
        </View>
        <View style={[styles.fareContainer, { backgroundColor: `${theme.accent}20` }]}>
          <Text style={[styles.fare, { color: theme.accent }]}>৳{trip.fare}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📏</Text>
          <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{trip.distance} {t('km')}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🚗</Text>
          <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
            {TRANSPORT_LABELS[trip.transport] || trip.transport}
          </Text>
        </View>
        {trip.isPeak && (
          <View style={[styles.badge, { backgroundColor: `${theme.warning}20` }]}>
            <Text style={[styles.badgeText, { color: theme.warning }]}>🔥 {language === 'bn' ? 'পিক' : 'Peak'}</Text>
          </View>
        )}
        {trip.isNight && (
          <View style={[styles.badge, { backgroundColor: `${theme.primary}20` }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>🌙 {language === 'bn' ? 'রাত' : 'Night'}</Text>
          </View>
        )}
        {trip.vehicleNumber && trip.vehicleNumber !== 'N/A' && (
          <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
            <Text style={[styles.badgeText, { color: theme.textSecondary }]}>🔢 {trip.vehicleNumber}</Text>
          </View>
        )}
      </View>

      {/* Delete button */}
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportBadge: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transportEmoji: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  route: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
  },
  fareContainer: {
    backgroundColor: '#4ecca320',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  fare: {
    color: '#4ecca3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    color: '#888',
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    padding: 5,
  },
  deleteText: {
    fontSize: 16,
  },
});