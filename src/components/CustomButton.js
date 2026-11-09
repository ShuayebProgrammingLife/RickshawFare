import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'large',      // 'small', 'medium', 'large'
  style,
  textStyle,
}) {
  const { theme } = useSettings();

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.secondaryButton, { backgroundColor: theme.secondary }];
      case 'outline':
        return [styles.outlineButton, { borderColor: theme.primary }];
      case 'danger':
        return [styles.dangerButton, { backgroundColor: theme.primary + '20', borderColor: theme.primary }];
      default:
        return [styles.primaryButton, { backgroundColor: theme.primary, shadowColor: theme.primary }];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.outlineText, { color: theme.primary }];
      case 'danger':
        return [styles.dangerText, { color: theme.primary }];
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      default:
        return styles.largeButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: 13 };
      case 'medium':
        return { fontSize: 15 };
      default:
        return { fontSize: 18 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        (loading || disabled) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, getTextStyle(), getTextSizeStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButton: {
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  dangerButton: {
    borderWidth: 1,
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 25,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  outlineText: {
  },
  dangerText: {
  },
});