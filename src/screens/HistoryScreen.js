import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSPORT_LABELS } from '../data/fareData';
import Header from '../components/Header';
import TripCard from '../components/TripCard';
import { showAlert } from '../utils/alert';
import { useSettings } from '../context/SettingsContext';

export default function HistoryScreen({ navigation }) {
  const { theme, t, language } = useSettings();
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    avgFare: 0,
    totalDistance: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const historyStr = await AsyncStorage.getItem('tripHistory');
      const data = historyStr ? JSON.parse(historyStr) : [];
      setHistory(data);
      calculateStats(data);
    } catch (e) {
      console.log('History load error:', e);
    }
  };

  const calculateStats = (data) => {
    const totalTrips = data.length;
    const totalSpent = data.reduce((sum, trip) => sum + (trip.fare || 0), 0);
    const totalDistance = data.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    const avgFare = totalTrips > 0 ? Math.round(totalSpent / totalTrips) : 0;

    setStats({ totalTrips, totalSpent, avgFare, totalDistance: Math.round(totalDistance * 10) / 10 });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, []);

  const clearHistory = () => {
    showAlert(
      `🗑️ ${t('clear_data')}`,
      t('clear_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('tripHistory');
            setHistory([]);
            calculateStats([]);
          },
        },
      ]
    );
  };

  const deleteTrip = async (tripId) => {
    const updated = history.filter((t_item) => t_item.id !== tripId);
    setHistory(updated);
    calculateStats(updated);
    await AsyncStorage.setItem('tripHistory', JSON.stringify(updated));
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter((t_item) => t_item.transport === filter);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (language === 'bn') {
      if (minutes < 1) return 'এইমাত্র';
      if (minutes < 60) return `${minutes} মিনিট আগে`;
      if (hours < 24) return `${hours} ঘন্টা আগে`;
      if (days < 7) return `${days} দিন আগে`;
      return date.toLocaleDateString('bn-BD');
    } else {
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} min ago`;
      if (hours < 24) return `${hours} hours ago`;
      if (days < 7) return `${days} days ago`;
      return date.toLocaleDateString('en-US');
    }
  };

  const filters = [
    { id: 'all', label: language === 'bn' ? '🔄 সব' : '🔄 All' },
    { id: 'rickshaw', label: '🚲' },
    { id: 'cng', label: '🛺' },
    { id: 'bus', label: '🚌' },
    { id: 'tempo', label: '🚐' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title={t('history')} 
        subtitle={language === 'bn' ? `মোট ${stats.totalTrips}টি ট্রিপ` : `Total ${stats.totalTrips} trips`} 
      />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{stats.totalTrips}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'মোট ট্রিপ' : 'Total Trips'}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.accent }]}>৳{stats.totalSpent}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.warning }]}>৳{stats.avgFare}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'গড় ভাড়া' : 'Avg Fare'}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{stats.totalDistance}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('km')}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollableFilters filters={filters} active={filter} onSelect={setFilter} theme={theme} />
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Trip List */}
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            {language === 'bn' ? 'কোনো ট্রিপ ইতিহাস নেই' : 'No trip history'}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            {language === 'bn' ? 'ভাড়া হিসাব করলে এখানে সেভ হবে' : 'Trips will appear here after calculation'}
          </Text>
          <TouchableOpacity
            style={[styles.goHomeButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.goHomeText}>🏠 {t('home')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              formatDate={formatDate}
              onDelete={() => deleteTrip(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#e94560"
              colors={['#e94560']}
            />
          }
        />
      )}
    </View>
  );
}

function ScrollableFilters({ filters, active, onSelect }) {
  return (
    <View style={styles.filtersRow}>
      {filters.map((f) => (
        <TouchableOpacity
          key={f.id}
          style={[
            styles.filterChip,
            active === f.id && styles.filterChipActive,
          ]}
          onPress={() => onSelect(f.id)}
        >
          <Text
            style={[
              styles.filterChipText,
              active === f.id && styles.filterChipTextActive,
            ]}
          >
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  statValue: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 10,
    marginTop: 3,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filtersRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  filterChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  filterChipText: {
    color: '#888',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  clearButton: {
    padding: 8,
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 20,
  },
  listContent: {
    padding: 15,
    paddingTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  goHomeButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 14,
    marginTop: 25,
  },
  goHomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});