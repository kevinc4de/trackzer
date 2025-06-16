import { PhoneType } from '../types';

// Coordonnées réelles des principales villes du Cameroun
const cameroonCities = [
  { name: 'Yaoundé', lat: 3.8480, lng: 11.5021 },
  { name: 'Douala', lat: 4.0511, lng: 9.7679 },
  { name: 'Bafoussam', lat: 5.4781, lng: 10.4167 },
  { name: 'Bamenda', lat: 5.9631, lng: 10.1591 },
  { name: 'Garoua', lat: 9.3265, lng: 13.3958 },
  { name: 'Maroua', lat: 10.5906, lng: 14.3172 },
  { name: 'Ngaoundéré', lat: 7.3167, lng: 13.5833 },
  { name: 'Bertoua', lat: 4.5833, lng: 13.6833 },
  { name: 'Ebolowa', lat: 2.9167, lng: 11.1500 },
  { name: 'Kribi', lat: 2.9333, lng: 9.9167 },
  { name: 'Limbe', lat: 4.0167, lng: 9.2167 },
  { name: 'Buea', lat: 4.1500, lng: 9.2833 }
];

export const mockPhones: PhoneType[] = [
  {
    id: '1',
    imei: '356938035643809',
    brand: 'iPhone',
    model: '14 Pro',
    color: 'Space Black',
    status: 'stolen',
    reportedDate: '2024-01-15T10:30:00Z',
    lastKnownLocation: {
      lat: 3.8480,
      lng: 11.5021,
      address: 'Centre-ville, Yaoundé, Cameroun'
    },
    owner: {
      name: 'Marie Dubois',
      phone: '+237 6 12 34 56 78',
      email: 'marie.dubois@email.com'
    },
    description: 'Volé dans un taxi en direction du centre-ville de Yaoundé',
    reward: 50000
  },
  {
    id: '2',
    imei: '353879234567890',
    brand: 'Samsung',
    model: 'Galaxy S23',
    color: 'Phantom Green',
    status: 'lost',
    reportedDate: '2024-01-20T14:15:00Z',
    lastKnownLocation: {
      lat: 4.0511,
      lng: 9.7679,
      address: 'Akwa, Douala, Cameroun'
    },
    owner: {
      name: 'Pierre Martin',
      phone: '+237 6 98 76 54 32',
      email: 'pierre.martin@email.com'
    },
    description: 'Perdu au marché central d\'Akwa à Douala',
    reward: 30000
  },
  {
    id: '3',
    imei: '358240051111110',
    brand: 'Huawei',
    model: 'P50 Pro',
    color: 'Golden Black',
    status: 'found',
    reportedDate: '2024-01-18T09:45:00Z',
    lastKnownLocation: {
      lat: 5.4781,
      lng: 10.4167,
      address: 'Centre-ville, Bafoussam, Cameroun'
    },
    owner: {
      name: 'Sophie Blanc',
      phone: '+237 6 11 22 33 44',
      email: 'sophie.blanc@email.com'
    },
    description: 'Retrouvé grâce à la géolocalisation près de l\'université de Bafoussam'
  },
  {
    id: '4',
    imei: '861536030196001',
    brand: 'OnePlus',
    model: '11 Pro',
    color: 'Titan Black',
    status: 'stolen',
    reportedDate: '2024-01-22T16:20:00Z',
    lastKnownLocation: {
      lat: 5.9631,
      lng: 10.1591,
      address: 'Commercial Avenue, Bamenda, Cameroun'
    },
    owner: {
      name: 'Lucas Moreau',
      phone: '+237 6 55 44 33 22',
      email: 'lucas.moreau@email.com'
    },
    description: 'Vol à l\'arraché près du marché de Bamenda',
    reward: 75000
  },
  {
    id: '5',
    imei: '352094087654321',
    brand: 'Tecno',
    model: 'Camon 19',
    color: 'Blue',
    status: 'lost',
    reportedDate: '2024-01-25T11:30:00Z',
    lastKnownLocation: {
      lat: 9.3265,
      lng: 13.3958,
      address: 'Grand Marché, Garoua, Cameroun'
    },
    owner: {
      name: 'Aminata Sow',
      phone: '+237 6 77 88 99 00',
      email: 'aminata.sow@email.com'
    },
    description: 'Perdu au grand marché de Garoua pendant les achats',
    reward: 25000
  },
  {
    id: '6',
    imei: '359876543210987',
    brand: 'Infinix',
    model: 'Note 12',
    color: 'Black',
    status: 'stolen',
    reportedDate: '2024-01-28T08:15:00Z',
    lastKnownLocation: {
      lat: 10.5906,
      lng: 14.3172,
      address: 'Quartier Domayo, Maroua, Cameroun'
    },
    owner: {
      name: 'Ibrahim Moussa',
      phone: '+237 6 33 44 55 66',
      email: 'ibrahim.moussa@email.com'
    },
    description: 'Volé dans un moto-taxi à Maroua',
    reward: 40000
  }
];

// Fonction pour obtenir une ville aléatoire du Cameroun
export const getRandomCameroonCity = () => {
  return cameroonCities[Math.floor(Math.random() * cameroonCities.length)];
};

export const generateIMEI = (): string => {
  const prefix = '35';
  const tac = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  const snr = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  const baseImei = prefix + tac + snr;
  
  // Calculate Luhn check digit
  let sum = 0;
  let alternate = false;
  
  for (let i = baseImei.length - 1; i >= 0; i--) {
    let digit = parseInt(baseImei.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return baseImei + checkDigit;
};