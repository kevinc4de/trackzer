import React, { useState } from 'react';
import { AlertTriangle, MapPin, Check, Smartphone, Shield } from 'lucide-react';
import { MapComponent } from './MapComponent';
import { LocationInput } from './LocationInput';
import { phoneService } from '../services/phoneService';

interface FormData {
  imei: string;
  brand: string;
  model: string;
  color: string;
  status: 'lost' | 'stolen';
  description: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  reward?: number;
}

export const ReportPhone: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    imei: '',
    brand: '',
    model: '',
    color: '',
    status: 'lost',
    description: '',
    owner: {
      name: '',
      phone: '',
      email: ''
    },
    location: {
      address: '',
      lat: 7.3697,
      lng: 12.3547
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setError('');
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLocationChange = (address: string, lat?: number, lng?: number) => {
    setFormData(prev => ({
      ...prev,
      location: {
        address,
        lat: lat || prev.location.lat,
        lng: lng || prev.location.lng
      }
    }));
  };

  const validateForm = () => {
    const { imei, brand, model, owner, location, description } = formData;
    return (
      imei.length === 15 &&
      brand.trim() &&
      model.trim() &&
      owner.name.trim() &&
      owner.phone.trim() &&
      owner.email.trim() &&
      location.address.trim() &&
      description.trim() &&
      location.lat !== undefined &&
      location.lng !== undefined
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const phoneData = {
        imei: formData.imei,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        status: formData.status,
        description: formData.description,
        reward: formData.reward,
        owner_name: formData.owner.name,
        owner_phone: formData.owner.phone,
        owner_email: formData.owner.email,
        location_address: formData.location.address,
        location_lat: formData.location.lat!,
        location_lng: formData.location.lng!
      };

      const result = await phoneService.createPhone(phoneData);
      setReportId(result.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      imei: '',
      brand: '',
      model: '',
      color: '',
      status: 'lost',
      description: '',
      owner: {
        name: '',
        phone: '',
        email: ''
      },
      location: {
        address: '',
        lat: 7.3697,
        lng: 12.3547
      }
    });
    setIsSubmitted(false);
    setReportId('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="trackzer-card rounded-lg p-6 sm:p-12 text-center paypal-shadow-lg">
            <div className="bg-green-100 rounded-full p-4 sm:p-6 inline-block mb-4 sm:mb-6">
              <Check className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Signalement enregistré avec succès
            </h2>
            
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
              Votre signalement a été enregistré dans notre base de données nationale. 
              Vous recevrez une notification par email si votre téléphone est retrouvé.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-blue-800 font-semibold text-sm sm:text-base">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                Numéro de référence: #{reportId.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-blue-700 mt-2 text-sm sm:text-base">
                Conservez ce numéro pour suivre votre signalement.
              </p>
            </div>
            
            <button
              onClick={resetForm}
              className="trackzer-button px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold text-base sm:text-lg paypal-shadow w-full sm:w-auto"
            >
              Nouveau signalement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="trackzer-card rounded-lg p-4 sm:p-8 paypal-shadow-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-red-600 rounded-full p-3 sm:p-4 paypal-shadow">
                <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Signaler un téléphone perdu ou volé
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Remplissez ce formulaire pour signaler votre téléphone au Cameroun. 
              Plus vous fournirez d'informations, plus nous aurons de chances de le retrouver.
            </p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Informations sur le téléphone */}
            <div className="bg-blue-50 rounded-lg p-4 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                Informations sur le téléphone
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    IMEI * <span className="text-xs text-gray-500 font-normal">(15 chiffres)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.imei}
                    onChange={(e) => handleInputChange('imei', e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="356938035643809"
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    maxLength={15}
                    required
                  />
                  <p className="mt-1 sm:mt-2 text-xs text-gray-500">
                    💡 Tapez *#06# sur votre téléphone pour obtenir l'IMEI
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Statut *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  >
                    <option value="lost">📱 Perdu</option>
                    <option value="stolen">🚨 Volé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Marque *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="iPhone, Samsung, Huawei..."
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="14 Pro, Galaxy S23, P50 Pro..."
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Couleur
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Noir, Blanc, Bleu..."
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Récompense (FCFA)
                  </label>
                  <input
                    type="number"
                    value={formData.reward || ''}
                    onChange={(e) => handleInputChange('reward', e.target.value)}
                    placeholder="50000"
                    min="0"
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                  />
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-purple-50 rounded-lg p-4 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Vos informations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.owner.name}
                    onChange={(e) => handleInputChange('owner.name', e.target.value)}
                    placeholder="Jean Dupont"
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.owner.phone}
                    onChange={(e) => handleInputChange('owner.phone', e.target.value)}
                    placeholder="+237 6 XX XX XX XX"
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.owner.email}
                    onChange={(e) => handleInputChange('owner.email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-green-50 rounded-lg p-4 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-green-600" />
                Dernière localisation connue au Cameroun
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Ville et quartier *
                  </label>
                  <LocationInput
                    value={formData.location.address}
                    onChange={handleLocationChange}
                    placeholder="Ex: Akwa, Douala ou Centre-ville, Yaoundé..."
                    required
                  />
                </div>

                {/* Mini Map */}
                {formData.location.lat && formData.location.lng && (
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Aperçu de la localisation</h4>
                    <MapComponent 
                      phones={[]} 
                      center={[formData.location.lat, formData.location.lng]}
                      height="250px"
                      zoom={12}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-orange-50 rounded-lg p-4 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Description de l'incident
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Décrivez les circonstances *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez comment et où vous avez perdu/vous êtes fait voler votre téléphone au Cameroun..."
                  rows={4}
                  className="trackzer-input w-full px-3 sm:px-4 py-2 sm:py-3"
                  required
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="trackzer-button-secondary px-6 sm:px-8 py-3 sm:py-4 font-semibold order-2 sm:order-1"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={!validateForm() || isSubmitting}
                className="trackzer-button px-8 sm:px-10 py-3 sm:py-4 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-base sm:text-lg paypal-shadow order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Signaler
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};