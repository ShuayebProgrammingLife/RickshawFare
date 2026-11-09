import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapComponent = ({ region, theme, darkMode, locations }) => {
  // Dark mode map style
  const mapStyle = darkMode ? [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
  ] : [];

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      customMapStyle={mapStyle}
    >
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: loc.lat, longitude: loc.lon }}
          title={loc.name}
          pinColor={loc.color}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
