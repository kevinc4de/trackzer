import { CameroonLocation, cameroonLocations, findNearestLocation, getFormattedAddress } from '../data/cameroonLocations';

export interface GeolocationResult {
  lat: number;
  lng: number;
  address: string;
  accuracy: 'high' | 'medium' | 'low';
  source: 'gps' | 'network' | 'database';
}

export const geolocationService = {
  // Obtenir la position actuelle avec géolocalisation HTML5 améliorée
  async getCurrentPosition(options?: PositionOptions): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback vers une localisation aléatoire au Cameroun
        const randomLocation = this.getRandomCameroonLocation();
        resolve({
          lat: randomLocation.lat,
          lng: randomLocation.lng,
          address: getFormattedAddress(randomLocation),
          accuracy: 'low',
          source: 'database'
        });
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // Augmenté à 15 secondes
        maximumAge: 60000, // 1 minute
        ...options
      };

      // Essayer d'abord avec haute précision
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Vérifier si on est au Cameroun
          if (this.isInCameroon(latitude, longitude)) {
            // Position GPS au Cameroun - trouver la ville/quartier le plus proche
            const nearestLocation = this.findPreciseLocation(latitude, longitude);
            
            let accuracyLevel: 'high' | 'medium' | 'low' = 'medium';
            if (accuracy && accuracy < 50) accuracyLevel = 'high';
            else if (accuracy && accuracy < 200) accuracyLevel = 'medium';
            else accuracyLevel = 'low';

            resolve({
              lat: latitude,
              lng: longitude,
              address: nearestLocation.address,
              accuracy: accuracyLevel,
              source: 'gps'
            });
          } else {
            // Position GPS hors Cameroun - utiliser IP géolocalisation ou fallback
            try {
              const networkLocation = await this.getNetworkLocation();
              resolve(networkLocation);
            } catch {
              const randomLocation = this.getRandomCameroonLocation();
              resolve({
                lat: randomLocation.lat,
                lng: randomLocation.lng,
                address: getFormattedAddress(randomLocation),
                accuracy: 'low',
                source: 'database'
              });
            }
          }
        },
        async (error) => {
          console.warn('Erreur GPS:', error);
          
          // Essayer la géolocalisation réseau
          try {
            const networkLocation = await this.getNetworkLocation();
            resolve(networkLocation);
          } catch {
            // Fallback final vers une localisation camerounaise intelligente
            const smartLocation = this.getSmartCameroonLocation();
            resolve({
              lat: smartLocation.lat,
              lng: smartLocation.lng,
              address: getFormattedAddress(smartLocation),
              accuracy: 'low',
              source: 'database'
            });
          }
        },
        defaultOptions
      );
    });
  },

  // Géolocalisation réseau via API
  async getNetworkLocation(): Promise<GeolocationResult> {
    try {
      // Utiliser l'API ipapi.co pour la géolocalisation IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code === 'CM') {
        // L'utilisateur est au Cameroun selon son IP
        const cityName = data.city || data.region;
        const matchingLocation = this.findLocationByName(cityName);
        
        if (matchingLocation) {
          return {
            lat: data.latitude || matchingLocation.lat,
            lng: data.longitude || matchingLocation.lng,
            address: getFormattedAddress(matchingLocation),
            accuracy: 'medium',
            source: 'network'
          };
        }
      }
      
      // Si pas au Cameroun ou ville non trouvée, utiliser une ville principale
      const mainCity = this.getMainCameroonCity();
      return {
        lat: mainCity.lat,
        lng: mainCity.lng,
        address: getFormattedAddress(mainCity),
        accuracy: 'low',
        source: 'network'
      };
    } catch (error) {
      throw new Error('Network geolocation failed');
    }
  },

  // Trouver une localisation précise basée sur les coordonnées GPS
  findPreciseLocation(lat: number, lng: number): { address: string; confidence: number } {
    let bestMatch = cameroonLocations[0];
    let minDistance = Number.MAX_VALUE;
    let confidence = 0;

    cameroonLocations.forEach(location => {
      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = location;
      }
    });

    // Calculer la confiance basée sur la distance
    if (minDistance < 0.01) confidence = 95; // < 1km
    else if (minDistance < 0.05) confidence = 85; // < 5km
    else if (minDistance < 0.1) confidence = 70; // < 10km
    else if (minDistance < 0.5) confidence = 50; // < 50km
    else confidence = 30;

    return {
      address: getFormattedAddress(bestMatch),
      confidence
    };
  },

  // Calculer la distance entre deux points (formule haversine simplifiée)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return 6371 * c; // Distance en km
  },

  // Vérifier si les coordonnées sont au Cameroun (limites plus précises)
  isInCameroon(lat: number, lng: number): boolean {
    const cameroonBounds = {
      north: 13.083333,
      south: 1.652778,
      east: 16.192222,
      west: 8.494444
    };

    return lat >= cameroonBounds.south && 
           lat <= cameroonBounds.north && 
           lng >= cameroonBounds.west && 
           lng <= cameroonBounds.east;
  },

  // Obtenir une localisation camerounaise intelligente (basée sur la popularité)
  getSmartCameroonLocation(): CameroonLocation {
    const popularCities = [
      'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua'
    ];
    
    const availableCities = cameroonLocations.filter(loc => 
      loc.type === 'city' && popularCities.includes(loc.name)
    );
    
    return availableCities[Math.floor(Math.random() * availableCities.length)];
  },

  // Obtenir une ville principale du Cameroun
  getMainCameroonCity(): CameroonLocation {
    const mainCities = ['Yaoundé', 'Douala'];
    const city = cameroonLocations.find(loc => 
      loc.type === 'city' && mainCities.includes(loc.name)
    );
    return city || cameroonLocations.find(loc => loc.name === 'Yaoundé')!;
  },

  // Obtenir une localisation aléatoire au Cameroun
  getRandomCameroonLocation(): CameroonLocation {
    const cities = cameroonLocations.filter(loc => loc.type === 'city');
    return cities[Math.floor(Math.random() * cities.length)];
  },

  // Trouver une localisation par nom
  findLocationByName(name: string): CameroonLocation | null {
    const searchTerm = name.toLowerCase().trim();
    return cameroonLocations.find(location =>
      location.name.toLowerCase().includes(searchTerm) ||
      (location.parentCity && location.parentCity.toLowerCase().includes(searchTerm))
    ) || null;
  },

  // Rechercher des localisations par nom (amélioré)
  searchLocations(query: string): CameroonLocation[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    // Recherche exacte d'abord
    const exactMatches = cameroonLocations.filter(location =>
      location.name.toLowerCase() === searchTerm ||
      (location.parentCity && location.parentCity.toLowerCase() === searchTerm)
    );

    // Puis recherche partielle
    const partialMatches = cameroonLocations.filter(location =>
      location.name.toLowerCase().includes(searchTerm) ||
      (location.parentCity && location.parentCity.toLowerCase().includes(searchTerm))
    ).filter(loc => !exactMatches.includes(loc));

    // Combiner et limiter les résultats
    return [...exactMatches, ...partialMatches].slice(0, 15);
  },

  // Obtenir les suggestions de localisation (amélioré)
  getLocationSuggestions(query: string): string[] {
    const locations = this.searchLocations(query);
    
    // Prioriser les villes principales
    const priorityCities = ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua'];
    
    const suggestions = locations.map(location => getFormattedAddress(location));
    
    // Trier par priorité
    suggestions.sort((a, b) => {
      const aPriority = priorityCities.some(city => a.includes(city)) ? 0 : 1;
      const bPriority = priorityCities.some(city => b.includes(city)) ? 0 : 1;
      return aPriority - bPriority;
    });
    
    return suggestions;
  },

  // Convertir une adresse en coordonnées (geocoding amélioré)
  async geocodeAddress(address: string): Promise<GeolocationResult | null> {
    const locations = this.searchLocations(address);
    
    if (locations.length > 0) {
      const location = locations[0];
      
      // Déterminer la précision basée sur le type de correspondance
      let accuracy: 'high' | 'medium' | 'low' = 'medium';
      if (location.type === 'district') accuracy = 'high';
      else if (location.type === 'city') accuracy = 'medium';
      else accuracy = 'low';
      
      return {
        lat: location.lat,
        lng: location.lng,
        address: getFormattedAddress(location),
        accuracy,
        source: 'database'
      };
    }

    return null;
  },

  // Obtenir les quartiers d'une ville
  getDistrictsByCity(cityName: string): CameroonLocation[] {
    return cameroonLocations.filter(location => 
      location.parentCity === cityName && location.type === 'district'
    );
  },

  // Valider une adresse camerounaise
  validateCameroonAddress(address: string): boolean {
    const locations = this.searchLocations(address);
    return locations.length > 0;
  }
};