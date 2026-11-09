import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Header from '../components/Header';
import { showAlert } from '../utils/alert';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useAuth();
  const { theme, language } = useSettings();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const complaintsStr = await AsyncStorage.getItem('complaints');
      if (complaintsStr) {
        const data = JSON.parse(complaintsStr);
        setComplaints(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(c => c.status === 'pending').length;
    const resolved = data.filter(c => c.status === 'resolved').length;
    setStats({ total, pending, resolved });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const updatedComplaints = complaints.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      );
      setComplaints(updatedComplaints);
      await AsyncStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      calculateStats(updatedComplaints);
      showAlert('✅', language === 'bn' ? 'স্ট্যাটাস আপডেট করা হয়েছে' : 'Status updated');
    } catch (error) {
      showAlert('❌', 'Error updating status');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.complaintCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.transportType}>
          <Text style={styles.transportIcon}>
            {item.transportType === 'rickshaw' ? '🚲' : item.transportType === 'cng' ? '🛺' : '🚌'}
          </Text>
          <Text style={[styles.statusBadge, item.status === 'pending' ? styles.pendingBadge : styles.resolvedBadge]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.routeContainer}>
        <Text style={[styles.routeText, { color: theme.text }]}>{item.from} → {item.to}</Text>
      </View>

      <View style={styles.fareContainer}>
        <View style={styles.fareItem}>
          <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>Asked</Text>
          <Text style={[styles.fareValue, { color: theme.primary }]}>৳{item.askedFare}</Text>
        </View>
        <View style={styles.fareItem}>
          <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>Expected</Text>
          <Text style={[styles.fareValue, { color: theme.accent }]}>৳{item.expectedFare || 'N/A'}</Text>
        </View>
      </View>

      {item.description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]}>"{item.description}"</Text>
      ) : null}

      {item.driverInfo ? (
        <View style={styles.driverInfo}>
          <MaterialCommunityIcons name="account-details" size={16} color={theme.textSecondary} />
          <Text style={[styles.driverText, { color: theme.textSecondary }]}>{item.driverInfo}</Text>
        </View>
      ) : null}

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.accent }]}
            onPress={() => updateStatus(item.id, 'resolved')}
          >
            <Text style={styles.actionButtonText}>Resolve</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]}
          onPress={() => {
            Alert.alert(
              'Delete Report',
              'Are you sure you want to delete this report?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: async () => {
                  const filtered = complaints.filter(c => c.id !== item.id);
                  setComplaints(filtered);
                  await AsyncStorage.setItem('complaints', JSON.stringify(filtered));
                  calculateStats(filtered);
                }, style: 'destructive' }
              ]
            );
          }}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Admin Dashboard" 
        subtitle="Manage Passenger Reports" 
      />

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.warning }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.accent }]}>{stats.resolved}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Resolved</Text>
        </View>
      </View>

      <View style={styles.contentHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recent Reports 🚩
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <MaterialCommunityIcons name="refresh" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={80} color={theme.border} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No reports found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LinearGradient
          colors={['#e94560', '#ff4d4d']}
          style={styles.logoutGradient}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout from Admin</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  complaintCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transportType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  transportIcon: {
    fontSize: 20,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    color: '#ffa500',
  },
  resolvedBadge: {
    backgroundColor: 'rgba(78, 204, 163, 0.2)',
    color: '#4ecca3',
  },
  dateText: {
    fontSize: 12,
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fareContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  fareItem: {
    flex: 1,
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  fareValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 20,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  driverText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 15,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
