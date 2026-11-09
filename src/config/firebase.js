import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvWS2fHPhefTXbi1Uh5WNthFKzv06VnjE",
  authDomain: "rickshawfare.firebaseapp.com",
  projectId: "rickshawfare",
  storageBucket: "rickshawfare.firebasestorage.app",
  messagingSenderId: "348626941998",
  appId: "1:348626941998:web:bc48cc0da4e72cb4c387bf",
  databaseURL: "https://rickshawfare-default-rtdb.firebaseio.com",
};

// Initialize Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Fallback if already initialized
  auth = getAuth(app);
}

export const db = getFirestore(app);
export const realTimeDb = getDatabase(app);

export { auth };
export default app;