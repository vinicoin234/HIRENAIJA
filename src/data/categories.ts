import { BusinessCategory } from '../types';

export interface CategoryInfo {
  id: BusinessCategory;
  name: string;
  tagline: string;
  iconName: string;
  popularSearches: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'mechanics',
    name: 'Mechanics',
    tagline: 'Auto diagnostics, Tokunbo engine overhaul & roadside help',
    iconName: 'Wrench',
    popularSearches: ['Toyota gearbox specialist', 'Honda diagnostics', 'Mercedes brake pad', 'Mobile mechanic'],
  },
  {
    id: 'electricians',
    name: 'Electricians',
    tagline: 'Solar panels, inverter setup, wiring & prepaid meter repair',
    iconName: 'Zap',
    popularSearches: ['5kVA Inverter installation', 'Solar lithium battery', 'House rewiring', 'Breaker tripping fix'],
  },
  {
    id: 'tailors',
    name: 'Tailors & Fashion',
    tagline: 'Bespoke Senator wear, Agbada, Aso-Ebi & bridal couture',
    iconName: 'Scissors',
    popularSearches: ['Senator Kaftan suit', 'Agbada embroidery', 'Lace Aso-Ebi gown', 'Express alterations'],
  },
  {
    id: 'plumbers',
    name: 'Plumbers',
    tagline: 'Borehole pumping, pressure tanks, leaks & bathroom fittings',
    iconName: 'Droplet',
    popularSearches: ['Borehole submersible pump', 'Water heater piping', 'Blocked soakaway', 'Toilet flush valve'],
  },
  {
    id: 'barbers',
    name: 'Barbers',
    tagline: 'Sharp fades, dreadline grooming, dye & VIP home visits',
    iconName: 'Sparkles',
    popularSearches: ['Clean low fade', 'Beard trimming & hot towel', 'Home service barber', 'Dye & wave treatment'],
  },
  {
    id: 'hairstylists',
    name: 'Hair Stylists',
    tagline: 'Knotless braids, dreadlocks, wig revamping & bridal hair',
    iconName: 'Flower2',
    popularSearches: ['Knotless box braids', 'Lace frontal revamp', 'Dreadlock retwist', 'Goddess braids'],
  },
  {
    id: 'photographers',
    name: 'Photographers',
    tagline: 'Wedding shoots, birthday portraits, studio & drone coverage',
    iconName: 'Camera',
    popularSearches: ['Traditional wedding shoot', 'Studio headshot', 'Birthday portrait session', 'Event drone video'],
  },
  {
    id: 'djs',
    name: 'DJs & Sound',
    tagline: 'Owambe party vibes, club mixes, line-array speakers & mics',
    iconName: 'Disc',
    popularSearches: ['Wedding reception DJ', 'Corporate event sound setup', 'Afrobeats party set', 'Outdoor line array'],
  },
  {
    id: 'mcs',
    name: 'MCs & Hypemen',
    tagline: 'Charismatic wedding reception hosts & high-energy crowd hype',
    iconName: 'Mic2',
    popularSearches: ['Bilingual wedding MC', 'Corporate gala master of ceremony', 'Hype man for club', 'Owambe comedy host'],
  },
  {
    id: 'welders',
    name: 'Welders & Iron',
    tagline: 'Anti-burglary proof, modern gates, carports & metal staircases',
    iconName: 'Shield',
    popularSearches: ['Laser cut sliding gate', 'Security burglary proof', 'Stainless steel handrails', 'Carport roof construction'],
  },
  {
    id: 'freelancers',
    name: 'Freelancers & Tech',
    tagline: 'Web designers, graphic branding, video editors & digital ads',
    iconName: 'Laptop',
    popularSearches: ['WordPress/Shopify website', 'Flyer & logo design', 'Social media manager', 'Reels video editor'],
  },
  {
    id: 'tutors',
    name: 'Private Tutors',
    tagline: 'WAEC, JAMB, Cambridge IGCSE, Coding & Piano home lessons',
    iconName: 'GraduationCap',
    popularSearches: ['IGCSE Math tutor', 'JAMB CBT prep classes', 'Python coding for kids', 'Home piano teacher'],
  },
];

export interface NigerianStateInfo {
  name: string;
  state: string;
  zone: 'South West' | 'South East' | 'South South' | 'North Central' | 'North West' | 'North East';
  neighborhoods: string[];
}

export const NIGERIAN_CITIES: NigerianStateInfo[] = [
  // Major Commercial Metros (Top prioritized for quick selection)
  {
    name: 'Lagos',
    state: 'Lagos State',
    zone: 'South West',
    neighborhoods: [
      'Lekki Phase 1',
      'Ikeja',
      'Victoria Island',
      'Lagos Island',
      'Yaba',
      'Surulere',
      'Ikoyi',
      'Ajah',
      'Festac',
      'Ikorodu',
      'Alimosho',
      'Magodo',
      'Gbagada',
      'Ogba',
      'Maryland',
    ],
  },
  {
    name: 'Abuja',
    state: 'FCT - Abuja',
    zone: 'North Central',
    neighborhoods: [
      'Maitama',
      'Wuse 2',
      'Garki',
      'Jabi',
      'Asokoro',
      'Gwarinpa',
      'Kubwa',
      'Apo',
      'Utako',
      'Wuye',
      'Lokogoma',
      'Lugbe',
    ],
  },
  {
    name: 'Port Harcourt',
    state: 'Rivers State',
    zone: 'South South',
    neighborhoods: [
      'Old GRA',
      'Trans-Amadi',
      'Peter Odili Road',
      'D-Line',
      'Woji',
      'Rumuokoro',
      'Ada George',
      'Stadium Road',
      'Eleme',
      'Bonny Island',
    ],
  },

  // All 36 States of the Federation (Alphabetical)
  {
    name: 'Abia',
    state: 'Abia State',
    zone: 'South East',
    neighborhoods: ['Aba Commercial Hub', 'Umuahia Central', 'Ohafia', 'Osisioma', 'Ogbor Hill'],
  },
  {
    name: 'Adamawa',
    state: 'Adamawa State',
    zone: 'North East',
    neighborhoods: ['Yola Town', 'Jimeta', 'Mubi', 'Numan', 'Ganye'],
  },
  {
    name: 'Akwa Ibom',
    state: 'Akwa Ibom State',
    zone: 'South South',
    neighborhoods: ['Uyo Capital City', 'Eket Industrial', 'Ikot Ekpene', 'Oron', 'Abak'],
  },
  {
    name: 'Anambra',
    state: 'Anambra State',
    zone: 'South East',
    neighborhoods: ['Onitsha Main Market', 'Awka Capital', 'Nnewi Industrial', 'Ekwulobia', 'Ihiala'],
  },
  {
    name: 'Bauchi',
    state: 'Bauchi State',
    zone: 'North East',
    neighborhoods: ['Bauchi Central', 'Azare', 'Misau', 'Katagum', 'Jama\'are'],
  },
  {
    name: 'Bayelsa',
    state: 'Bayelsa State',
    zone: 'South South',
    neighborhoods: ['Yenagoa City', 'Brass', 'Ogbia', 'Sagbama', 'Amassoma'],
  },
  {
    name: 'Benue',
    state: 'Benue State',
    zone: 'North Central',
    neighborhoods: ['Makurdi Town', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Wukari Border'],
  },
  {
    name: 'Borno',
    state: 'Borno State',
    zone: 'North East',
    neighborhoods: ['Maiduguri Metropolis', 'Biu', 'Bama', 'Jere', 'Askira'],
  },
  {
    name: 'Cross River',
    state: 'Cross River State',
    zone: 'South South',
    neighborhoods: ['Calabar Municipal', 'Calabar South', 'Ikom', 'Ogoja', 'Obudu Ranch Area'],
  },
  {
    name: 'Delta',
    state: 'Delta State',
    zone: 'South South',
    neighborhoods: ['Warri Central', 'Asaba Capital', 'Effurun', 'Sapele', 'Ughelli', 'Agbor'],
  },
  {
    name: 'Ebonyi',
    state: 'Ebonyi State',
    zone: 'South East',
    neighborhoods: ['Abakaliki Urban', 'Afikpo', 'Onueke', 'Ishielu', 'Ohaozara'],
  },
  {
    name: 'Edo',
    state: 'Edo State',
    zone: 'South South',
    neighborhoods: ['Benin City GRA', 'Airport Road Benin', 'Ugbowo', 'Ekpoma', 'Auchi', 'Uromi'],
  },
  {
    name: 'Ekiti',
    state: 'Ekiti State',
    zone: 'South West',
    neighborhoods: ['Ado-Ekiti Capital', 'Ikere-Ekiti', 'Ijero', 'Oye-Ekiti', 'Efon-Alaaye'],
  },
  {
    name: 'Enugu',
    state: 'Enugu State',
    zone: 'South East',
    neighborhoods: ['Independence Layout', 'New Haven Enugu', 'Enugu GRA', 'Nsukka University Town', 'Agbani', 'Abakpa'],
  },
  {
    name: 'Gombe',
    state: 'Gombe State',
    zone: 'North East',
    neighborhoods: ['Gombe Metropolis', 'Kaltungo', 'Billiri', 'Bajoga', 'Dukku'],
  },
  {
    name: 'Imo',
    state: 'Imo State',
    zone: 'South East',
    neighborhoods: ['Owerri Municipal', 'Ikenegbu Owerri', 'New Owerri', 'Orlu', 'Okigwe', 'Mbaise'],
  },
  {
    name: 'Jigawa',
    state: 'Jigawa State',
    zone: 'North West',
    neighborhoods: ['Dutse Capital', 'Hadejia Commercial', 'Gumel', 'Kazaure', 'Birnin Kudu'],
  },
  {
    name: 'Kaduna',
    state: 'Kaduna State',
    zone: 'North West',
    neighborhoods: ['Kaduna Central', 'Barnawa', 'Malali', 'Sabon Tasha', 'Zaria City', 'Kafanchan'],
  },
  {
    name: 'Kano',
    state: 'Kano State',
    zone: 'North West',
    neighborhoods: ['Kano Municipal', 'Nassarawa GRA', 'Fagge', 'Sabon Gari Kano', 'Dala', 'Tarauni', 'Gwale'],
  },
  {
    name: 'Katsina',
    state: 'Katsina State',
    zone: 'North West',
    neighborhoods: ['Katsina Metropolis', 'Daura Ancient City', 'Funtua Industrial', 'Malumfashi', 'Kankia'],
  },
  {
    name: 'Kebbi',
    state: 'Kebbi State',
    zone: 'North West',
    neighborhoods: ['Birnin Kebbi', 'Argungu Festival Town', 'Yauri', 'Zuru', 'Jega'],
  },
  {
    name: 'Kogi',
    state: 'Kogi State',
    zone: 'North Central',
    neighborhoods: ['Lokoja Confluence', 'Okene', 'Idah Ancient', 'Kabba', 'Anyigba University Hub'],
  },
  {
    name: 'Kwara',
    state: 'Kwara State',
    zone: 'North Central',
    neighborhoods: ['Ilorin GRA', 'Fate Road Ilorin', 'Tanke University Road', 'Offa', 'Omu-Aran'],
  },
  {
    name: 'Nasarawa',
    state: 'Nasarawa State',
    zone: 'North Central',
    neighborhoods: ['Lafia Metropolis', 'Karu Suburb', 'Mararaba', 'Keffi', 'Akwanga'],
  },
  {
    name: 'Niger',
    state: 'Niger State',
    zone: 'North Central',
    neighborhoods: ['Minna Town', 'Suleja Commercial', 'Bida Heritage', 'Kontagora', 'New Bussa'],
  },
  {
    name: 'Ogun',
    state: 'Ogun State',
    zone: 'South West',
    neighborhoods: ['Abeokuta GRA', 'Ibikunle / Oke-Mosan', 'Ijebu-Ode', 'Sagamu', 'Ota Industrial', 'Mowe-Ibafo'],
  },
  {
    name: 'Ondo',
    state: 'Ondo State',
    zone: 'South West',
    neighborhoods: ['Akure Alagbaka GRA', 'Ondo City', 'Owo Kingdom', 'Ikare-Akoko', 'Ore Junction'],
  },
  {
    name: 'Osun',
    state: 'Osun State',
    zone: 'South West',
    neighborhoods: ['Osogbo Capital', 'Ile-Ife Cradle', 'Ilesa', 'Ede Commercial', 'Osun GRA'],
  },
  {
    name: 'Oyo',
    state: 'Oyo State',
    zone: 'South West',
    neighborhoods: ['Bodija Ibadan', 'Ring Road Ibadan', 'Dugbe Commercial', 'Oluyole Estate', 'Jericho Ibadan', 'Ogbomoso', 'Oyo Town'],
  },
  {
    name: 'Plateau',
    state: 'Plateau State',
    zone: 'North Central',
    neighborhoods: ['Jos North', 'Jos South', 'Rayfield Jos', 'Bukuru', 'Pankshin'],
  },
  {
    name: 'Sokoto',
    state: 'Sokoto State',
    zone: 'North West',
    neighborhoods: ['Sokoto Metropolis', 'Wamakko', 'Tambuwal', 'Bodinga', 'Illela Border'],
  },
  {
    name: 'Taraba',
    state: 'Taraba State',
    zone: 'North East',
    neighborhoods: ['Jalingo City', 'Wukari', 'Bali', 'Zing', 'Gembu Mambilla'],
  },
  {
    name: 'Yobe',
    state: 'Yobe State',
    zone: 'North East',
    neighborhoods: ['Damaturu Metropolis', 'Potiskum Commercial', 'Gashua', 'Nguru', 'Geidam'],
  },
  {
    name: 'Zamfara',
    state: 'Zamfara State',
    zone: 'North West',
    neighborhoods: ['Gusau Capital', 'Kaura Namoda', 'Talata Mafara', 'Anka', 'Maru'],
  },
];
