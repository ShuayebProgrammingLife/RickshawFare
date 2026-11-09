import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapComponent = ({ region, theme, darkMode, locations }) => {
  return (
    <View style={[styles.webMapFallback, { backgroundColor: theme.card }]}>
      <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>🗺️ Live Map Preview</Text>
      <Text style={{ color: theme.textSecondary, textAlign: 'center', paddingHorizontal: 20 }}>
        Real-time Google Maps integration is best viewed on Android/iOS.
      </Text>
      <View style={styles.webMapPlaceholder}>
        <Text style={{ fontSize: 60 }}>📍</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MapComponent;
