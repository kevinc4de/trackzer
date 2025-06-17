import { CameroonLocation, cameroonLocations, findNearestLocation, getFormattedAddress } from '../data/cameroonLocations';

export interface GeolocationResult {
  lat: number;
  lng: number;
  address: string;
  accuracy: 'high' | 'medium' | 'low';
}

export const geolocationService = {
  // Obtenir la position actuelle avec géolocalisation HTML5
  async getCurrentPosition(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Trouver la localisation camerounaise la plus proche
          const nearestLocation = findNearestLocation(latitude, longitude);
          
          // Déterminer la précision basée sur la distance et l'accuracy GPS
          let accuracyLevel: 'high' | 'medium' | 'low' = 'low';
          
          if (accuracy && accuracy < 100) {
            accuracyLevel = 'high';
          } else if (accuracy && accuracy < 500) {
            accuracyLevel = 'medium';
          }

          // Si on est au Cameroun (approximativement), utiliser la position GPS
          if (this.isInCameroon(latitude, longitude)) {
            resolve({
              lat: latitude,
              lng: longitude,
              address: getFormattedAddress(nearestLocation),
              accuracy: accuracyLevel
            });
          } else {
            // Sinon, utiliser la localisation camerounaise la plus proche
            resolve({
              lat: nearestLocation.lat,
              lng: nearestLocation.lng,
              address: getFormattedAddress(nearestLocation),
              accuracy: 'low'
            });
          }
        },
        (error) => {
          console.warn('Erreur de géolocalisation:', error);
          // Fallback vers une localisation aléatoire au Cameroun
          const randomLocation = this.getRandomCameroonLocation();
          resolve({
            lat: randomLocation.lat,
            lng: randomLocation.lng,
            address: getFormattedAddress(randomLocation),
            accuracy: 'low'
          });
        },
        options
      );
    });
  },

  // Vérifier si les coordonnées sont au Cameroun (approximativement)
  isInCameroon(lat: number, lng: number): boolean {
    // Limites approximatives du Cameroun
    const cameroonBounds = {
      north: 13.1,
      south: 1.7,
      east: 16.2,
      west: 8.5
    };

    return lat >= cameroonBounds.south && 
           lat <= cameroonBounds.north && 
           lng >= cameroonBounds.west && 
           lng <= cameroonBounds.east;
  },

  // Obtenir une localisation aléatoire au Cameroun
  getRandomCameroonLocation(): CameroonLocation {
    const randomIndex = Math.floor(Math.random() * cameroonLocations.length);
    return cameroonLocations[randomIndex];
  },

  // Rechercher des localisations par nom
  searchLocations(query: string): CameroonLocation[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return cameroonLocations.filter(location =>
      location.name.toLowerCase().includes(searchTerm) ||
      (location.parentCity && location.parentCity.toLowerCase().includes(searchTerm))
    ).slice(0, 10); // Limiter à 10 résultats
  },

  // Obtenir les suggestions de localisation
  getLocationSuggestions(query: string): string[] {
    const locations = this.searchLocations(query);
    return locations.map(location => getFormattedAddress(location));
  },

  // Convertir une adresse en coordonnées (geocoding simple)
  async geocodeAddress(address: string): Promise<GeolocationResult | null> {
    const locations = this.searchLocations(address);
    
    if (locations.length > 0) {
      const location = locations[0];
      return {
        lat: location.lat,
        lng: location.lng,
        address: getFormattedAddress(location),
        accuracy: 'medium'
      };
    }

    return null;
  }
};