import { BASE_FARE_RATES, PEAK_HOURS, LOCATION_MULTIPLIERS } from '../data/fareData';

/**
 * 🧮 মূল ভাড়া হিসাব করার ফাংশন
 */
export const calculateFare = (transportType, distance, options = {}) => {
  const {
    isNight = false,
    isPeakHour = false,
    isRaining = false,
    passengers = 1,
    isAC = false,
    waitingMinutes = 0,
    locationId,
  } = options;

  let rates = { ...BASE_FARE_RATES[transportType] };
  if (!rates || Object.keys(rates).length === 0) return null;

  // Apply location multiplier if exists
  if (locationId && LOCATION_MULTIPLIERS[locationId] && LOCATION_MULTIPLIERS[locationId][transportType]) {
    const multiplier = LOCATION_MULTIPLIERS[locationId][transportType];
    rates.baseFare = rates.baseFare * multiplier;
    rates.perKm = rates.perKm * multiplier;
  }

  // মূল ভাড়া হিসাব
  let fare = rates.baseFare + (rates.perKm * distance);

  // AC bus fare
  if (transportType === 'bus' && isAC) {
    let acPerKm = rates.acPerKm;
    if (locationId && LOCATION_MULTIPLIERS[locationId] && LOCATION_MULTIPLIERS[locationId][transportType]) {
      acPerKm = acPerKm * LOCATION_MULTIPLIERS[locationId][transportType];
    }
    fare = rates.baseFare + (acPerKm * distance);
  }

  // Flag fall (CNG)
  if (rates.flagFall) {
    fare += rates.flagFall;
  }

  // Waiting charge
  if (waitingMinutes > 0 && rates.waitingPerMin > 0) {
    fare += waitingMinutes * rates.waitingPerMin;
  }

  // রাতের সারচার্জ
  if (isNight) {
    fare *= rates.nightSurcharge;
  }

  // পিক আওয়ার সারচার্জ
  if (isPeakHour) {
    fare *= 1.3;
  }

  // বৃষ্টির সারচার্জ (রিকশা/সিএনজি)
  if (isRaining && (transportType === 'rickshaw' || transportType === 'cng')) {
    fare *= 1.5;
  }

  // ট্রাফিক সারচার্জ
  if (options.trafficLevel === 'heavy') {
    fare *= 1.2;
  }

  // গোল করে দেওয়া (৫ এর গুণিতক)
  fare = Math.ceil(fare / 5) * 5;

  return {
    estimatedFare: fare,
    minFare: Math.floor(fare * 0.85 / 5) * 5,  // ন্যূনতম (bargain price)
    maxFare: Math.ceil(fare * 1.2 / 5) * 5,     // সর্বোচ্চ
    breakdown: {
      baseFare: rates.baseFare,
      distanceCharge: Math.round(rates.perKm * distance),
      waitingCharge: waitingMinutes * (rates.waitingPerMin || 0),
      flagFall: rates.flagFall || 0,
      surcharges: Math.round(fare - (rates.baseFare + rates.perKm * distance)),
    },
  };
};

/**
 * ⏰ বর্তমান সময় পিক আওয়ার কিনা চেক করা
 */
export const isPeakHourNow = () => {
  const hour = new Date().getHours();
  const { morning, evening } = PEAK_HOURS;

  if (hour >= morning.start && hour < morning.end) return true;
  if (hour >= evening.start && hour < evening.end) return true;
  return false;
};

/**
 * 🌙 রাত কিনা চেক করা
 */
export const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
};

/**
 * 🚲 ভাড়া তুলনা (সব পরিবহনের)
 */
export const compareAllFares = (distance, options = {}) => {
  const transportTypes = ['rickshaw', 'cng', 'bus', 'tempo', 'leguna'];
  const results = {};

  transportTypes.forEach((type) => {
    // রিকশায় ৮ কিমির বেশি যাওয়া অবাস্তব
    if (type === 'rickshaw' && distance > 8) {
      results[type] = { available: false, reason: 'রিকশায় এত দূর যাওয়া সম্ভব না' };
    } else {
      const fareResult = calculateFare(type, distance, options);
      results[type] = { available: true, ...fareResult };
    }
  });

  return results;
};

/**
 * 💡 Bargaining suggestion দেওয়া
 */
export const getBargainSuggestion = (transportType, estimatedFare) => {
  const bargainPrice = Math.floor(estimatedFare * 0.8 / 5) * 5;
  const startPrice = Math.floor(estimatedFare * 0.65 / 5) * 5;

  return {
    startWith: startPrice,         // এই দাম বলে শুরু করুন
    targetPrice: bargainPrice,     // এই দামে settle করুন
    maxPay: estimatedFare,         // এর বেশি দেবেন না
    tip: transportType === 'rickshaw'
      ? `প্রথমে ${startPrice}৳ বলুন, তারপর ${bargainPrice}৳-এ রাজি হন`
      : `মিটারে যেতে বলুন, না হলে ${bargainPrice}৳ অফার করুন`,
  };
};

/**
 * 📏 দুই পয়েন্টের মধ্যে দূরত্ব (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // ১ দশমিক পর্যন্ত
};

const toRad = (value) => (value * Math.PI) / 180;