// 🚲 Bangladesh Transport Fare Data
// Last Updated: 2024

export const TRANSPORT_TYPES = {
  RICKSHAW: 'rickshaw',
  CNG: 'cng',
  BUS: 'bus',
  TEMPO: 'tempo',
  LEGUNA: 'leguna',
};

export const TRANSPORT_LABELS = {
  rickshaw: '🚲 রিকশা',
  cng: '🛺 সিএনজি',
  bus: '🚌 বাস',
  tempo: '🚐 টেম্পো',
  leguna: '🚙 লেগুনা',
};

// Per KM rates (BDT)
export const BASE_FARE_RATES = {
  rickshaw: {
    baseFare: 20,       // ন্যূনতম ভাড়া
    perKm: 10,          // প্রতি কিমি
    waitingPerMin: 2,   // প্রতি মিনিট অপেক্ষা
    nightSurcharge: 1.5, // রাতের বাড়তি (গুণক)
  },
  cng: {
    baseFare: 35,
    perKm: 14,
    waitingPerMin: 3,
    nightSurcharge: 1.5,
    flagFall: 25,       // মিটার চালু করতে
  },
  bus: {
    baseFare: 5,
    perKm: 2.0,
    acPerKm: 3.5,
    waitingPerMin: 0,
    nightSurcharge: 1.0,
  },
  tempo: {
    baseFare: 10,
    perKm: 4,
    waitingPerMin: 0,
    nightSurcharge: 1.0,
  },
  leguna: {
    baseFare: 10,
    perKm: 3.5,
    waitingPerMin: 0,
    nightSurcharge: 1.0,
  },
};

// 🌍 Location-based multipliers (adjusts baseFare and perKm)
export const LOCATION_MULTIPLIERS = {
  dhaka_city: {
    rickshaw: 1.2, // Dhaka rickshaw fare is higher
  },
  gazipur: {
    rickshaw: 0.8, // Gazipur rickshaw fare is lower
  },
  rajshahi_city: {
    rickshaw: 1.1, // Rajshahi Sadar higher
    cng: 1.1,
  },
  naogaon: {
    rickshaw: 0.8, // Naogaon lower
    cng: 0.8,
  },
};

// 🏙️ Popular Routes
export const POPULAR_ROUTES = [
  {
    id: 1,
    city: 'dhaka',
    from: 'মিরপুর-১০',
    to: 'মতিঝিল',
    distance: 14.5,
    fares: { rickshaw: null, cng: 250, bus: 35 },
    landmarks: ['ফার্মগেট', 'শাহবাগ', 'প্রেসক্লাব'],
  },
  {
    id: 2,
    city: 'dhaka',
    from: 'গুলশান-২',
    to: 'বনানী',
    distance: 3.2,
    fares: { rickshaw: 50, cng: 80, bus: 10 },
    landmarks: ['গুলশান সার্কেল', 'বনানী চেয়ারম্যান বাড়ি'],
  },
  {
    id: 3,
    city: 'dhaka',
    from: 'ধানমন্ডি',
    to: 'নিউমার্কেট',
    distance: 2.0,
    fares: { rickshaw: 30, cng: 60, bus: 8 },
    landmarks: ['ধানমন্ডি লেক', 'সায়েন্স ল্যাব'],
  },
  {
    id: 4,
    city: 'dhaka',
    from: 'উত্তরা',
    to: 'ফার্মগেট',
    distance: 15.0,
    fares: { rickshaw: null, cng: 300, bus: 40 },
    landmarks: ['বিমানবন্দর', 'কুড়িল', 'মহাখালী'],
  },
  {
    id: 5,
    city: 'dhaka',
    from: 'মিরপুর-১',
    to: 'মিরপুর-১০',
    distance: 4.5,
    fares: { rickshaw: 50, cng: 100, bus: 10, tempo: 15 },
    landmarks: ['মিরপুর জাতীয় উদ্যান', 'মিরপুর স্টেডিয়াম'],
  },
  {
    id: 11,
    city: 'rajshahi',
    from: 'রেল স্টেশন',
    to: 'জিরো পয়েন্ট',
    distance: 1.8,
    fares: { rickshaw: 25, cng: 50 },
    landmarks: ['সাহেব বাজার'],
  },
  {
    id: 12,
    city: 'rajshahi',
    from: 'বিনোদপুর',
    to: 'তালাইমারী',
    distance: 2.5,
    fares: { rickshaw: 30, cng: 60 },
    landmarks: ['রাজশাহী বিশ্ববিদ্যালয়'],
  },
  {
    id: 13,
    city: 'chittagong',
    from: 'জিইসি মোড়',
    to: '২ নম্বর গেট',
    distance: 1.5,
    fares: { rickshaw: 20, cng: 50 },
    landmarks: ['বায়োজিদ বোস্তামী রোড'],
  },
  {
    id: 14,
    city: 'chittagong',
    from: 'আগ্রাবাদ',
    to: 'নিউমার্কেট (চট্ট)',
    distance: 4.2,
    fares: { rickshaw: 60, cng: 120, bus: 10 },
    landmarks: ['টাইগার পাস'],
  },
];

// 🕐 Peak Hour multipliers
export const PEAK_HOURS = {
  morning: { start: 7, end: 10, multiplier: 1.3 },
  evening: { start: 17, end: 20, multiplier: 1.3 },
  night: { start: 22, end: 6, multiplier: 1.5 },
};

// ⛽ Fuel Prices (BDT per liter) - can be updated from Firebase
export const FUEL_PRICES = {
  cng: 45,      // প্রতি ঘনমিটার
  diesel: 109,
  petrol: 130,
  octane: 135,
  lastUpdated: '2024-01-15',
};

// 💡 Bargaining Tips
export const BARGAINING_TIPS = [
  {
    id: 1,
    tip_bn: 'সবসময় ভাড়া জিজ্ঞেস করার আগে গন্তব্যের নাম বলুন',
    tip_en: 'Always mention destination before asking fare',
  },
  {
    id: 2,
    tip_bn: 'রাস্তার পাশে দাঁড়িয়ে রিকশা ডাকলে কম ভাড়া পাবেন, স্ট্যান্ড থেকে বেশি',
    tip_en: 'Hailing from road is cheaper than from stands',
  },
  {
    id: 3,
    tip_bn: 'বৃষ্টির সময় ভাড়া ১.৫ থেকে ২ গুণ বেড়ে যায়',
    tip_en: 'Fare increases 1.5x to 2x during rain',
  },
  {
    id: 4,
    tip_bn: 'অ্যাপে দেখানো ভাড়া রেফারেন্স হিসাবে দেখান রিকশাওয়ালাকে',
    tip_en: 'Show app fare as reference to driver',
  },
  {
    id: 5,
    tip_bn: 'একাধিক রিকশাওয়ালাকে জিজ্ঞেস করুন - সেরা দাম পাবেন',
    tip_en: 'Ask multiple drivers for best price',
  },
  {
    id: 6,
    tip_bn: 'পিক আওয়ারে (সকাল ৮-১০, বিকাল ৫-৮) ভাড়া বেশি হবে',
    tip_en: 'Peak hours have higher fares',
  },
  {
    id: 7,
    tip_bn: 'ছোট রাস্তা/গলি দিয়ে শর্টকাট জানলে ভাড়া কমান',
    tip_en: 'Know shortcuts to reduce fare',
  },
  {
    id: 8,
    tip_bn: 'সিএনজি-তে মিটারে চলতে বলুন, ভাড়া কম হতে পারে',
    tip_en: 'Ask CNG to run on meter',
  },
];

// 📍 Dhaka City Locations with Coordinates
export const DHAKA_PLACES = [
  { name: 'মিরপুর-১০', lat: 23.8069, lon: 90.3685 },
  { name: 'মিরপুর-১', lat: 23.7950, lon: 90.3530 },
  { name: 'মিরপুর-১২', lat: 23.8190, lon: 90.3660 },
  { name: 'মতিঝিল', lat: 23.7340, lon: 90.4170 },
  { name: 'গুলশান-২', lat: 23.7937, lon: 90.4143 },
  { name: 'গুলশান-১', lat: 23.7797, lon: 90.4133 },
  { name: 'বনানী', lat: 23.7946, lon: 90.4022 },
  { name: 'ধানমন্ডি', lat: 23.7465, lon: 90.3765 },
  { name: 'নিউমার্কেট', lat: 23.7335, lon: 90.3835 },
  { name: 'উত্তরা', lat: 23.8747, lon: 90.3960 },
  { name: 'ফার্মগেট', lat: 23.7570, lon: 90.3880 },
  { name: 'শাহবাগ', lat: 23.7390, lon: 90.3960 },
  { name: 'সদরঘাট', lat: 23.7079, lon: 90.4070 },
  { name: 'গুলিস্তান', lat: 23.7230, lon: 90.4120 },
  { name: 'মোহাম্মদপুর', lat: 23.7590, lon: 90.3590 },
  { name: 'বাড্ডা', lat: 23.7811, lon: 90.4260 },
  { name: 'রামপুরা', lat: 23.7635, lon: 90.4280 },
  { name: 'যাত্রাবাড়ী', lat: 23.7100, lon: 90.4325 },
  { name: 'সায়েদাবাদ', lat: 23.7148, lon: 90.4260 },
  { name: 'বিমানবন্দর', lat: 23.8510, lon: 90.3980 },
  { name: 'মহাখালী', lat: 23.7790, lon: 90.4000 },
];

// 📍 Rajshahi City Locations
export const RAJSHAHI_PLACES = [
  { name: 'জিরো পয়েন্ট', lat: 24.3636, lon: 88.6017 },
  { name: 'রেল স্টেশন', lat: 24.3745, lon: 88.6042 },
  { name: 'নওদাপাড়া', lat: 24.4025, lon: 88.6145 },
  { name: 'বিনোদপুর', lat: 24.3642, lon: 88.6295 },
  { name: 'তালাইমারী', lat: 24.3615, lon: 88.6225 },
  { name: 'লক্ষ্মীপুর', lat: 24.3715, lon: 88.5875 },
  { name: 'কোর্ট স্টেশন', lat: 24.3695, lon: 88.5675 },
];

// 📍 Chittagong City Locations
export const CHITTAGONG_PLACES = [
  { name: 'জিইসি মোড়', lat: 22.3592, lon: 91.8215 },
  { name: '২ নম্বর গেট', lat: 22.3667, lon: 91.8258 },
  { name: 'আগ্রাবাদ', lat: 22.3305, lon: 91.8125 },
  { name: 'চকবাজার', lat: 22.3555, lon: 91.8365 },
  { name: 'বহদ্দারহাট', lat: 22.3725, lon: 91.8445 },
  { name: 'পতেঙ্গা', lat: 22.2535, lon: 91.7925 },
  { name: 'নিউমার্কেট (চট্ট)', lat: 22.3355, lon: 91.8315 },
];

// 📍 Sylhet City Locations
export const SYLHET_PLACES = [
  { name: 'জিন্দাবাজার', lat: 24.8949, lon: 91.8687 },
  { name: 'বন্দরবাজার', lat: 24.8897, lon: 91.8697 },
  { name: 'আম্বরখানা', lat: 24.9048, lon: 91.8682 },
  { name: 'টিলাগড়', lat: 24.8950, lon: 91.8980 },
  { name: 'মদিনা মার্কেট', lat: 24.8980, lon: 91.8480 },
  { name: 'কদমতলী', lat: 24.8820, lon: 91.8680 },
  { name: 'শিবগঞ্জ', lat: 24.8920, lon: 91.8880 },
];

export const CITY_PLACES = {
  dhaka: DHAKA_PLACES,
  rajshahi: RAJSHAHI_PLACES,
  chittagong: CHITTAGONG_PLACES,
  sylhet: SYLHET_PLACES,
};

// Add Sylhet routes to POPULAR_ROUTES
POPULAR_ROUTES.push(
  {
    id: 21,
    city: 'sylhet',
    from: 'জিন্দাবাজার',
    to: 'টিলাগড়',
    distance: 3.5,
    fares: { rickshaw: 50, cng: 100 },
    landmarks: ['নাইওরপুল', 'শিবগঞ্জ'],
  },
  {
    id: 22,
    city: 'sylhet',
    from: 'বন্দরবাজার',
    to: 'আম্বরখানা',
    distance: 2.0,
    fares: { rickshaw: 30, cng: 60 },
    landmarks: ['জিন্দাবাজার', 'চৌহাট্টা'],
  },
  {
    id: 23,
    city: 'sylhet',
    from: 'কদমতলী',
    to: 'জিন্দাবাজার',
    distance: 2.5,
    fares: { rickshaw: 40, cng: 80 },
    landmarks: ['সুরমা ব্রিজ'],
  }
);

// 📏 Haversine formula to calculate distance between two points in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// 🏙️ Cities supported
export const SUPPORTED_CITIES = [
  { id: 'dhaka', name_bn: 'ঢাকা', name_en: 'Dhaka', active: true },
  { id: 'chittagong', name_bn: 'চট্টগ্রাম', name_en: 'Chittagong', active: true },
  { id: 'sylhet', name_bn: 'সিলেট', name_en: 'Sylhet', active: true },
  { id: 'rajshahi', name_bn: 'রাজশাহী', name_en: 'Rajshahi', active: true },
  { id: 'khulna', name_bn: 'খুলনা', name_en: 'Khulna', active: false },
];

export const BUS_ROUTES = [
  {
    id: 1,
    name: 'মিরপুর-১০ থেকে মতিঝিল',
    bus_name: 'বিকল্প অটো সার্ভিস',
    fare: 35,
    stops: ['মিরপুর-১০', 'কাজীপাড়া', 'শেওড়াপাড়া', 'ফার্মগেট', 'শাহবাগ', 'মতিঝিল'],
    city: 'dhaka'
  },
  {
    id: 2,
    name: 'উত্তরা থেকে আজিমপুর',
    bus_name: 'বিকাশ পরিবহন',
    fare: 45,
    stops: ['উত্তরা', 'বিমানবন্দর', 'খিলক্ষেত', 'মহাখালী', 'ফার্মগেট', 'শাহবাগ', 'আজিমপুর'],
    city: 'dhaka'
  },
  {
    id: 3,
    name: 'মোহাম্মদপুর থেকে বাড্ডা',
    bus_name: 'তরঙ্গ প্লাস',
    fare: 25,
    stops: ['মোহাম্মদপুর', 'শংকর', 'ধানমন্ডি-২৭', 'ফার্মগেট', 'মহাখালী', 'বাড্ডা'],
    city: 'dhaka'
  },
  {
    id: 4,
    name: 'আব্দুল্লাহপুর থেকে মতিঝিল',
    bus_name: 'ভিক্টর ক্লাসিক',
    fare: 50,
    stops: ['আব্দুল্লাহপুর', 'উত্তরা', 'বিমানবন্দর', 'নতুন বাজার', 'বাড্ডা', 'রামপুরা', 'মতিঝিল'],
    city: 'dhaka'
  }
];