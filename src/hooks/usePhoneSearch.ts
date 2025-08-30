import { useState, useCallback, useMemo } from 'react';
import { PhoneType, SearchResult } from '../types';
import { phoneService } from '../services/phoneService';

interface UsePhoneSearchReturn {
  searchResults: SearchResult[];
  isSearching: boolean;
  error: string | null;
  searchHistory: string[];
  searchPhone: (imei: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
  getSearchStats: () => {
    totalResults: number;
    exactMatches: number;
    partialMatches: number;
    averageConfidence: number;
  };
}

export const usePhoneSearch = (): UsePhoneSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchPhone = useCallback(async (imei: string) => {
    if (!imei.trim()) {
      setError('Veuillez entrer un numéro IMEI valide');
      return;
    }

    if (imei.length !== 15) {
      setError('Le numéro IMEI doit contenir exactement 15 chiffres');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const phones = await phoneService.searchByIMEI(imei);
      
      const results: SearchResult[] = phones.map(phone => {
        let confidence = 0;
        let matchType: 'exact' | 'partial' | 'similar' = 'similar';
        
        if (phone.imei === imei) {
          confidence = 100;
          matchType = 'exact';
        } else if (phone.imei.includes(imei) || imei.includes(phone.imei.slice(0, 8))) {
          confidence = 75;
          matchType = 'partial';
        } else if (phone.imei.slice(0, 6) === imei.slice(0, 6)) {
          confidence = 30;
          matchType = 'similar';
        }
        
        return {
          phone,
          confidence,
          lastSeen: new Date(phone.reportedDate).toLocaleString('fr-FR'),
          matchType
        };
      });
      
      // Trier par confiance décroissante
      results.sort((a, b) => b.confidence - a.confidence);
      setSearchResults(results);
      
      // Ajouter à l'historique de recherche
      setSearchHistory(prev => {
        const newHistory = [imei, ...prev.filter(item => item !== imei)];
        return newHistory.slice(0, 10); // Garder seulement les 10 dernières recherches
      });
      
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getSearchStats = useMemo(() => {
    return () => {
      const totalResults = searchResults.length;
      const exactMatches = searchResults.filter(r => r.matchType === 'exact').length;
      const partialMatches = searchResults.filter(r => r.matchType === 'partial').length;
      const averageConfidence = totalResults > 0 
        ? Math.round(searchResults.reduce((sum, r) => sum + r.confidence, 0) / totalResults)
        : 0;

      return {
        totalResults,
        exactMatches,
        partialMatches,
        averageConfidence
      };
    };
  }, [searchResults]);

  return {
    searchResults,
    isSearching,
    error,
    searchHistory,
    searchPhone,
    clearResults,
    clearError,
    getSearchStats
  };
};