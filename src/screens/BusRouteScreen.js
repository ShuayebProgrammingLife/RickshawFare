import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { BUS_ROUTES } from '../data/fareData';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function BusRouteScreen() {
  const { theme, language } = useSettings();
  const [search, setSearch] = useState('');

  const filteredRoutes = BUS_ROUTES.filter(route => 
    route.name.toLowerCase().includes(search.toLowerCase()) ||
    route.stops.some(stop => stop.toLowerCase().includes(search.toLowerCase())) ||
    route.bus_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title={language === 'bn' ? 'বাস রুট খুঁজুন' : 'Find Bus Routes'} 
        subtitle={language === 'bn' ? 'ঢাকার প্রধান বাস রুটসমূহ' : 'Major bus routes of Dhaka'}
      />

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={language === 'bn' ? 'রুট বা বাসের নাম লিখুন...' : 'Search route or bus name...'}
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.routeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.busIconBox, { backgroundColor: theme.primary + '20' }]}>
                <MaterialCommunityIcons name="bus" size={24} color={theme.primary} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.routeName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.busName, { color: theme.accent }]}>{item.bus_name}</Text>
              </View>
              <View style={styles.fareBox}>
                <Text style={[styles.fareText, { color: theme.primary }]}>৳{item.fare}</Text>
              </View>
            </View>

            <View style={styles.stopsContainer}>
              <Text style={[styles.stopsTitle, { color: theme.textSecondary }]}>
                {language === 'bn' ? 'স্টপেজসমূহ:' : 'Stops:'}
              </Text>
              <View style={styles.stopsList}>
                {item.stops.map((stop, index) => (
                  <View key={index} style={styles.stopChip}>
                    <Text style={[styles.stopText, { color: theme.text }]}>
                      {stop}{index < item.stops.length - 1 ? ' → ' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {language === 'bn' ? 'কোনো রুট পাওয়া যায়নি' : 'No routes found'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  routeCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  routeName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  busName: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  fareBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
  },
  fareText: {
    fontSize: 16,
    fontWeight: '900',
  },
  stopsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  stopsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  stopsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stopText: {
    fontSize: 12,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
