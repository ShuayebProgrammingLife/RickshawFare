import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  onSettingsPress,
}) {
  const { theme } = useSettings();
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Text style={[styles.backIcon, { color: theme.primary }]}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {onSettingsPress && (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 24,
  },
});