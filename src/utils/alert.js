import { Alert, Platform } from 'react-native';

/**
 * Shows a platform-appropriate alert.
 * On Web, it uses window.alert or window.confirm.
 * On Mobile, it uses Alert.alert.
 * 
 * @param {string} title 
 * @param {string} message 
 * @param {Array} buttons Optional buttons (only for mobile and window.confirm logic)
 */
export const showAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // If there are buttons, we assume it's a confirmation
      const confirmButton = buttons.find(b => b.style !== 'cancel' && b.text !== 'না');
      if (window.confirm(`${title}\n\n${message}`)) {
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      } else {
        const cancelButton = buttons.find(b => b.style === 'cancel' || b.text === 'না');
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    } else {
      // Just a simple alert
      window.alert(`${title}\n\n${message}`);
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // On mobile, if no buttons are provided, add a default 'OK' button
    const finalButtons = buttons.length > 0 ? buttons : [{ text: 'OK' }];
    Alert.alert(title, message, finalButtons);
  }
};
