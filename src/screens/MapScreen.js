import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import MapComponent from '../components/MapComponent';
import { POPULAR_ROUTES } from '../data/fareData';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import { getAreasForDistrict } from '../data/bangladeshLocations';

const { width, height } = Dimensions.get('window');
const DEFAULT_REGION = {
  latitude: 23.6850,
  longitude: 90.3563,
  latitudeDelta: 0.6,
  longitudeDelta: 0.6,
};
const QUICK_ROUTE_CITY_BY_DISTRICT = {
  dhaka_city: 'dhaka',
  chittagong_city: 'chittagong',
  rajshahi_city: 'rajshahi',
  sylhet_city: 'sylhet',
};

export default function MapScreen({ navigation }) {
  const { theme, t, darkMode, defaultCity, defaultDistrict, language } = useSettings();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const quickRouteCity = defaultDistrict ? QUICK_ROUTE_CITY_BY_DISTRICT[defaultDistrict.id] : defaultCity;
  
  const mappedLocations = useMemo(() => {
    const districtAreas = defaultDistrict ? getAreasForDistrict(defaultDistrict) : [];
    return districtAreas
      .filter((place) => place.lat !== null && place.lon !== null)
      .map((place, idx) => ({
        id: idx,
        name: language === 'bn' ? place.name_bn : place.name_en,
        lat: place.lat,
        lon: place.lon,
        color: ['#e94560', '#4ecca3', '#0984e3', '#fd79a8', '#00cec9', '#e17055'][idx % 6],
      }));
  }, [defaultDistrict, language]);

  // Update region when district changes
  useEffect(() => {
    if (mappedLocations.length > 0) {
      setRegion({
        latitude: mappedLocations[0].lat,
        longitude: mappedLocations[0].lon,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    } else {
      setRegion(DEFAULT_REGION);
    }
  }, [mappedLocations]);

  const filteredRoutes = quickRouteCity ? POPULAR_ROUTES.filter((r) => r.city === quickRouteCity) : [];

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title={t('map')} 
        subtitle={
          defaultDistrict
            ? `${language === 'bn' ? defaultDistrict.name_bn : defaultDistrict.name_en} ${t('city_map')}`
            : `${defaultCity.charAt(0).toUpperCase() + defaultCity.slice(1)} ${t('city_map')}`
        }
      />

      <View style={[styles.mapWrapper, { borderColor: theme.border }]}>
        <MapComponent 
          region={region} 
          theme={theme} 
          darkMode={darkMode} 
          locations={mappedLocations} 
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Routes List */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>📍 {t('popular_routes')}</Text>

        {filteredRoutes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={[
              styles.routeCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedRoute?.id === route.id && { borderColor: theme.primary, borderWidth: 2 },
            ]}
            onPress={() => setSelectedRoute(route)}
          >
            <View style={styles.routeHeader}>
              <View style={styles.routeLocations}>
                <View style={styles.routeFromTo}>
                  <View style={[styles.routeDot, { backgroundColor: theme.accent }]} />
                  <Text style={[styles.routeLocationText, { color: theme.text }]}>{route.from}</Text>
                </View>
                <Text style={[styles.routeArrowLarge, { color: theme.textSecondary }]}>↓</Text>
                <View style={styles.routeFromTo}>
                  <View style={[styles.routeDot, { backgroundColor: theme.primary }]} />
                  <Text style={[styles.routeLocationText, { color: theme.text }]}>{route.to}</Text>
                </View>
              </View>
              <View style={[styles.routeDistanceContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.routeDistanceValue, { color: theme.primary }]}>{route.distance}</Text>
                <Text style={[styles.routeDistanceUnit, { color: theme.textSecondary }]}>{t('km')}</Text>
              </View>
            </View>

            {/* Landmarks */}
            {route.landmarks && (
              <View style={[styles.landmarksContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.landmarksLabel, { color: theme.textSecondary }]}>📍 {t('popular_landmarks')}:</Text>
                <Text style={[styles.landmarksText, { color: theme.textSecondary }]}>
                  {route.landmarks.join(' → ')}
                </Text>
              </View>
            )}

            {/* Fares */}
            {selectedRoute?.id === route.id && (
              <View style={[styles.routeFares, { backgroundColor: theme.background }]}>
                <Text style={[styles.routeFaresTitle, { color: theme.warning }]}>💰 {t('estimated_fare')}:</Text>
                <View style={styles.routeFaresGrid}>
                  {route.fares.rickshaw !== null && route.fares.rickshaw !== undefined && (
                    <View style={[styles.routeFareItem, { backgroundColor: theme.card }]}>
                      <Text style={styles.routeFareIcon}>🚲</Text>
                      <Text style={[styles.routeFareValue, { color: theme.accent }]}>৳{route.fares.rickshaw}</Text>
                    </View>
                  )}
                  {route.fares.cng !== null && route.fares.cng !== undefined && (
                    <View style={[styles.routeFareItem, { backgroundColor: theme.card }]}>
                      <Text style={styles.routeFareIcon}>🛺</Text>
                      <Text style={[styles.routeFareValue, { color: theme.accent }]}>৳{route.fares.cng}</Text>
                    </View>
                  )}
                  {route.fares.bus !== null && route.fares.bus !== undefined && (
                    <View style={[styles.routeFareItem, { backgroundColor: theme.card }]}>
                      <Text style={styles.routeFareIcon}>🚌</Text>
                      <Text style={[styles.routeFareValue, { color: theme.accent }]}>৳{route.fares.bus}</Text>
                    </View>
                  )}
                  {route.fares.tempo !== null && route.fares.tempo !== undefined && (
                    <View style={[styles.routeFareItem, { backgroundColor: theme.card }]}>
                      <Text style={styles.routeFareIcon}>🚐</Text>
                      <Text style={[styles.routeFareValue, { color: theme.accent }]}>৳{route.fares.tempo}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredRoutes.length === 0 && (
          <View style={[styles.routeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.landmarksText, { color: theme.textSecondary }]}>
              {language === 'bn'
                ? 'এই জেলার জন্য এখনো preset route যোগ করা হয়নি।'
                : 'Preset routes are not available for this district yet.'}
            </Text>
          </View>
        )}

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
    padding: 15,
  },
  mapWrapper: {
    height: 350,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  routeCardSelected: {
    borderColor: '#e94560',
    borderWidth: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeLocations: {
    flex: 1,
  },
  routeFromTo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  routeLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  routeArrowLarge: {
    color: '#555',
    fontSize: 16,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeDistanceContainer: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  routeDistanceValue: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeDistanceUnit: {
    color: '#888',
    fontSize: 11,
  },
  landmarksContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
  landmarksLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  landmarksText: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 18,
  },
  routeFares: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
  },
  routeFaresTitle: {
    color: '#ffa500',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  routeFaresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  routeFareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  routeFareIcon: {
    fontSize: 16,
  },
  routeFareValue: {
    color: '#4ecca3',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
