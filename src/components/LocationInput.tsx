import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, CheckCircle } from 'lucide-react';
import { geolocationService, GeolocationResult } from '../services/geolocationService';

interface LocationInputProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Entrez une ville ou un quartier au Cameroun...",
  required = false,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<'high' | 'medium' | 'low' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim().length > 1) {
      const locationSuggestions = geolocationService.getLocationSuggestions(inputValue);
      setSuggestions(locationSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    setLocationAccuracy(null);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const result = await geolocationService.geocodeAddress(suggestion);
    if (result) {
      onChange(result.address, result.lat, result.lng);
      setLocationAccuracy(result.accuracy);
    } else {
      onChange(suggestion);
    }
    setShowSuggestions(false);
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const result: GeolocationResult = await geolocationService.getCurrentPosition();
      onChange(result.address, result.lat, result.lng);
      setLocationAccuracy(result.accuracy);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      // Fallback vers une localisation aléatoire
      const randomLocation = geolocationService.getRandomCameroonLocation();
      onChange(`${randomLocation.name}, Cameroun`, randomLocation.lat, randomLocation.lng);
      setLocationAccuracy('low');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getAccuracyIcon = () => {
    switch (locationAccuracy) {
      case 'high':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <MapPin className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getAccuracyText = () => {
    switch (locationAccuracy) {
      case 'high':
        return 'Position précise';
      case 'medium':
        return 'Position approximative';
      case 'low':
        return 'Position estimée';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className={`trackzer-input w-full px-4 py-3 pr-10 ${className}`}
            required={required}
          />
          
          {locationAccuracy && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getAccuracyIcon()}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="trackzer-button px-4 py-3 text-white disabled:opacity-50 flex items-center justify-center font-medium min-w-[120px]"
          title="Utiliser ma position actuelle"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <MapPin className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Localiser</span>
            </>
          )}
        </button>
      </div>

      {locationAccuracy && (
        <p className="mt-2 text-xs text-gray-500 flex items-center">
          {getAccuracyIcon()}
          <span className="ml-1">{getAccuracyText()}</span>
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center"
            >
              <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};