import React, { useState } from 'react';
import { Search, MapPin, Calendar, User, Phone, Mail, AlertCircle, CheckCircle, Clock, Smartphone } from 'lucide-react';
import { PhoneType } from '../types';
import { MapComponent } from './MapComponent';
import { usePhoneSearch } from '../hooks/usePhoneSearch';
import { validation } from '../utils/validation';
import { analytics } from '../utils/analytics';
import { errorHandler } from '../utils/errorHandler';

interface SearchResult {
  phone: PhoneType;
  confidence: number;
  lastSeen: string;
}

export const SearchPhone: React.FC = () => {
  const [imei, setImei] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  
  const {
    searchResults,
    isSearching,
    error,
    searchHistory,
    searchPhone: performSearch,
    clearResults,
    clearError,
    getSearchStats
  } = usePhoneSearch();

  const handleSearch = async () => {
    if (!imei.trim()) return;
    
    // Validation côté client
    const imeiValidation = validation.validateIMEI(imei);
    if (!imeiValidation.isValid) {
      setValidationError(imeiValidation.error || 'IMEI invalide');
      return;
    }
    
    setValidationError('');
    setSearchPerformed(false);
    
    try {
      await performSearch(imei);
      setSearchPerformed(true);
      
      // Track search analytics
      analytics.trackSearch(imei, searchResults.length);
    } catch (error) {
      const appError = errorHandler.handleNetworkError(error, 'phone_search');
      analytics.trackError(appError.message, 'search');
    } finally {
      setSearchPerformed(true);
    }
  };

  const handleImeiChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 15);
    setImei(cleanValue);
    setValidationError('');
    clearError();
  };

  const searchStats = getSearchStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lost':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'stolen':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'found':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lost':
        return 'Perdu';
      case 'stolen':
        return 'Volé';
      case 'found':
        return 'Retrouvé';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'stolen':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'found':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="trackzer-card rounded-lg p-8 paypal-shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 rounded-full p-4 paypal-shadow">
                <Smartphone className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recherche par IMEI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Entrez le numéro IMEI de votre téléphone pour vérifier s'il a été signalé au Cameroun.
              L'IMEI est un identifiant unique de 15 chiffres.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <label htmlFor="imei" className="block text-sm font-semibold text-gray-700 mb-3">
                  Numéro IMEI
                </label>
                <input
                  type="text"
                  id="imei"
                  value={imei}
                  onChange={(e) => handleImeiChange(e.target.value)}
                  placeholder="Exemple: 356938035643809"
                  className={`trackzer-input w-full px-6 py-4 text-lg ${
                    validationError ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  maxLength={15}
                />
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    💡 Tapez *#06# sur votre téléphone pour obtenir l'IMEI
                  </p>
                  {imei.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {imei.length}/15 chiffres
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={!imei.trim() || isSearching}
                  className="trackzer-button px-8 py-4 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center paypal-shadow"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-3" />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {(error || validationError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{validationError || error}</p>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !searchPerformed && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Recherches récentes:</h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((historyImei, index) => (
                  <button
                    key={index}
                    onClick={() => setImei(historyImei)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors duration-200"
                  >
                    {historyImei}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchPerformed && (
            <div className="space-y-8">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Résultats de recherche ({searchResults.length})
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                        Recherche: {imei}
                      </div>
                      {searchStats.averageConfidence > 0 && (
                        <div className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                          Confiance moyenne: {searchStats.averageConfidence}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Search Statistics */}
                  {searchStats.totalResults > 1 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{searchStats.exactMatches}</p>
                        <p className="text-sm text-green-700">Correspondances exactes</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{searchStats.partialMatches}</p>
                        <p className="text-sm text-yellow-700">Correspondances partielles</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{searchStats.averageConfidence}%</p>
                        <p className="text-sm text-blue-700">Confiance moyenne</p>
                      </div>
                    </div>
                  )}

                  {/* Map showing all results */}
                  <div className="trackzer-card rounded-lg p-6 paypal-shadow">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Localisation au Cameroun
                    </h4>
                    <MapComponent 
                      phones={searchResults.map(r => r.phone)} 
                      height="500px"
                      zoom={6}
                      center={[7.3697, 12.3547]}
                    />
                  </div>

                  <div className="grid gap-6">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.phone.id}
                        className="trackzer-card rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(result.phone.status)}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">
                                {result.phone.brand} {result.phone.model}
                              </h4>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(result.phone.status)}`}>
                                  {getStatusText(result.phone.status)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getConfidenceColor(result.confidence)}`}>
                                  {result.confidence}% de correspondance
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-500 font-medium">IMEI</p>
                            <p className="font-mono text-sm font-bold text-gray-900">{result.phone.imei}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                              <User className="h-4 w-4 mr-3 text-blue-600" />
                              <span className="font-medium">{result.phone.owner.name}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Phone className="h-4 w-4 mr-3 text-green-600" />
                              <span>{result.phone.owner.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Mail className="h-4 w-4 mr-3 text-purple-600" />
                              <span>{result.phone.owner.email}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                              <MapPin className="h-4 w-4 mr-3 text-red-500" />
                              <span>{result.phone.lastKnownLocation.address}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Calendar className="h-4 w-4 mr-3 text-orange-500" />
                              <span>Signalé le {result.lastSeen}</span>
                            </div>
                            {result.phone.reward && (
                              <div className="flex items-center text-green-600 font-semibold">
                                💰 Récompense: {result.phone.reward} FCFA
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                            <span className="font-semibold">Description:</span> {result.phone.description}
                          </p>
                        </div>

                        {result.phone.status !== 'found' && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2" />
                              <span className="font-medium">
                                Si vous avez des informations sur ce téléphone, contactez immédiatement le propriétaire ou les autorités compétentes.
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-green-100 rounded-full p-6 inline-block mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto text-lg">
                    Excellente nouvelle ! Aucun téléphone avec cet IMEI n'a été signalé comme perdu ou volé dans notre base de données.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};