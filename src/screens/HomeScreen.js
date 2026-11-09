import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateFare, compareAllFares, isPeakHourNow, isNightTime, getBargainSuggestion } from '../utils/fareCalculator';
import { TRANSPORT_LABELS, BARGAINING_TIPS, POPULAR_ROUTES, calculateDistance } from '../data/fareData';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Header from '../components/Header';
import FareCard from '../components/FareCard';
import { showAlert } from '../utils/alert';
import { useSettings } from '../context/SettingsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Linking from 'expo-linking';
import ReceiptModal from '../components/ReceiptModal';
import * as Sharing from 'expo-sharing';
import { getAreasForDistrict } from '../data/bangladeshLocations';

const { width } = Dimensions.get('window');
const QUICK_ROUTE_CITY_BY_DISTRICT = {
  dhaka_city: 'dhaka',
  chittagong_city: 'chittagong',
  rajshahi_city: 'rajshahi',
  sylhet_city: 'sylhet',
};

export default function HomeScreen({ navigation }) {
  const { theme, t, language, defaultCity, defaultTransport, defaultDistrict, defaultDivision } = useSettings();
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [distance, setDistance] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('rickshaw');
  const [isMultiLeg, setIsMultiLeg] = useState(false);
  const [legs, setLegs] = useState([{ id: '1', transport: 'bus', distance: '' }]);
  const [fareResult, setFareResult] = useState(null);
  const [allFares, setAllFares] = useState(null);
  const [showAllFares, setShowAllFares] = useState(false);
  const [bargainTip, setBargainTip] = useState(null);
  const [isPeak, setIsPeak] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [trafficLevel, setTrafficLevel] = useState('normal'); // normal, heavy, light
  const [userName, setUserName] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const activeScopeId = defaultDistrict?.id || defaultCity;
  const activeScopeLabel = defaultDistrict
    ? (language === 'bn' ? defaultDistrict.name_bn : defaultDistrict.name_en)
    : defaultCity;
  const quickRouteCity = defaultDistrict ? QUICK_ROUTE_CITY_BY_DISTRICT[defaultDistrict.id] : defaultCity;
  const quickRoutes = quickRouteCity ? POPULAR_ROUTES.filter((route) => route.city === quickRouteCity) : [];
  const currentDistrictAreas = useMemo(() => defaultDistrict ? getAreasForDistrict(defaultDistrict) : [], [defaultDistrict]);

  // Reset locations when district/city changes
  useEffect(() => {
    setFromLocation(null);
    setToLocation(null);
    setFromCoords(null);
    setToCoords(null);
    setDistance('');
  }, [defaultDistrict, defaultCity]);

  // Set default transport from settings
  useEffect(() => {
    if (defaultTransport) {
      setSelectedTransport(defaultTransport);
    }
  }, [defaultTransport]);

  // Auto calculate distance when from/to change (old dropdown flow)
  useEffect(() => {
    if (fromLocation && toLocation && currentDistrictAreas.length > 0) {
      const places = currentDistrictAreas;
      const start = places.find((p) => p.name === fromLocation || p.name_bn === fromLocation || p.name_en === fromLocation);
      const end = places.find((p) => p.name === toLocation || p.name_bn === toLocation || p.name_en === toLocation);
      if (start && end && start.lat !== null && start.lon !== null && end.lat !== null && end.lon !== null) {
        const dist = calculateDistance(start.lat, start.lon, end.lat, end.lon);
        setDistance(dist.toString());
        checkIfFavorite(fromLocation, toLocation);
      }
    }
  }, [fromLocation, toLocation, currentDistrictAreas]);

  // Auto calculate distance from coords (new LocationPicker flow)
  useEffect(() => {
    if (fromCoords && toCoords) {
      const dist = calculateDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
      setDistance(dist.toString());
    }
  }, [fromCoords, toCoords]);

  const checkIfFavorite = async (from, to) => {
    try {
      const favoritesStr = await AsyncStorage.getItem('favoriteRoutes');
      if (favoritesStr) {
        const favorites = JSON.parse(favoritesStr);
        const exists = favorites.some(
          (f) => f.from === from && f.to === to && (f.scopeId || f.city) === activeScopeId
        );
        setIsFavorite(exists);
      }
    } catch (e) {
      console.log('Error checking favorite:', e);
    }
  };

  const toggleFavorite = async () => {
    if (!fromLocation || !toLocation) return;

    try {
      const favoritesStr = await AsyncStorage.getItem('favoriteRoutes');
      let favorites = favoritesStr ? JSON.parse(favoritesStr) : [];

      if (isFavorite) {
        favorites = favorites.filter(
          (f) => !(f.from === fromLocation && f.to === toLocation && (f.scopeId || f.city) === activeScopeId)
        );
        setIsFavorite(false);
        showAlert('✅', language === 'bn' ? 'প্রিয় রুট থেকে সরানো হয়েছে' : 'Removed from favorites');
      } else {
        const newFav = {
          id: Date.now().toString(),
          from: fromLocation,
          to: toLocation,
          distance: distance,
          city: activeScopeLabel,
          scopeId: activeScopeId,
          scopeLabel: activeScopeLabel,
        };
        favorites.push(newFav);
        setIsFavorite(true);
        showAlert('💖', language === 'bn' ? 'প্রিয় রুটে যোগ করা হয়েছে' : 'Added to favorites');
      }
      await AsyncStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
    } catch (e) {
      console.log('Error toggling favorite:', e);
    }
  };

  useEffect(() => {
    loadUserData();
    setIsPeak(isPeakHourNow());
    setIsNight(isNightTime());

    // Rotate tips every 5 seconds
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % BARGAINING_TIPS.length);
    }, 5000);

    // Mock traffic update
    const trafficLevels = ['normal', 'heavy', 'light'];
    setTrafficLevel(trafficLevels[Math.floor(Math.random() * trafficLevels.length)]);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    checkAutoWeather();
  }, [defaultDistrict, defaultCity]);

  const checkAutoWeather = async () => {
    try {
      const settingsStr = await AsyncStorage.getItem('appSettings');
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      
      if (settings.autoDetectWeather !== false) {
        // Here we would normally call a Weather API
        // For now, we simulate a check
        // In a real app: const weather = await fetchWeather(city);
        
        // Mock: 10% chance of rain for demo purposes
        const mockRain = Math.random() > 0.9;
        if (mockRain) {
          setIsRaining(true);
          showAlert('🌧️', language === 'bn' ? 'বৃষ্টি হচ্ছে বলে মনে হচ্ছে, ভাড়া সমন্বয় করা হয়েছে' : 'It seems to be raining, fare has been adjusted');
        }
      }
    } catch (e) {
      console.log('Weather detection error:', e);
    }
  };

  const loadUserData = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name || 'User');
  };

  // Handle route selection from FavoriteRoutesScreen
  useEffect(() => {
    if (navigation.getState().routes.find(r => r.name === 'Home')?.params?.selectedRoute) {
      const route = navigation.getState().routes.find(r => r.name === 'Home').params.selectedRoute;
      setFromLocation(route.from);
      setToLocation(route.to);
      setDistance(route.distance.toString());
      navigation.setParams({ selectedRoute: null });
      setTimeout(() => { handleCalculateFare(); }, 500);
    }
  }, [navigation.getState().routes.find(r => r.name === 'Home')?.params?.selectedRoute]);

  // Handle location picked from LocationPickerScreen
  useEffect(() => {
    const params = navigation.getState().routes.find(r => r.name === 'Home')?.params;
    if (params?.pickedLocation && params?.mode) {
      const picked = params.pickedLocation;
      const label = picked.district && picked.district !== picked.name
        ? `${picked.name}, ${picked.district}`
        : picked.name;

      if (params.mode === 'from') {
        setFromLocation(label);
        setFromCoords(picked.lat && picked.lon ? { lat: picked.lat, lon: picked.lon } : null);
      } else {
        setToLocation(label);
        setToCoords(picked.lat && picked.lon ? { lat: picked.lat, lon: picked.lon } : null);
      }
      navigation.setParams({ pickedLocation: null, mode: null });
    }
  }, [navigation.getState().routes.find(r => r.name === 'Home')?.params?.pickedLocation]);

  const openDistrictAreaPicker = (mode) => {
    if (!defaultDivision || !defaultDistrict) {
      showAlert(
        '📍',
        language === 'bn'
          ? 'আগে Settings থেকে বিভাগ ও জেলা নির্বাচন করুন'
          : 'Please select division and district from Settings first'
      );
      return;
    }

    navigation.navigate('LocationPicker', {
      mode,
      lockedDivision: defaultDivision,
      lockedDistrict: defaultDistrict,
    });
  };

  const handleCalculateFare = () => {
    const options = {
      isNight,
      isPeakHour: isPeak,
      isRaining,
      trafficLevel,
      locationId: activeScopeId,
    };

    if (isMultiLeg) {
      let totalEstimated = 0;
      let totalMin = 0;
      let totalMax = 0;
      let breakdown = { baseFare: 0, distanceCharge: 0, waitingCharge: 0, flagFall: 0, surcharges: 0 };
      
      let valid = true;
      let totalDist = 0;

      for (let leg of legs) {
        const legDist = parseFloat(leg.distance);
        if (!legDist || legDist <= 0) {
          showAlert('⚠️', language === 'bn' ? 'সকল লেগের সঠিক দূরত্ব দিন' : 'Please enter valid distances for all legs');
          valid = false;
          break;
        }
        totalDist += legDist;
        const res = calculateFare(leg.transport, legDist, options);
        if (res) {
          totalEstimated += res.estimatedFare;
          totalMin += res.minFare;
          totalMax += res.maxFare;
          breakdown.baseFare += res.breakdown.baseFare;
          breakdown.distanceCharge += res.breakdown.distanceCharge;
          breakdown.waitingCharge += res.breakdown.waitingCharge;
          breakdown.flagFall += res.breakdown.flagFall;
          breakdown.surcharges += res.breakdown.surcharges;
        } else {
          valid = false;
          break;
        }
      }
      if (!valid) return;
      if (totalDist > 50) {
        showAlert('⚠️', language === 'bn' ? 'মোট দূরত্ব ৫০ কিমির বেশি হতে পারে না' : 'Total distance cannot exceed 50 km');
        return;
      }
      
      const combinedResult = {
        estimatedFare: totalEstimated,
        minFare: totalMin,
        maxFare: totalMax,
        breakdown
      };
      setFareResult(combinedResult);
      setAllFares(null);
      setBargainTip(null);
      saveTripToHistory(totalDist, combinedResult);
    } else {
      const dist = parseFloat(distance);
      if (!dist || dist <= 0) {
        showAlert('⚠️', language === 'bn' ? 'সঠিক দূরত্ব দিন (কিমি)' : 'Please enter a valid distance (km)');
        return;
      }

      if (dist > 50) {
        showAlert('⚠️', language === 'bn' ? 'দূরত্ব ৫০ কিমির বেশি হতে পারে না' : 'Distance cannot exceed 50 km');
        return;
      }

      const result = calculateFare(selectedTransport, dist, options);
      setFareResult(result);

      const all = compareAllFares(dist, options);
      setAllFares(all);

      if (result) {
        const bargain = getBargainSuggestion(selectedTransport, result.estimatedFare);
        setBargainTip(bargain);
      }
      saveTripToHistory(dist, result);
    }
  };

  const saveTripToHistory = async (dist, result) => {
    try {
      const historyStr = await AsyncStorage.getItem('tripHistory');
      const history = historyStr ? JSON.parse(historyStr) : [];

      const newTrip = {
        id: Date.now().toString(),
        from: fromLocation || 'অজানা',
        to: toLocation || 'অজানা',
        distance: dist,
        transport: selectedTransport,
        fare: result?.estimatedFare || 0,
        vehicleNumber: vehicleNumber || 'N/A',
        date: new Date().toISOString(),
        isPeak,
        isNight,
      };

      history.unshift(newTrip);
      // সর্বোচ্চ ৫০টা রাখা
      const trimmed = history.slice(0, 50);
      await AsyncStorage.setItem('tripHistory', JSON.stringify(trimmed));
    } catch (e) {
      console.log('History save error:', e);
    }
  };

  const handleQuickRoute = (route) => {
    setFromLocation(route.from);
    setToLocation(route.to);
    setDistance(route.distance.toString());
    const start = currentDistrictAreas.find((place) => place.name === route.from || place.name_bn === route.from || place.name_en === route.from);
    const end = currentDistrictAreas.find((place) => place.name === route.to || place.name_bn === route.to || place.name_en === route.to);
    setFromCoords(start?.lat !== null && start?.lon !== null ? { lat: start.lat, lon: start.lon } : null);
    setToCoords(end?.lat !== null && end?.lon !== null ? { lat: end.lat, lon: end.lon } : null);
  };

  const handleSOS = async () => {
    try {
      const settingsStr = await AsyncStorage.getItem('appSettings');
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      const number = settings.emergencyContact || '999';
      
      Alert.alert(
        '🆘 SOS',
        language === 'bn' ? `${number} নম্বরে কল করতে চান?` : `Do you want to call ${number}?`,
        [
          { text: t('cancel'), style: 'cancel' },
          { text: language === 'bn' ? 'কল করুন' : 'Call', onPress: () => Linking.openURL(`tel:${number}`) }
        ]
      );
    } catch (e) {
      console.log('SOS Error:', e);
    }
  };

  const handleShareFare = async () => {
    if (!fareResult) return;
    
    try {
      const message = language === 'bn' 
        ? `🚲 RickshawFare - ভাড়ার হিসাব\n\n📍 থেকে: ${fromLocation}\n📍 পর্যন্ত: ${toLocation}\n🚗 যানবাহন: ${TRANSPORT_LABELS[selectedTransport]}\n📏 দূরত্ব: ${distance} km\n💰 আনুমানিক ভাড়া: ৳${fareResult.estimatedFare}\n\nন্যায্য ভাড়া নিশ্চিত করতে RickshawFare ব্যবহার করুন! 🇧🇩`
        : `🚲 RickshawFare - Fare Estimate\n\n📍 From: ${fromLocation}\n📍 To: ${toLocation}\n🚗 Transport: ${TRANSPORT_LABELS[selectedTransport]}\n📏 Distance: ${distance} km\n💰 Estimated Fare: ৳${fareResult.estimatedFare}\n\nUse RickshawFare for fair fares! 🇧🇩`;
      
      const { Share } = require('react-native');
      await Share.share({
        message: message,
      });
    } catch (e) {
      console.log('Sharing Error:', e);
    }
  };

  const transportTypes = ['rickshaw', 'cng', 'bus', 'tempo', 'leguna'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={`${t('welcome')}, ${userName}!`}
        subtitle={t('today_where')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusBar}>
          {isPeak && (
            <View style={[styles.statusBadge, { backgroundColor: `${theme.warning}30` }]}>
              <Text style={[styles.statusText, { color: theme.warning }]}>🔥 {t('peak_hour')}</Text>
            </View>
          )}
          {isNight && (
            <View style={[styles.statusBadge, { backgroundColor: `${theme.primary}30` }]}>
              <Text style={[styles.statusText, { color: theme.primary }]}>🌙 {t('night')}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: isRaining ? `${theme.accent}30` : `${theme.textSecondary}30` },
            ]}
            onPress={() => setIsRaining(!isRaining)}
          >
            <Text style={[styles.statusText, { color: isRaining ? theme.accent : theme.textSecondary }]}>
              {isRaining ? `🌧️ ${t('raining')}` : `☀️ ${t('no_rain')}`}
            </Text>
          </TouchableOpacity>

          <View style={[styles.statusBadge, { backgroundColor: trafficLevel === 'heavy' ? `${theme.error}30` : `${theme.success}30` }]}>
            <Text style={[styles.statusText, { color: trafficLevel === 'heavy' ? theme.error : theme.success }]}>
              🚦 {trafficLevel === 'heavy' ? (language === 'bn' ? 'জ্যাম বেশি' : 'Heavy Traffic') : (language === 'bn' ? 'রাস্তা ক্লিয়ার' : 'Normal Traffic')}
            </Text>
          </View>
        </View>

        {/* 📍 Location Input */}
        <View style={[styles.locationCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>📍 {t('trip_info')}</Text>

          <View style={styles.locationInputContainer}>
            <View style={styles.locationDots}>
              <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              <View style={[styles.dotLine, { backgroundColor: theme.border }]} />
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            </View>
            <View style={styles.locationInputs}>
              <TouchableOpacity
                style={[styles.locationPickerBtn, { backgroundColor: theme.background, borderColor: fromLocation ? theme.accent : theme.border }]}
                onPress={() => openDistrictAreaPicker('from')}
              >
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={fromLocation ? theme.accent : theme.textSecondary} />
                <Text style={[styles.locationPickerText, { color: fromLocation ? theme.text : theme.textSecondary }]} numberOfLines={1}>
                  {fromLocation || (language === 'bn' ? 'এই জেলার কোন এলাকা থেকে?' : 'Pick starting area in this district')}
                </Text>
                {fromLocation && (
                  <TouchableOpacity onPress={() => { setFromLocation(null); setFromCoords(null); setDistance(''); }}>
                    <MaterialCommunityIcons name="close-circle" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <View style={styles.locationDivider} />
              <TouchableOpacity
                style={[styles.locationPickerBtn, { backgroundColor: theme.background, borderColor: toLocation ? theme.primary : theme.border }]}
                onPress={() => openDistrictAreaPicker('to')}
              >
                <MaterialCommunityIcons name="map-marker-check" size={20} color={toLocation ? theme.primary : theme.textSecondary} />
                <Text style={[styles.locationPickerText, { color: toLocation ? theme.text : theme.textSecondary }]} numberOfLines={1}>
                  {toLocation || (language === 'bn' ? 'এই জেলার কোন এলাকায় যাবেন?' : 'Pick destination area in this district')}
                </Text>
                {toLocation && (
                  <TouchableOpacity onPress={() => { setToLocation(null); setToCoords(null); setDistance(''); }}>
                    <MaterialCommunityIcons name="close-circle" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {defaultDivision && defaultDistrict && (
            <View style={[styles.selectedDistrictNote, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="map-marker-radius" size={18} color={theme.primary} />
              <Text style={[styles.selectedDistrictNoteText, { color: theme.textSecondary }]}>
                {language === 'bn'
                  ? `${defaultDivision.name_bn} বিভাগের ${defaultDistrict.name_bn} জেলার ভিতরে রুট নির্বাচন হচ্ছে`
                  : `Showing routes inside ${defaultDistrict.name_en}, ${defaultDivision.name_en}`}
              </Text>
            </View>
          )}

          {/* Distance Input */}
          <View style={styles.distanceContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[styles.distanceLabel, { color: theme.textSecondary }]}>📏 {t('distance')}</Text>
              <TouchableOpacity onPress={() => {
                setIsMultiLeg(!isMultiLeg);
                if (!isMultiLeg && legs.length === 1 && distance) {
                  setLegs([{ ...legs[0], distance: distance }]);
                }
              }}>
                <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                  {isMultiLeg ? (language === 'bn' ? 'সিঙ্গেল লেগ' : 'Single Leg') : (language === 'bn' ? 'মাল্টি-লেগ' : 'Multi-Leg')}
                </Text>
              </TouchableOpacity>
            </View>

            {!isMultiLeg ? (
              <View style={[styles.distanceInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.distanceInput, { color: theme.text }]}
                  placeholder="0.0"
                  placeholderTextColor={theme.textSecondary}
                  value={distance}
                  onChangeText={setDistance}
                  keyboardType="decimal-pad"
                />
                <Text style={[styles.distanceUnit, { color: theme.textSecondary }]}>{t('km')}</Text>
                <TouchableOpacity onPress={() => showAlert('🎤', 'Voice Search is coming soon!')} style={{ marginRight: 10 }}>
                  <MaterialCommunityIcons name="microphone" size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {legs.map((leg, index) => (
                  <View key={leg.id} style={{ marginBottom: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: theme.textSecondary }}>{language === 'bn' ? `লেগ ${index + 1}` : `Leg ${index + 1}`}</Text>
                      {legs.length > 1 && (
                        <TouchableOpacity onPress={() => setLegs(legs.filter(l => l.id !== leg.id))}>
                          <Text style={{ color: theme.error }}>{language === 'bn' ? 'মুছুন' : 'Remove'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={[styles.distanceInputWrapper, { backgroundColor: theme.background, borderColor: theme.border, marginTop: 5 }]}>
                      <TextInput
                        style={[styles.distanceInput, { color: theme.text }]}
                        placeholder="0.0"
                        placeholderTextColor={theme.textSecondary}
                        value={leg.distance}
                        onChangeText={(val) => {
                          const newLegs = [...legs];
                          newLegs[index].distance = val;
                          setLegs(newLegs);
                        }}
                        keyboardType="decimal-pad"
                      />
                      <Text style={[styles.distanceUnit, { color: theme.textSecondary }]}>{t('km')}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                      {transportTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.transportChip,
                            { backgroundColor: theme.background, borderColor: theme.border, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, height: 'auto' },
                            leg.transport === type && { backgroundColor: theme.primary, borderColor: theme.primary },
                          ]}
                          onPress={() => {
                            const newLegs = [...legs];
                            newLegs[index].transport = type;
                            setLegs(newLegs);
                          }}
                        >
                          <Text style={[
                            styles.transportChipText,
                            { color: theme.textSecondary, fontSize: 12 },
                            leg.transport === type && { color: '#fff' },
                          ]}>
                            {TRANSPORT_LABELS[type]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ))}
                <TouchableOpacity 
                  style={{ padding: 10, backgroundColor: theme.primary + '20', borderRadius: 8, alignItems: 'center' }}
                  onPress={() => setLegs([...legs, { id: Date.now().toString(), transport: 'rickshaw', distance: '' }])}
                >
                  <Text style={{ color: theme.primary }}>+ {language === 'bn' ? 'আরেকটি গাড়ি যোগ করুন' : 'Add another vehicle'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Vehicle Number Input */}
          <View style={styles.distanceContainer}>
            <Text style={[styles.distanceLabel, { color: theme.textSecondary }]}>🔢 {language === 'bn' ? 'যানবাহন নম্বর (ঐচ্ছিক)' : 'Vehicle Number (Optional)'}</Text>
            <View style={[styles.distanceInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                style={[styles.distanceInput, { color: theme.text, fontSize: 16 }]}
                placeholder={language === 'bn' ? 'যেমন: ঢাকা মেট্রো-হ...' : 'e.g. ঢাকা Metro-H...'}
                placeholderTextColor={theme.textSecondary}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
            </View>
          </View>

          {/* Favorite Toggle */}
          {fromLocation && toLocation && (
            <TouchableOpacity 
              style={[styles.favoriteButton, { backgroundColor: isFavorite ? theme.primary + '20' : 'transparent' }]} 
              onPress={toggleFavorite}
            >
              <MaterialCommunityIcons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.favoriteText, { color: isFavorite ? theme.primary : theme.textSecondary }]}>
                {isFavorite 
                  ? (language === 'bn' ? 'প্রিয় রুটে আছে' : 'In Favorites') 
                  : (language === 'bn' ? 'প্রিয় রুটে যোগ করুন' : 'Add to Favorites')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 🚲 Transport Selection */}
        {!isMultiLeg && (
          <View style={[styles.transportCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>🚗 {t('select_transport')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {transportTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.transportChip,
                    { backgroundColor: theme.background, borderColor: theme.border },
                    selectedTransport === type && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedTransport(type)}
                >
                  <Text
                    style={[
                      styles.transportChipText,
                      { color: theme.textSecondary },
                      selectedTransport === type && { color: '#fff' },
                    ]}
                  >
                    {TRANSPORT_LABELS[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 🔍 Quick Routes */}
        <View style={[styles.quickRouteCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>⚡ {t('popular_routes')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickRoutes.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={[styles.routeChip, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => handleQuickRoute(route)}
              >
                <Text style={[styles.routeFrom, { color: theme.accent }]}>{route.from}</Text>
                <Text style={[styles.routeArrow, { color: theme.textSecondary }]}>→</Text>
                <Text style={[styles.routeTo, { color: theme.primary }]}>{route.to}</Text>
                <Text style={[styles.routeDistance, { color: theme.textSecondary }]}>{route.distance} {t('km')}</Text>
              </TouchableOpacity>
            ))}
            {quickRoutes.length === 0 && (
              <View style={[styles.noRouteChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.noRouteChipText, { color: theme.textSecondary }]}>
                  {language === 'bn'
                    ? 'এই জেলার জন্য এখনো preset route নেই'
                    : 'No preset routes for this district yet'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 🧮 Calculate Button */}
        <TouchableOpacity 
          style={[styles.calculateButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
          onPress={handleCalculateFare}
        >
          <Text style={styles.calculateButtonText}>🧮 {t('calculate_fare')}</Text>
        </TouchableOpacity>

        {/* 💰 Fare Result */}
        {fareResult && (
          <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.resultTitle, { color: theme.text }]}>💰 {t('estimated_fare')}</Text>

            {/* Main Fare */}
            <View style={styles.mainFareContainer}>
              <Text style={[styles.mainFare, { color: theme.accent }]}>৳{fareResult.estimatedFare}</Text>
              <Text style={[styles.fareTransport, { color: theme.textSecondary }]}>
                {isMultiLeg ? (language === 'bn' ? 'মাল্টি-লেগ জার্নি' : 'Multi-Leg Journey') : TRANSPORT_LABELS[selectedTransport]}
              </Text>
            </View>

            {/* Fare Range */}
            <View style={[styles.fareRange, { backgroundColor: theme.background }]}>
              <View style={styles.fareRangeItem}>
                <Text style={[styles.fareRangeLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'ন্যূনতম' : 'Min'}</Text>
                <Text style={[styles.fareRangeValue, { color: theme.accent }]}>
                  ৳{fareResult.minFare}
                </Text>
              </View>
              <View style={[styles.fareRangeDivider, { backgroundColor: theme.border }]} />
              <View style={styles.fareRangeItem}>
                <Text style={[styles.fareRangeLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'আনুমানিক' : 'Est'}</Text>
                <Text style={[styles.fareRangeValue, { color: theme.warning }]}>
                  ৳{fareResult.estimatedFare}
                </Text>
              </View>
              <View style={[styles.fareRangeDivider, { backgroundColor: theme.border }]} />
              <View style={styles.fareRangeItem}>
                <Text style={[styles.fareRangeLabel, { color: theme.textSecondary }]}>{language === 'bn' ? 'সর্বোচ্চ' : 'Max'}</Text>
                <Text style={[styles.fareRangeValue, { color: theme.primary }]}>
                  ৳{fareResult.maxFare}
                </Text>
              </View>
            </View>

            {/* Fare Breakdown */}
            <View style={[styles.breakdownContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.breakdownTitle, { color: theme.text }]}>📊 {t('fare_breakdown')}</Text>
              <View style={[styles.breakdownRow, { borderBottomColor: theme.border + '30' }]}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{t('base_fare')}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>
                  ৳{fareResult.breakdown.baseFare}
                </Text>
              </View>
              <View style={[styles.breakdownRow, { borderBottomColor: theme.border + '30' }]}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{t('distance_charge')}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>
                  ৳{fareResult.breakdown.distanceCharge}
                </Text>
              </View>
              {fareResult.breakdown.flagFall > 0 && (
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border + '30' }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>ফ্ল্যাগ ফল</Text>
                  <Text style={[styles.breakdownValue, { color: theme.text }]}>
                    ৳{fareResult.breakdown.flagFall}
                  </Text>
                </View>
              )}
              {fareResult.breakdown.surcharges > 0 && (
                <View style={[styles.breakdownRow, { borderBottomColor: theme.border + '30' }]}>
                  <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{t('extra_charge')}</Text>
                  <Text style={[styles.breakdownValue, { color: theme.primary }]}>
                    ৳{fareResult.breakdown.surcharges}
                  </Text>
                </View>
              )}
            </View>

            {/* Bargaining Tips */}
            {bargainTip && (
              <View style={[styles.bargainContainer, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.bargainTitle, { color: '#fff' }]}>😎 {t('bargain_tips')}</Text>
                <Text style={[styles.bargainText, { color: '#ccc' }]}>{bargainTip.tip}</Text>
                <View style={styles.bargainPrices}>
                  <View style={styles.bargainPriceItem}>
                    <Text style={styles.bargainPriceLabel}>{t('start_with')}</Text>
                    <Text style={[styles.bargainPriceValue, { color: theme.accent }]}>
                      ৳{bargainTip.startWith}
                    </Text>
                  </View>
                  <Text style={[styles.bargainArrow, { color: theme.textSecondary }]}>→</Text>
                  <View style={styles.bargainPriceItem}>
                    <Text style={styles.bargainPriceLabel}>{t('target')}</Text>
                    <Text style={[styles.bargainPriceValue, { color: theme.warning }]}>
                      ৳{bargainTip.targetPrice}
                    </Text>
                  </View>
                  <Text style={[styles.bargainArrow, { color: theme.textSecondary }]}>→</Text>
                  <View style={styles.bargainPriceItem}>
                    <Text style={styles.bargainPriceLabel}>{t('max_pay')}</Text>
                    <Text style={[styles.bargainPriceValue, { color: theme.primary }]}>
                      ৳{bargainTip.maxPay}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.compareButton, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 10 }]}
              onPress={() => setShowReceipt(true)}
            >
              <Text style={[styles.compareButtonText, { color: theme.primary }]}>
                📄 {language === 'bn' ? 'রিসিট দেখুন' : 'View Receipt'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.compareButton, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 10 }]}
              onPress={handleShareFare}
            >
              <Text style={[styles.compareButtonText, { color: theme.accent }]}>
                🔗 {language === 'bn' ? 'ভাড়া শেয়ার করুন' : 'Share Fare'}
              </Text>
            </TouchableOpacity>

            {/* Compare All Fares */}
            <TouchableOpacity
              style={[styles.compareButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={() => setShowAllFares(!showAllFares)}
            >
              <Text style={[styles.compareButtonText, { color: theme.text }]}>
                {showAllFares ? `🔼 ${t('hide_compare')}` : `🔽 ${t('compare_all')}`}
              </Text>
            </TouchableOpacity>

            {showAllFares && allFares && (
              <View style={styles.allFaresContainer}>
                {Object.keys(allFares).map((type) => (
                  <FareCard
                    key={type}
                    type={type}
                    data={allFares[type]}
                    isSelected={type === selectedTransport}
                    onPress={() => setSelectedTransport(type)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* 💡 Tip of the day */}
        <View style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border, borderLeftColor: theme.warning }]}>
          <Text style={[styles.tipTitle, { color: theme.warning }]}>💡 {t('tip_of_day')}</Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {language === 'bn' ? BARGAINING_TIPS[currentTipIndex]?.tip_bn : BARGAINING_TIPS[currentTipIndex]?.tip_en}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Complaint')}
          >
            <Text style={styles.quickActionIcon}>⚠️</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{t('report_overcharge')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('FareChart')}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{t('fare_chart')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.quickActionIcon}>🗺️</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{t('map')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('FavoriteRoutes')}
          >
            <Text style={styles.quickActionIcon}>💖</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{language === 'bn' ? 'প্রিয় রুট' : 'Favorites'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('BusRoutes')}
          >
            <Text style={styles.quickActionIcon}>🚌</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{language === 'bn' ? 'বাস রুট' : 'Bus Routes'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('BargainBot')}
          >
            <Text style={styles.quickActionIcon}>🤖</Text>
            <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>{language === 'bn' ? 'দরদাম বট' : 'Bargain Bot'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sosButton, { shadowColor: '#ff4d4d' }]}
          onPress={handleSOS}
        >
          <LinearGradient
            colors={['#ff4d4d', '#cc0000']}
            style={styles.sosGradient}
          >
            <MaterialCommunityIcons name="alert-octagon" size={32} color="#fff" />
            <Text style={styles.sosText}>SOS</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ReceiptModal
          visible={showReceipt}
          onClose={() => setShowReceipt(false)}
          fareData={fareResult}
          routeData={{
            from: fromLocation || 'অজানা',
            to: toLocation || 'অজানা',
            distance: distance,
            transport: selectedTransport
          }}
          theme={theme}
          language={language}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  statusBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  locationInputContainer: {
    flexDirection: 'row',
  },
  locationDots: {
    width: 20,
    alignItems: 'center',
    paddingTop: 15,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotLine: {
    width: 2,
    height: 30,
    backgroundColor: '#0f3460',
    marginVertical: 4,
  },
  locationInputs: {
    flex: 1,
    marginLeft: 10,
  },
  locationInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  locationPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  locationPickerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  locationDivider: {
    height: 12,
  },
  selectedDistrictNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  selectedDistrictNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  distanceContainer: {
    marginTop: 15,
  },
  distanceLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  distanceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  distanceInput: {
    flex: 1,
    padding: 14,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceUnit: {
    color: '#888',
    fontSize: 14,
    marginRight: 15,
    fontWeight: '600',
  },
  transportCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  transportChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#1a1a2e',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#0f3460',
  },
  transportChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  transportChipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  transportChipTextActive: {
    color: '#fff',
  },
  quickRouteCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  routeChip: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  routeFrom: {
    color: '#4ecca3',
    fontSize: 13,
    fontWeight: '600',
  },
  routeArrow: {
    color: '#555',
    fontSize: 12,
    marginVertical: 2,
  },
  routeTo: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '600',
  },
  routeDistance: {
    color: '#888',
    fontSize: 11,
    marginTop: 5,
  },
  noRouteChip: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 180,
    borderWidth: 1,
    justifyContent: 'center',
  },
  noRouteChipText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  calculateButton: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  mainFareContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainFare: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  fareTransport: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  fareRange: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  fareRangeItem: {
    flex: 1,
    alignItems: 'center',
  },
  fareRangeLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 5,
  },
  fareRangeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fareRangeDivider: {
    width: 1,
    backgroundColor: '#0f3460',
  },
  breakdownContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#0f346030',
  },
  breakdownLabel: {
    color: '#888',
    fontSize: 13,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bargainContainer: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  bargainTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bargainText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  bargainPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bargainPriceItem: {
    alignItems: 'center',
  },
  bargainPriceLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 3,
  },
  bargainPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bargainArrow: {
    color: '#555',
    fontSize: 16,
  },
  compareButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  compareButtonText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  allFaresContainer: {
    marginTop: 15,
    gap: 10,
  },
  tipCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
  },
  tipTitle: {
    color: '#ffa500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  quickAction: {
    width: (width - 40) / 2 - 5,
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
    flexDirection: 'row',
    gap: 10,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sosButton: {
    borderRadius: 20,
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sosGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    gap: 12,
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
