import { useState, useEffect, useCallback } from 'react';
import { geolocationService, GeolocationResult } from '../services/geolocationService';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoStart?: boolean;
}

interface UseGeolocationReturn {
  location: GeolocationResult | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

export const useGeolocation = (options: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 60000,
    autoStart = false
  } = options;

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await geolocationService.getCurrentPosition({
        enableHighAccuracy,
        timeout,
        maximumAge
      });
      setLocation(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de géolocalisation';
      setError(errorMessage);
      
      // Fallback vers une localisation camerounaise
      try {
        const fallbackLocation = geolocationService.getSmartCameroonLocation();
        setLocation({
          lat: fallbackLocation.lat,
          lng: fallbackLocation.lng,
          address: `${fallbackLocation.name}, Cameroun`,
          accuracy: 'low',
          source: 'database'
        });
      } catch (fallbackError) {
        console.error('Fallback location failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoStart) {
      getCurrentLocation();
    }
  }, [autoStart, getCurrentLocation]);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    clearError
  };
};