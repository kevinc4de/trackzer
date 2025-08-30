import { useState, useCallback } from 'react';
import { phoneService, CreatePhoneData } from '../services/phoneService';

interface UsePhoneReportReturn {
  isSubmitting: boolean;
  isSubmitted: boolean;
  reportId: string;
  error: string | null;
  submitReport: (data: CreatePhoneData) => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
}

export const usePhoneReport = (): UsePhoneReportReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitReport = useCallback(async (data: CreatePhoneData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validation côté client
      if (!data.imei || data.imei.length !== 15) {
        throw new Error('Le numéro IMEI doit contenir exactement 15 chiffres');
      }

      if (!data.brand.trim() || !data.model.trim()) {
        throw new Error('La marque et le modèle sont obligatoires');
      }

      if (!data.owner_name.trim() || !data.owner_phone.trim() || !data.owner_email.trim()) {
        throw new Error('Toutes les informations du propriétaire sont obligatoires');
      }

      if (!data.location_address.trim()) {
        throw new Error('L\'adresse de localisation est obligatoire');
      }

      if (!data.description.trim()) {
        throw new Error('La description de l\'incident est obligatoire');
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.owner_email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Validation téléphone camerounais
      const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/;
      const cleanPhone = data.owner_phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        throw new Error('Veuillez entrer un numéro de téléphone camerounais valide');
      }

      const result = await phoneService.createPhone(data);
      setReportId(result.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setIsSubmitted(false);
    setReportId('');
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    isSubmitted,
    reportId,
    error,
    submitReport,
    resetForm,
    clearError
  };
};