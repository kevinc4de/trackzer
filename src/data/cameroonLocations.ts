export interface CameroonLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'city' | 'district';
  parentCity?: string;
}

export const cameroonLocations: CameroonLocation[] = [
  // Yaoundé et ses quartiers
  { name: 'Yaoundé', lat: 3.8480, lng: 11.5021, type: 'city' },
  { name: 'Centre-ville', lat: 3.8667, lng: 11.5167, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Bastos', lat: 3.8833, lng: 11.5167, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Melen', lat: 3.8333, lng: 11.5000, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Mvog-Mbi', lat: 3.8500, lng: 11.4833, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Nlongkak', lat: 3.8667, lng: 11.4833, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Emombo', lat: 3.8167, lng: 11.5167, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Essos', lat: 3.8833, lng: 11.5333, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Kondengui', lat: 3.8000, lng: 11.5333, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Nkoldongo', lat: 3.8333, lng: 11.5333, type: 'district', parentCity: 'Yaoundé' },
  { name: 'Nkomo', lat: 3.8167, lng: 11.4833, type: 'district', parentCity: 'Yaoundé' },

  // Douala et ses quartiers
  { name: 'Douala', lat: 4.0511, lng: 9.7679, type: 'city' },
  { name: 'Akwa', lat: 4.0500, lng: 9.7000, type: 'district', parentCity: 'Douala' },
  { name: 'Bonanjo', lat: 4.0667, lng: 9.7000, type: 'district', parentCity: 'Douala' },
  { name: 'Bali', lat: 4.0333, lng: 9.7333, type: 'district', parentCity: 'Douala' },
  { name: 'Bonapriso', lat: 4.0833, lng: 9.7167, type: 'district', parentCity: 'Douala' },
  { name: 'Deido', lat: 4.0833, lng: 9.7333, type: 'district', parentCity: 'Douala' },
  { name: 'New Bell', lat: 4.0333, lng: 9.7667, type: 'district', parentCity: 'Douala' },
  { name: 'Nylon', lat: 4.0167, lng: 9.7500, type: 'district', parentCity: 'Douala' },
  { name: 'Makepe', lat: 4.0167, lng: 9.8000, type: 'district', parentCity: 'Douala' },
  { name: 'Logbessou', lat: 4.0000, lng: 9.7833, type: 'district', parentCity: 'Douala' },
  { name: 'Kotto', lat: 4.0500, lng: 9.7833, type: 'district', parentCity: 'Douala' },
  { name: 'Ndokotti', lat: 4.0167, lng: 9.7167, type: 'district', parentCity: 'Douala' },
  { name: 'Bessengue', lat: 4.0833, lng: 9.7500, type: 'district', parentCity: 'Douala' },

  // Bafoussam et ses quartiers
  { name: 'Bafoussam', lat: 5.4781, lng: 10.4167, type: 'city' },
  { name: 'Centre-ville Bafoussam', lat: 5.4833, lng: 10.4167, type: 'district', parentCity: 'Bafoussam' },
  { name: 'Djeleng', lat: 5.4667, lng: 10.4000, type: 'district', parentCity: 'Bafoussam' },
  { name: 'Famla', lat: 5.4833, lng: 10.4333, type: 'district', parentCity: 'Bafoussam' },
  { name: 'Tamdja', lat: 5.4667, lng: 10.4333, type: 'district', parentCity: 'Bafoussam' },
  { name: 'Tougang', lat: 5.4500, lng: 10.4167, type: 'district', parentCity: 'Bafoussam' },

  // Bamenda et ses quartiers
  { name: 'Bamenda', lat: 5.9631, lng: 10.1591, type: 'city' },
  { name: 'Commercial Avenue', lat: 5.9667, lng: 10.1500, type: 'district', parentCity: 'Bamenda' },
  { name: 'Up Station', lat: 5.9833, lng: 10.1667, type: 'district', parentCity: 'Bamenda' },
  { name: 'Cow Street', lat: 5.9500, lng: 10.1500, type: 'district', parentCity: 'Bamenda' },
  { name: 'Ntarikon', lat: 5.9333, lng: 10.1333, type: 'district', parentCity: 'Bamenda' },
  { name: 'Nkwen', lat: 5.9833, lng: 10.1333, type: 'district', parentCity: 'Bamenda' },

  // Garoua et ses quartiers
  { name: 'Garoua', lat: 9.3265, lng: 13.3958, type: 'city' },
  { name: 'Centre-ville Garoua', lat: 9.3333, lng: 13.4000, type: 'district', parentCity: 'Garoua' },
  { name: 'Grand Marché', lat: 9.3167, lng: 13.3833, type: 'district', parentCity: 'Garoua' },
  { name: 'Plateau', lat: 9.3500, lng: 13.4167, type: 'district', parentCity: 'Garoua' },
  { name: 'Petit Marché', lat: 9.3000, lng: 13.3667, type: 'district', parentCity: 'Garoua' },

  // Maroua et ses quartiers
  { name: 'Maroua', lat: 10.5906, lng: 14.3172, type: 'city' },
  { name: 'Centre-ville Maroua', lat: 10.5833, lng: 14.3167, type: 'district', parentCity: 'Maroua' },
  { name: 'Domayo', lat: 10.6000, lng: 14.3333, type: 'district', parentCity: 'Maroua' },
  { name: 'Djarengol', lat: 10.5667, lng: 14.3000, type: 'district', parentCity: 'Maroua' },
  { name: 'Hardé', lat: 10.6167, lng: 14.3500, type: 'district', parentCity: 'Maroua' },

  // Ngaoundéré et ses quartiers
  { name: 'Ngaoundéré', lat: 7.3167, lng: 13.5833, type: 'city' },
  { name: 'Centre-ville Ngaoundéré', lat: 7.3167, lng: 13.5833, type: 'district', parentCity: 'Ngaoundéré' },
  { name: 'Petit Marché Ngaoundéré', lat: 7.3000, lng: 13.5667, type: 'district', parentCity: 'Ngaoundéré' },
  { name: 'Haoussa', lat: 7.3333, lng: 13.6000, type: 'district', parentCity: 'Ngaoundéré' },

  // Bertoua et ses quartiers
  { name: 'Bertoua', lat: 4.5833, lng: 13.6833, type: 'city' },
  { name: 'Centre-ville Bertoua', lat: 4.5833, lng: 13.6833, type: 'district', parentCity: 'Bertoua' },
  { name: 'Mokolo Bertoua', lat: 4.5667, lng: 13.6667, type: 'district', parentCity: 'Bertoua' },

  // Ebolowa et ses quartiers
  { name: 'Ebolowa', lat: 2.9167, lng: 11.1500, type: 'city' },
  { name: 'Centre-ville Ebolowa', lat: 2.9167, lng: 11.1500, type: 'district', parentCity: 'Ebolowa' },
  { name: 'Angalé', lat: 2.9000, lng: 11.1333, type: 'district', parentCity: 'Ebolowa' },

  // Kribi et ses quartiers
  { name: 'Kribi', lat: 2.9333, lng: 9.9167, type: 'city' },
  { name: 'Centre-ville Kribi', lat: 2.9333, lng: 9.9167, type: 'district', parentCity: 'Kribi' },
  { name: 'Grand Batanga', lat: 2.9167, lng: 9.9000, type: 'district', parentCity: 'Kribi' },

  // Limbe et ses quartiers
  { name: 'Limbe', lat: 4.0167, lng: 9.2167, type: 'city' },
  { name: 'Down Beach', lat: 4.0000, lng: 9.2000, type: 'district', parentCity: 'Limbe' },
  { name: 'Mile 4', lat: 4.0333, lng: 9.2333, type: 'district', parentCity: 'Limbe' },

  // Buea et ses quartiers
  { name: 'Buea', lat: 4.1500, lng: 9.2833, type: 'city' },
  { name: 'Molyko', lat: 4.1333, lng: 9.2667, type: 'district', parentCity: 'Buea' },
  { name: 'Great Soppo', lat: 4.1667, lng: 9.3000, type: 'district', parentCity: 'Buea' }
];

// Fonction pour obtenir une localisation aléatoire du Cameroun
export const getRandomCameroonLocation = (): CameroonLocation => {
  return cameroonLocations[Math.floor(Math.random() * cameroonLocations.length)];
};

// Fonction pour obtenir les quartiers d'une ville
export const getDistrictsByCity = (cityName: string): CameroonLocation[] => {
  return cameroonLocations.filter(location => 
    location.parentCity === cityName && location.type === 'district'
  );
};

// Fonction pour obtenir toutes les villes
export const getAllCities = (): CameroonLocation[] => {
  return cameroonLocations.filter(location => location.type === 'city');
};

// Fonction pour trouver la localisation la plus proche
export const findNearestLocation = (lat: number, lng: number): CameroonLocation => {
  let nearestLocation = cameroonLocations[0];
  let minDistance = Number.MAX_VALUE;
  
  cameroonLocations.forEach(location => {
    const distance = Math.sqrt(
      Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = location;
    }
  });
  
  return nearestLocation;
};

// Fonction pour obtenir une adresse formatée
export const getFormattedAddress = (location: CameroonLocation): string => {
  if (location.type === 'district' && location.parentCity) {
    return `${location.name}, ${location.parentCity}, Cameroun`;
  }
  return `${location.name}, Cameroun`;
};