// Application constants and configuration

export const APP_CONFIG = {
  name: 'Trackzer',
  version: '2.0.0',
  description: 'Solution de géolocalisation pour le Cameroun',
  supportEmail: 'support@trackzer.cm',
  supportPhone: '+237 6 XX XX XX XX',
  
  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  
  // Geolocation Configuration
  geolocation: {
    timeout: 15000,
    maximumAge: 60000,
    enableHighAccuracy: true,
    fallbackToDatabase: true
  },
  
  // Search Configuration
  search: {
    minImeiLength: 8,
    maxResults: 50,
    debounceDelay: 300
  },
  
  // Validation Rules
  validation: {
    imeiLength: 15,
    minDescriptionLength: 10,
    maxDescriptionLength: 500,
    maxRewardAmount: 10000000, // 10M FCFA
    phoneRegex: /^(\+237|237)?[6-9]\d{8}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 5000,
    mapDefaultZoom: 6,
    mapCityZoom: 10,
    mapDistrictZoom: 14
  },
  
  // Analytics Configuration
  analytics: {
    enabled: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxEvents: 100
  }
};

export const CAMEROON_BOUNDS = {
  north: 13.083333,
  south: 1.652778,
  east: 16.192222,
  west: 8.494444,
  center: [7.3697, 12.3547] as [number, number]
};

export const PHONE_BRANDS = [
  'iPhone', 'Samsung', 'Huawei', 'Tecno', 'Infinix', 'OnePlus', 
  'Xiaomi', 'Oppo', 'Vivo', 'Nokia', 'Realme', 'Honor'
];

export const PHONE_COLORS = [
  'Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Violet', 'Rose', 
  'Gris', 'Or', 'Argent', 'Bronze', 'Transparent'
];

export const STATUS_CONFIG = {
  lost: {
    label: 'Perdu',
    color: 'orange',
    icon: 'Clock',
    description: 'Téléphone égaré ou perdu'
  },
  stolen: {
    label: 'Volé',
    color: 'red',
    icon: 'AlertTriangle',
    description: 'Téléphone volé ou dérobé'
  },
  found: {
    label: 'Retrouvé',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Téléphone récupéré avec succès'
  }
};

export const ERROR_MESSAGES = {
  network: {
    offline: 'Vous êtes hors ligne. Vérifiez votre connexion internet.',
    timeout: 'La requête a pris trop de temps. Réessayez.',
    serverError: 'Erreur serveur. Réessayez dans quelques instants.',
    notFound: 'Ressource non trouvée.'
  },
  validation: {
    required: 'Ce champ est obligatoire',
    invalidFormat: 'Format invalide',
    tooShort: 'Trop court',
    tooLong: 'Trop long'
  },
  geolocation: {
    denied: 'Géolocalisation refusée. Autorisez l\'accès à votre position.',
    unavailable: 'Position indisponible. Saisissez manuellement votre localisation.',
    timeout: 'Délai de géolocalisation dépassé.'
  }
};