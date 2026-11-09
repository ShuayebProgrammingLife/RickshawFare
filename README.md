# 🛺 RickshawFare

> **Smart Fare Calculator & Commute Assistant for Bangladesh**

[![Live Demo](https://img.shields.io/badge/Live_Demo-rickshawfare.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://rickshawfare.vercel.app)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo)](https://expo.dev/)

🌐 **Live Demo:** [https://rickshawfare.vercel.app](https://rickshawfare.vercel.app)

**RickshawFare** is a cross-platform mobile and web application built with **React Native** and **Expo**. It empowers daily commuters across Bangladesh to estimate fair rickshaw, CNG auto-rickshaw, and bus fares, negotiate with confidence using an interactive Bargain Bot, track routes on interactive maps, explore bus routes, and manage trip receipts.

---

## ✨ Features

- 🧮 **Accurate Fare Calculation**: Calculate standard fares based on distance, transport type (Rickshaw, CNG, Bus AC/Non-AC), peak hours, night charges, weather/rain conditions, and location-specific multipliers across Bangladesh.
- 🤖 **Bargain Bot (AI Assistant)**: Negotiate and get realistic bargaining tips and fair price suggestions to avoid being overcharged.
- 🗺️ **Interactive Route & Map**: View pickup and destination points on an interactive map with estimated distance, time, and step-by-step route guidance.
- 🚌 **Bus Routes & Fare Chart**: Access official routes and fares for popular city buses.
- 🧾 **Digital Receipts**: Generate clean digital trip receipts with printable PDF export and sharing (`expo-print` & `expo-sharing`).
- 📍 **Bangladesh Location Directory**: Pre-configured locations across Dhaka and major Bangladeshi cities.
- 📢 **Complaint & Feedback System**: Report overcharging, route violations, or misbehavior.
- 🔐 **Authentication & User Profiles**: User registration, login, and profile management powered by Firebase.
- ⭐ **Saved Favorites & Ride History**: Bookmark frequently traveled routes and review past trip expenses.
- 🛠️ **Admin Dashboard**: Manage fare rates, inspect complaints, and view app metrics.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Language**: JavaScript (ES6+) / React 19
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Native Stack & Bottom Tabs)
- **Maps & Geolocation**: `react-native-maps`, `expo-location`
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **State & Storage**: React Context API, `@react-native-async-storage/async-storage`
- **UI & Animations**: `react-native-reanimated`, `expo-linear-gradient`, `react-native-vector-icons`
- **PDF & Export**: `expo-print`, `expo-sharing`

---

## 📁 Project Structure

```text
RickshawFare/
├── App.js                   # Root application entry
├── package.json             # Dependencies and scripts
├── .gitignore               # Ignored files (node_modules, credentials, etc.)
└── src/
    ├── assets/              # Logos, rickshaw icons, and graphics
    ├── components/          # Reusable UI components (FareCard, Map, Header, etc.)
    ├── config/              # Firebase configuration
    ├── context/             # Global Contexts (Auth, Settings, Toast)
    ├── data/                # Bangladesh locations & base fare data
    ├── navigation/          # Navigation stacks and tab navigators
    ├── screens/             # Application screens:
    │   ├── HomeScreen.js
    │   ├── BargainBotScreen.js
    │   ├── MapScreen.js
    │   ├── BusRouteScreen.js
    │   ├── FareChartScreen.js
    │   ├── ComplaintScreen.js
    │   ├── HistoryScreen.js
    │   ├── FavoriteRoutesScreen.js
    │   ├── LocationPickerScreen.js
    │   ├── ProfileScreen.js
    │   ├── SettingsScreen.js
    │   ├── LoginScreen.js & RegisterScreen.js
    │   └── AdminDashboardScreen.js & AdminLoginScreen.js
    └── utils/               # Fare calculator engine and helpers
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app installed on your Android or iOS device (optional, for physical device testing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShuayebHossainEng/RickshawFare.git
   cd RickshawFare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device or simulator:**
   - Press `a` to open on an Android emulator.
   - Press `i` to open on an iOS simulator (macOS required).
   - Press `w` to open in a web browser.
   - Scan the QR code displayed in the terminal using the **Expo Go** app on your phone.

---

## ⚙️ Configuration

To connect your own Firebase project:
1. Create a project on the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and **Cloud Firestore**.
3. Update your Firebase credentials in [`src/config/firebase.js`](src/config/firebase.js).

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve fare calculations, add new routes, or fix bugs:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m "Add NewFeature"`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

