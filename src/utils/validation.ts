// Validation utilities for Trackzer application

export const validation = {
  // Validate IMEI number
  validateIMEI(imei: string): { isValid: boolean; error?: string } {
    if (!imei) {
      return { isValid: false, error: 'Le numéro IMEI est requis' };
    }

    if (imei.length !== 15) {
      return { isValid: false, error: 'Le numéro IMEI doit contenir exactement 15 chiffres' };
    }

    if (!/^\d{15}$/.test(imei)) {
      return { isValid: false, error: 'Le numéro IMEI ne doit contenir que des chiffres' };
    }

    // Validation Luhn algorithm for IMEI
    if (!this.validateLuhnChecksum(imei)) {
      return { isValid: false, error: 'Le numéro IMEI n\'est pas valide (échec de la vérification)' };
    }

    return { isValid: true };
  },

  // Validate Luhn checksum for IMEI
  validateLuhnChecksum(imei: string): boolean {
    let sum = 0;
    let alternate = false;
    
    for (let i = imei.length - 2; i >= 0; i--) {
      let digit = parseInt(imei.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(imei.charAt(14));
  },

  // Validate Cameroonian phone number
  validateCameroonPhone(phone: string): { isValid: boolean; error?: string; formatted?: string } {
    if (!phone) {
      return { isValid: false, error: 'Le numéro de téléphone est requis' };
    }

    // Remove all spaces and special characters except +
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Patterns for Cameroonian phone numbers
    const patterns = [
      /^(\+237|237)?[6-9]\d{8}$/, // Standard format
      /^(\+237|237)?[2-3]\d{8}$/, // Landline format
    ];

    const isValid = patterns.some(pattern => pattern.test(cleanPhone));
    
    if (!isValid) {
      return { 
        isValid: false, 
        error: 'Veuillez entrer un numéro de téléphone camerounais valide (ex: +237 6XX XXX XXX)' 
      };
    }

    // Format the phone number
    let formatted = cleanPhone;
    if (!formatted.startsWith('+237') && !formatted.startsWith('237')) {
      formatted = '+237' + formatted;
    } else if (formatted.startsWith('237')) {
      formatted = '+' + formatted;
    }

    return { isValid: true, formatted };
  },

  // Validate email address
  validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'L\'adresse email est requise' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Veuillez entrer une adresse email valide' };
    }

    return { isValid: true };
  },

  // Validate reward amount
  validateReward(reward: number | undefined): { isValid: boolean; error?: string } {
    if (reward === undefined || reward === null) {
      return { isValid: true }; // Reward is optional
    }

    if (reward < 0) {
      return { isValid: false, error: 'Le montant de la récompense ne peut pas être négatif' };
    }

    if (reward > 10000000) { // 10 million FCFA max
      return { isValid: false, error: 'Le montant de la récompense ne peut pas dépasser 10,000,000 FCFA' };
    }

    return { isValid: true };
  },

  // Validate required text fields
  validateRequiredText(value: string, fieldName: string, minLength = 2): { isValid: boolean; error?: string } {
    if (!value || !value.trim()) {
      return { isValid: false, error: `${fieldName} est requis` };
    }

    if (value.trim().length < minLength) {
      return { isValid: false, error: `${fieldName} doit contenir au moins ${minLength} caractères` };
    }

    return { isValid: true };
  },

  // Validate coordinates are within Cameroon bounds
  validateCameroonCoordinates(lat: number, lng: number): { isValid: boolean; error?: string } {
    const cameroonBounds = {
      north: 13.083333,
      south: 1.652778,
      east: 16.192222,
      west: 8.494444
    };

    if (lat < cameroonBounds.south || lat > cameroonBounds.north ||
        lng < cameroonBounds.west || lng > cameroonBounds.east) {
      return { 
        isValid: false, 
        error: 'La localisation doit être située au Cameroun' 
      };
    }

    return { isValid: true };
  }
};