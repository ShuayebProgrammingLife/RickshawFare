// Bangladesh Division → District → Area Data

export const BANGLADESH_DIVISIONS = [
  { id: 'dhaka', name_bn: 'ঢাকা', name_en: 'Dhaka', emoji: '🏙️' },
  { id: 'chittagong', name_bn: 'চট্টগ্রাম', name_en: 'Chittagong', emoji: '⚓' },
  { id: 'rajshahi', name_bn: 'রাজশাহী', name_en: 'Rajshahi', emoji: '🏛️' },
  { id: 'khulna', name_bn: 'খুলনা', name_en: 'Khulna', emoji: '🌿' },
  { id: 'barishal', name_bn: 'বরিশাল', name_en: 'Barishal', emoji: '🚢' },
  { id: 'sylhet', name_bn: 'সিলেট', name_en: 'Sylhet', emoji: '🍃' },
  { id: 'rangpur', name_bn: 'রংপুর', name_en: 'Rangpur', emoji: '🌾' },
  { id: 'mymensingh', name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh', emoji: '🎓' },
];

const DIVISION_CENTER_POINTS = {
  dhaka: { lat: 23.8103, lon: 90.4125 },
  chittagong: { lat: 22.3569, lon: 91.7832 },
  rajshahi: { lat: 24.3745, lon: 88.6042 },
  khulna: { lat: 22.8456, lon: 89.5403 },
  barishal: { lat: 22.7010, lon: 90.3535 },
  sylhet: { lat: 24.8949, lon: 91.8687 },
  rangpur: { lat: 25.7468, lon: 89.2508 },
  mymensingh: { lat: 24.7471, lon: 90.4203 },
};

export const DISTRICTS_BY_DIVISION = {
  dhaka: [
    { id: 'dhaka_city', name_bn: 'ঢাকা', name_en: 'Dhaka' },
    { id: 'gazipur', name_bn: 'গাজীপুর', name_en: 'Gazipur' },
    { id: 'narayanganj', name_bn: 'নারায়ণগঞ্জ', name_en: 'Narayanganj' },
    { id: 'manikganj', name_bn: 'মানিকগঞ্জ', name_en: 'Manikganj' },
    { id: 'munshiganj', name_bn: 'মুন্সীগঞ্জ', name_en: 'Munshiganj' },
    { id: 'narsingdi', name_bn: 'নরসিংদী', name_en: 'Narsingdi' },
    { id: 'tangail', name_bn: 'টাঙ্গাইল', name_en: 'Tangail' },
    { id: 'kishoreganj', name_bn: 'কিশোরগঞ্জ', name_en: 'Kishoreganj' },
    { id: 'mymensingh_d', name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh' },
    { id: 'faridpur', name_bn: 'ফরিদপুর', name_en: 'Faridpur' },
    { id: 'madaripur', name_bn: 'মাদারীপুর', name_en: 'Madaripur' },
    { id: 'gopalganj', name_bn: 'গোপালগঞ্জ', name_en: 'Gopalganj' },
    { id: 'shariatpur', name_bn: 'শরীয়তপুর', name_en: 'Shariatpur' },
  ],
  chittagong: [
    { id: 'chittagong_city', name_bn: 'চট্টগ্রাম', name_en: 'Chittagong' },
    { id: 'coxsbazar', name_bn: "কক্সবাজার", name_en: "Cox's Bazar" },
    { id: 'rangamati', name_bn: 'রাঙামাটি', name_en: 'Rangamati' },
    { id: 'bandarban', name_bn: 'বান্দরবান', name_en: 'Bandarban' },
    { id: 'khagrachhari', name_bn: 'খাগড়াছড়ি', name_en: 'Khagrachhari' },
    { id: 'feni', name_bn: 'ফেনী', name_en: 'Feni' },
    { id: 'comilla', name_bn: 'কুমিল্লা', name_en: 'Comilla' },
    { id: 'chandpur', name_bn: 'চাঁদপুর', name_en: 'Chandpur' },
    { id: 'noakhali', name_bn: 'নোয়াখালী', name_en: 'Noakhali' },
    { id: 'lakshmipur', name_bn: 'লক্ষ্মীপুর', name_en: 'Lakshmipur' },
    { id: 'brahmanbaria', name_bn: 'ব্রাহ্মণবাড়িয়া', name_en: 'Brahmanbaria' },
  ],
  rajshahi: [
    { id: 'rajshahi_city', name_bn: 'রাজশাহী', name_en: 'Rajshahi' },
    { id: 'bogura', name_bn: 'বগুড়া', name_en: 'Bogura' },
    { id: 'chapainawabganj', name_bn: 'চাঁপাইনবাবগঞ্জ', name_en: 'Chapainawabganj' },
    { id: 'natore', name_bn: 'নাটোর', name_en: 'Natore' },
    { id: 'naogaon', name_bn: 'নওগাঁ', name_en: 'Naogaon' },
    { id: 'pabna', name_bn: 'পাবনা', name_en: 'Pabna' },
    { id: 'sirajganj', name_bn: 'সিরাজগঞ্জ', name_en: 'Sirajganj' },
    { id: 'joypurhat', name_bn: 'জয়পুরহাট', name_en: 'Joypurhat' },
  ],
  khulna: [
    { id: 'khulna_city', name_bn: 'খুলনা', name_en: 'Khulna' },
    { id: 'jessore', name_bn: 'যশোর', name_en: 'Jessore' },
    { id: 'satkhira', name_bn: 'সাতক্ষীরা', name_en: 'Satkhira' },
    { id: 'bagerhat', name_bn: 'বাগেরহাট', name_en: 'Bagerhat' },
    { id: 'narail', name_bn: 'নড়াইল', name_en: 'Narail' },
    { id: 'magura', name_bn: 'মাগুরা', name_en: 'Magura' },
    { id: 'jhenaidah', name_bn: 'ঝিনাইদহ', name_en: 'Jhenaidah' },
    { id: 'kushtia', name_bn: 'কুষ্টিয়া', name_en: 'Kushtia' },
    { id: 'meherpur', name_bn: 'মেহেরপুর', name_en: 'Meherpur' },
    { id: 'chuadanga', name_bn: 'চুয়াডাঙ্গা', name_en: 'Chuadanga' },
  ],
  barishal: [
    { id: 'barishal_city', name_bn: 'বরিশাল', name_en: 'Barishal' },
    { id: 'bhola', name_bn: 'ভোলা', name_en: 'Bhola' },
    { id: 'patuakhali', name_bn: 'পটুয়াখালী', name_en: 'Patuakhali' },
    { id: 'pirojpur', name_bn: 'পিরোজপুর', name_en: 'Pirojpur' },
    { id: 'jhalokathi', name_bn: 'ঝালকাঠি', name_en: 'Jhalokathi' },
    { id: 'barguna', name_bn: 'বরগুনা', name_en: 'Barguna' },
  ],
  sylhet: [
    { id: 'sylhet_city', name_bn: 'সিলেট', name_en: 'Sylhet' },
    { id: 'moulvibazar', name_bn: 'মৌলভীবাজার', name_en: 'Moulvibazar' },
    { id: 'habiganj', name_bn: 'হবিগঞ্জ', name_en: 'Habiganj' },
    { id: 'sunamganj', name_bn: 'সুনামগঞ্জ', name_en: 'Sunamganj' },
  ],
  rangpur: [
    { id: 'rangpur_city', name_bn: 'রংপুর', name_en: 'Rangpur' },
    { id: 'dinajpur', name_bn: 'দিনাজপুর', name_en: 'Dinajpur' },
    { id: 'kurigram', name_bn: 'কুড়িগ্রাম', name_en: 'Kurigram' },
    { id: 'gaibandha', name_bn: 'গাইবান্ধা', name_en: 'Gaibandha' },
    { id: 'nilphamari', name_bn: 'নীলফামারী', name_en: 'Nilphamari' },
    { id: 'lalmonirhat', name_bn: 'লালমনিরহাট', name_en: 'Lalmonirhat' },
    { id: 'thakurgaon', name_bn: 'ঠাকুরগাঁও', name_en: 'Thakurgaon' },
    { id: 'panchagarh', name_bn: 'পঞ্চগড়', name_en: 'Panchagarh' },
  ],
  mymensingh: [
    { id: 'mymensingh_city', name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh' },
    { id: 'netrokona', name_bn: 'নেত্রকোণা', name_en: 'Netrokona' },
    { id: 'jamalpur', name_bn: 'জামালপুর', name_en: 'Jamalpur' },
    { id: 'sherpur', name_bn: 'শেরপুর', name_en: 'Sherpur' },
  ],
};

export const AREAS_BY_DISTRICT = {
  dhaka_city: [
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
    { name: 'বসুন্ধরা', lat: 23.8152, lon: 90.4240 },
    { name: 'আজিমপুর', lat: 23.7270, lon: 90.3880 },
    { name: 'লালবাগ', lat: 23.7205, lon: 90.3880 },
    { name: 'হাজারিবাগ', lat: 23.7265, lon: 90.3625 },
  ],
  gazipur: [
    { name: 'গাজীপুর সদর', lat: 23.9999, lon: 90.4203 },
    { name: 'টঙ্গী', lat: 23.8980, lon: 90.4010 },
    { name: 'জয়দেবপুর', lat: 24.0002, lon: 90.4190 },
    { name: 'কালিয়াকৈর', lat: 24.0745, lon: 90.2595 },
    { name: 'কাপাসিয়া', lat: 24.1318, lon: 90.5936 },
    { name: 'শ্রীপুর', lat: 24.1978, lon: 90.4756 },
    { name: 'বোর্ড বাজার', lat: 23.9820, lon: 90.4003 },
  ],
  narayanganj: [
    { name: 'নারায়ণগঞ্জ সদর', lat: 23.6234, lon: 90.4997 },
    { name: 'সোনারগাঁও', lat: 23.6557, lon: 90.6085 },
    { name: 'রূপগঞ্জ', lat: 23.7602, lon: 90.5274 },
    { name: 'আড়াইহাজার', lat: 23.6432, lon: 90.6260 },
    { name: 'বন্দর', lat: 23.5985, lon: 90.5191 },
    { name: 'সিদ্ধিরগঞ্জ', lat: 23.6722, lon: 90.4773 },
  ],
  chittagong_city: [
    { name: 'জিইসি মোড়', lat: 22.3592, lon: 91.8215 },
    { name: '২ নম্বর গেট', lat: 22.3667, lon: 91.8258 },
    { name: 'আগ্রাবাদ', lat: 22.3305, lon: 91.8125 },
    { name: 'চকবাজার', lat: 22.3555, lon: 91.8365 },
    { name: 'বহদ্দারহাট', lat: 22.3725, lon: 91.8445 },
    { name: 'পতেঙ্গা', lat: 22.2535, lon: 91.7925 },
    { name: 'নিউমার্কেট (চট্ট)', lat: 22.3355, lon: 91.8315 },
    { name: 'হালিশহর', lat: 22.3082, lon: 91.7840 },
    { name: 'নাসিরাবাদ', lat: 22.3625, lon: 91.7978 },
    { name: 'খুলশী', lat: 22.3730, lon: 91.7985 },
    { name: 'মোহরা', lat: 22.4025, lon: 91.7872 },
    { name: 'ষোলশহর', lat: 22.3480, lon: 91.8095 },
  ],
  coxsbazar: [
    { name: "কক্সবাজার সদর", lat: 21.4272, lon: 92.0058 },
    { name: 'কলাতলী', lat: 21.4090, lon: 91.9975 },
    { name: 'সুগন্ধা বিচ', lat: 21.4338, lon: 91.9987 },
    { name: 'টেকনাফ', lat: 20.8644, lon: 92.3025 },
    { name: 'উখিয়া', lat: 21.2058, lon: 92.1050 },
    { name: 'রামু', lat: 21.4567, lon: 92.0878 },
  ],
  rajshahi_city: [
    { name: 'জিরো পয়েন্ট', lat: 24.3636, lon: 88.6017 },
    { name: 'রেল স্টেশন', lat: 24.3745, lon: 88.6042 },
    { name: 'নওদাপাড়া', lat: 24.4025, lon: 88.6145 },
    { name: 'বিনোদপুর', lat: 24.3642, lon: 88.6295 },
    { name: 'তালাইমারী', lat: 24.3615, lon: 88.6225 },
    { name: 'লক্ষ্মীপুর', lat: 24.3715, lon: 88.5875 },
    { name: 'কোর্ট স্টেশন', lat: 24.3695, lon: 88.5675 },
    { name: 'সাহেববাজার', lat: 24.3658, lon: 88.5998 },
    { name: 'বোয়ালিয়া', lat: 24.3708, lon: 88.6078 },
    { name: 'রাজশাহী বিশ্ববিদ্যালয়', lat: 24.3638, lon: 88.6390 },
  ],
  bogura: [
    { name: 'বগুড়া সদর', lat: 24.8460, lon: 89.3720 },
    { name: 'সাতমাথা', lat: 24.8513, lon: 89.3698 },
    { name: 'ঠনঠনিয়া', lat: 24.8480, lon: 89.3660 },
    { name: 'শেরপুর (বগুড়া)', lat: 24.9125, lon: 89.3590 },
    { name: 'শিবগঞ্জ (বগুড়া)', lat: 24.9675, lon: 88.9120 },
  ],
  naogaon: [
    { name: 'নওগাঁ সদর', lat: null, lon: null },
    { name: 'মুক্তির মোড়', lat: null, lon: null },
    { name: 'কেডি মোড়', lat: null, lon: null },
    { name: 'বালুডাঙ্গা বাসস্ট্যান্ড', lat: null, lon: null },
    { name: 'রেলগেট', lat: null, lon: null },
  ],
  khulna_city: [
    { name: 'খুলনা সদর', lat: 22.8456, lon: 89.5403 },
    { name: 'ফুলতলা', lat: 22.9126, lon: 89.5127 },
    { name: 'দৌলতপুর', lat: 22.8748, lon: 89.5231 },
    { name: 'খালিশপুর', lat: 22.8412, lon: 89.5138 },
    { name: 'সোনাডাঙ্গা', lat: 22.8296, lon: 89.5476 },
    { name: 'নিউমার্কেট (খুলনা)', lat: 22.8357, lon: 89.5442 },
    { name: 'রূপসা', lat: 22.8093, lon: 89.5610 },
  ],
  sylhet_city: [
    { name: 'জিন্দাবাজার', lat: 24.8949, lon: 91.8687 },
    { name: 'বন্দরবাজার', lat: 24.8897, lon: 91.8697 },
    { name: 'আম্বরখানা', lat: 24.9048, lon: 91.8682 },
    { name: 'টিলাগড়', lat: 24.8950, lon: 91.8980 },
    { name: 'মদিনা মার্কেট', lat: 24.8980, lon: 91.8480 },
    { name: 'কদমতলী', lat: 24.8820, lon: 91.8680 },
    { name: 'শিবগঞ্জ (সিলেট)', lat: 24.8920, lon: 91.8880 },
    { name: 'উপশহর', lat: 24.9012, lon: 91.8590 },
    { name: 'শাহজালাল বিশ্ববিদ্যালয়', lat: 24.9176, lon: 91.8355 },
  ],
  moulvibazar: [
    { name: 'মৌলভীবাজার সদর', lat: 24.4826, lon: 91.7772 },
    { name: 'শ্রীমঙ্গল', lat: 24.3040, lon: 91.7322 },
    { name: 'কমলগঞ্জ', lat: 24.3721, lon: 91.8545 },
    { name: 'কুলাউড়া', lat: 24.5335, lon: 92.0310 },
  ],
  rangpur_city: [
    { name: 'রংপুর সদর', lat: 25.7468, lon: 89.2508 },
    { name: 'জাহাজ কোম্পানি', lat: 25.7502, lon: 89.2610 },
    { name: 'কেরানীপাড়া', lat: 25.7398, lon: 89.2458 },
    { name: 'শাপলা চত্বর', lat: 25.7435, lon: 89.2532 },
    { name: 'মডার্ন মোড়', lat: 25.7522, lon: 89.2478 },
  ],
  dinajpur: [
    { name: 'দিনাজপুর সদর', lat: 25.6279, lon: 88.6338 },
    { name: 'মুন্সিপাড়া', lat: 25.6302, lon: 88.6418 },
    { name: 'চিরিরবন্দর', lat: 25.5470, lon: 88.7125 },
    { name: 'পার্বতীপুর', lat: 25.6490, lon: 88.9120 },
  ],
  mymensingh_city: [
    { name: 'ময়মনসিংহ সদর', lat: 24.7471, lon: 90.4203 },
    { name: 'গাঙ্গিনারপাড়', lat: 24.7512, lon: 90.4168 },
    { name: 'ব্রহ্মপুত্র নদের পাড়', lat: 24.7465, lon: 90.4290 },
    { name: 'কৃষি বিশ্ববিদ্যালয়', lat: 24.7182, lon: 90.4455 },
    { name: 'চরপাড়া', lat: 24.7538, lon: 90.4050 },
  ],
  barishal_city: [
    { name: 'বরিশাল সদর', lat: 22.7010, lon: 90.3535 },
    { name: 'নথুল্লাবাদ', lat: 22.6980, lon: 90.3580 },
    { name: 'রূপাতলী', lat: 22.6942, lon: 90.3612 },
    { name: 'কাউনিয়া', lat: 22.7125, lon: 90.3720 },
    { name: 'বান্দ রোড', lat: 22.7058, lon: 90.3445 },
  ],
  jessore: [
    { name: 'যশোর সদর', lat: 23.1664, lon: 89.2131 },
    { name: 'দড়াটানা', lat: 23.1698, lon: 89.2108 },
    { name: 'বেনাপোল', lat: 23.0283, lon: 88.9340 },
    { name: 'নওয়াপাড়া', lat: 23.1430, lon: 89.2268 },
  ],
  comilla: [
    { name: 'কুমিল্লা সদর', lat: 23.4682, lon: 91.1788 },
    { name: 'চকবাজার (কুমিল্লা)', lat: 23.4625, lon: 91.1848 },
    { name: 'টমছম ব্রিজ', lat: 23.4752, lon: 91.1728 },
    { name: 'বরুড়া', lat: 23.3610, lon: 91.1240 },
    { name: 'চান্দিনা', lat: 23.5748, lon: 91.0452 },
    { name: 'লাকসাম', lat: 23.2385, lon: 91.1410 },
  ],
};

const DISTRICT_INDEX = Object.entries(DISTRICTS_BY_DIVISION)
  .flatMap(([divisionId, districts]) =>
    districts.map((district, index) => ({
      ...district,
      divisionId,
      indexInDivision: index,
    }))
  )
  .reduce((acc, district) => {
    acc[district.id] = district;
    return acc;
  }, {});

const GENERATED_AREA_TEMPLATES = [
  { suffix_bn: 'সদর', suffix_en: 'Sadar' },
  { suffix_bn: 'বাসস্ট্যান্ড', suffix_en: 'Bus Stand' },
  { suffix_bn: 'রেলস্টেশন', suffix_en: 'Rail Station' },
  { suffix_bn: 'কোর্ট মোড়', suffix_en: 'Court Mor' },
  { suffix_bn: 'হাসপাতাল মোড়', suffix_en: 'Hospital Mor' },
];

const getGeneratedDistrictCenter = (district) => {
  const divisionCenter =
    DIVISION_CENTER_POINTS[district.divisionId] || DIVISION_CENTER_POINTS.dhaka;
  const latOffset = ((district.indexInDivision % 4) - 1.5) * 0.14;
  const lonOffset = (Math.floor(district.indexInDivision / 4) - 1) * 0.16;

  return {
    lat: Number((divisionCenter.lat + latOffset).toFixed(4)),
    lon: Number((divisionCenter.lon + lonOffset).toFixed(4)),
  };
};

const normalizeArea = (area, district, index = 0) => {
  const center = getGeneratedDistrictCenter(district);
  const latStep = [0, 0.018, -0.015, 0.011, -0.01][index] || 0;
  const lonStep = [0, 0.012, 0.017, -0.014, -0.02][index] || 0;

  return {
    ...area,
    name_bn: area.name_bn || area.name,
    name_en: area.name_en || area.name,
    lat:
      typeof area.lat === 'number'
        ? area.lat
        : Number((center.lat + latStep).toFixed(4)),
    lon:
      typeof area.lon === 'number'
        ? area.lon
        : Number((center.lon + lonStep).toFixed(4)),
  };
};

const buildGeneratedAreas = (district) =>
  GENERATED_AREA_TEMPLATES.map((template, index) =>
    normalizeArea(
      {
        name_bn: `${district.name_bn} ${template.suffix_bn}`,
        name_en: `${district.name_en} ${template.suffix_en}`,
        generated: true,
      },
      district,
      index
    )
  );

export const getDistrictById = (districtId) => DISTRICT_INDEX[districtId] || null;

export const getAreasForDistrict = (districtOrId) => {
  const district =
    typeof districtOrId === 'string' ? getDistrictById(districtOrId) : districtOrId;

  if (!district?.id) {
    return [];
  }

  const areas = AREAS_BY_DISTRICT[district.id];
  if (areas?.length) {
    return areas.map((area, index) => normalizeArea(area, district, index));
  }

  return buildGeneratedAreas(district);
};
