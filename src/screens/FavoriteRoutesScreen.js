import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import { showAlert } from '../utils/alert';

export default function FavoriteRoutesScreen({ navigation }) {
  const { theme, language, t } = useSettings();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesStr = await AsyncStorage.getItem('favoriteRoutes');
      if (favoritesStr) {
        setFavorites(JSON.parse(favoritesStr));
      }
    } catch (e) {
      console.log('Error loading favorites:', e);
    }
  };

  const removeFavorite = async (id) => {
    Alert.alert(
      language === 'bn' ? 'মুছে ফেলুন' : 'Remove Favorite',
      language === 'bn' ? 'আপনি কি এই রুটটি প্রিয় তালিকা থেকে মুছতে চান?' : 'Are you sure you want to remove this route?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          style: 'destructive',
          onPress: async () => {
            const updated = favorites.filter(f => f.id !== id);
            setFavorites(updated);
            await AsyncStorage.setItem('favoriteRoutes', JSON.stringify(updated));
            showAlert('✅', language === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Removed successfully');
          },
        },
      ]
    );
  };

  const useRoute = (route) => {
    // Navigate back to Home and pass the route data
    navigation.navigate('Home', {
      selectedRoute: route
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => useRoute(item)}
    >
      <View style={styles.cardInfo}>
        <View style={styles.routeHeader}>
          <Text style={[styles.cityBadge, { backgroundColor: theme.primary + '20', color: theme.primary }]}>
            {item.city.toUpperCase()}
          </Text>
          <Text style={[styles.distance, { color: theme.textSecondary }]}>
            {item.distance} {t('km')}
          </Text>
        </View>
        <View style={styles.routeRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={18} color={theme.accent} />
          <Text style={[styles.routeText, { color: theme.text }]} numberOfLines={1}>
            {item.from}
          </Text>
        </View>
        <View style={styles.routeDivider}>
          <View style={[styles.dotLine, { backgroundColor: theme.border }]} />
        </View>
        <View style={styles.routeRow}>
          <MaterialCommunityIcons name="map-marker-check" size={18} color={theme.primary} />
          <Text style={[styles.routeText, { color: theme.text }]} numberOfLines={1}>
            {item.to}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeFavorite(item.id)}
      >
        <MaterialCommunityIcons name="delete-outline" size={24} color="#ff4d4d" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={language === 'bn' ? 'প্রিয় রুটসমূহ' : 'Favorite Routes'}
        subtitle={language === 'bn' ? 'আপনার নিয়মিত যাতায়াতের পথ' : 'Your frequent travel paths'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="heart-outline" size={80} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {language === 'bn' ? 'কোনো প্রিয় রুট পাওয়া যায়নি' : 'No favorite routes found'}
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.addButtonText}>
                {language === 'bn' ? 'হোমে গিয়ে যোগ করুন' : 'Go to Home to add'}
              </Text>
            </TouchableOpacity>
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
  listContent: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  routeDivider: {
    height: 15,
    paddingLeft: 8,
  },
  dotLine: {
    width: 2,
    height: '100%',
    marginLeft: 0,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
