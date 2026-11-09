import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSettings } from '../context/SettingsContext';
import {
  BANGLADESH_DIVISIONS,
  DISTRICTS_BY_DIVISION,
  getAreasForDistrict,
} from '../data/bangladeshLocations';

// step: 'division' | 'district' | 'area'
export default function LocationPickerScreen({ navigation, route }) {
  const { theme, language } = useSettings();
  const { mode, lockedDivision = null, lockedDistrict = null } = route.params; // 'from' or 'to'

  const [step, setStep] = useState(lockedDistrict ? 'area' : lockedDivision ? 'district' : 'division');
  const [selectedDivision, setSelectedDivision] = useState(lockedDivision);
  const [selectedDistrict, setSelectedDistrict] = useState(lockedDistrict);
  const [search, setSearch] = useState('');

  const name = (item) => language === 'bn' ? item.name_bn : item.name_en;
  const areaName = (item) => language === 'bn' ? item.name_bn : item.name_en;

  // ── Division list ──────────────────────────────────────────────
  const divisionList = BANGLADESH_DIVISIONS.filter(d =>
    name(d).toLowerCase().includes(search.toLowerCase())
  );

  // ── District list ──────────────────────────────────────────────
  const districtList = selectedDivision
    ? (DISTRICTS_BY_DIVISION[selectedDivision.id] || []).filter(d =>
        name(d).toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ── Area list ──────────────────────────────────────────────────
  const areaList = selectedDistrict
    ? getAreasForDistrict(selectedDistrict).filter((a) =>
        areaName(a).toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleDivisionSelect = (div) => {
    setSelectedDivision(div);
    setSelectedDistrict(null);
    setSearch('');
    setStep('district');
  };

  const handleDistrictSelect = (dist) => {
    setSelectedDistrict(dist);
    setSearch('');
    setStep('area');
  };

  const handleAreaSelect = (area) => {
    const result = {
      name: areaName(area),
      district: name(selectedDistrict),
      division: name(selectedDivision),
      lat: area.lat,
      lon: area.lon,
    };
    navigation.navigate('Home', { pickedLocation: result, mode });
  };

  const goBack = () => {
    if (lockedDistrict) {
      navigation.goBack();
      return;
    }

    if (step === 'area') {
      setStep('district');
      setSearch('');
    } else if (step === 'district') {
      setStep('division');
      setSearch('');
    } else {
      navigation.goBack();
    }
  };

  // ── Breadcrumb ─────────────────────────────────────────────────
  const Breadcrumb = () => (
    <View style={styles.breadcrumb}>
      {lockedDivision ? (
        <Text style={[styles.breadcrumbItem, { color: theme.textSecondary }]}>
          {language === 'bn' ? 'বিভাগ' : 'Division'}
        </Text>
      ) : (
        <TouchableOpacity onPress={() => { setStep('division'); setSearch(''); }}>
          <Text style={[styles.breadcrumbItem, { color: step === 'division' ? theme.primary : theme.textSecondary }]}>
            {language === 'bn' ? 'বিভাগ' : 'Division'}
          </Text>
        </TouchableOpacity>
      )}
      {selectedDivision && (
        <>
          <MaterialCommunityIcons name="chevron-right" size={16} color={theme.textSecondary} />
          {lockedDistrict ? (
            <Text style={[styles.breadcrumbItem, { color: theme.textSecondary }]}>
              {name(selectedDivision)}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => { setStep('district'); setSearch(''); }}>
              <Text style={[styles.breadcrumbItem, { color: step === 'district' ? theme.primary : theme.textSecondary }]}>
                {name(selectedDivision)}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {selectedDistrict && step === 'area' && (
        <>
          <MaterialCommunityIcons name="chevron-right" size={16} color={theme.textSecondary} />
          <Text style={[styles.breadcrumbItem, { color: theme.primary }]}>
            {name(selectedDistrict)}
          </Text>
        </>
      )}
    </View>
  );

  // ── Title ──────────────────────────────────────────────────────
  const getTitle = () => {
    if (step === 'division') return language === 'bn' ? 'বিভাগ বেছে নিন' : 'Select Division';
    if (step === 'district') return language === 'bn' ? 'জেলা বেছে নিন' : 'Select District';
    return language === 'bn' ? 'এলাকা বেছে নিন' : 'Select Area';
  };

  const getSearchPlaceholder = () => {
    if (step === 'division') return language === 'bn' ? 'বিভাগ খুঁজুন...' : 'Search division...';
    if (step === 'district') return language === 'bn' ? 'জেলা খুঁজুন...' : 'Search district...';
    return language === 'bn' ? 'এলাকা খুঁজুন...' : 'Search area...';
  };

  // ── Data & render item ─────────────────────────────────────────
  const currentData = step === 'division' ? divisionList : step === 'district' ? districtList : areaList;

  const renderItem = ({ item }) => {
    const isDiv = step === 'division';
    const isArea = step === 'area';
    const label = isArea ? areaName(item) : name(item);

    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => {
          if (isDiv) handleDivisionSelect(item);
          else if (step === 'district') handleDistrictSelect(item);
          else handleAreaSelect(item);
        }}
      >
        <View style={styles.itemLeft}>
          {isDiv && <Text style={styles.emoji}>{item.emoji}</Text>}
          {!isDiv && (
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
              <MaterialCommunityIcons
                name={isArea ? 'map-marker' : 'office-building-marker'}
                size={20}
                color={theme.primary}
              />
            </View>
          )}
          <Text style={[styles.itemText, { color: theme.text }]}>{label}</Text>
        </View>
        {!isArea && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
        )}
        {isArea && (
          <MaterialCommunityIcons name="map-marker-check" size={20} color={theme.accent} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <LinearGradient colors={[theme.primary, theme.secondary]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerMode}>
              {mode === 'from'
                ? (language === 'bn' ? '📍 যাত্রার শুরু' : '📍 From Location')
                : (language === 'bn' ? '🏁 গন্তব্য' : '🏁 To Location')}
            </Text>
            <Text style={styles.headerTitle}>{getTitle()}</Text>
          </View>
        </View>
        <Breadcrumb />
      </LinearGradient>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={getSearchPlaceholder()}
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={currentData}
        keyExtractor={(item, index) => (item.id || item.name || index).toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="map-search" size={60} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {language === 'bn' ? 'কিছু পাওয়া যায়নি' : 'Nothing found'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 15,
    padding: 4,
  },
  headerInfo: { flex: 1 },
  headerMode: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  breadcrumbItem: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: { fontSize: 24, marginRight: 14 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemText: { fontSize: 16, fontWeight: '500' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, marginTop: 15 },
});
