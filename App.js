import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
]);

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <AppNavigator />
    </>
  );
}