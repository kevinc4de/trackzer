// Centralized error handling system

export interface AppError {
  id: string;
  type: 'network' | 'validation' | 'geolocation' | 'database' | 'unknown';
  message: string;
  details?: string;
  timestamp: string;
  context?: string;
  recoverable: boolean;
}

class ErrorHandler {
  private errors: AppError[] = [];
  private maxErrors = 50;

  // Create standardized error
  createError(
    type: AppError['type'],
    message: string,
    details?: string,
    context?: string,
    recoverable = true
  ): AppError {
    const error: AppError = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      context,
      recoverable
    };

    this.addError(error);
    return error;
  }

  // Add error to collection
  private addError(error: AppError) {
    this.errors.unshift(error);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('🚨 App Error:', error);
    }

    // Store critical errors
    if (!error.recoverable) {
      this.persistCriticalError(error);
    }
  }

  // Handle network errors
  handleNetworkError(error: any, context?: string): AppError {
    let message = 'Erreur de connexion réseau';
    let details = '';

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      message = 'Impossible de se connecter au serveur';
      details = 'Vérifiez votre connexion internet';
    } else if (error.status) {
      switch (error.status) {
        case 400:
          message = 'Requête invalide';
          details = 'Les données envoyées sont incorrectes';
          break;
        case 401:
          message = 'Non autorisé';
          details = 'Authentification requise';
          break;
        case 403:
          message = 'Accès refusé';
          details = 'Vous n\'avez pas les permissions nécessaires';
          break;
        case 404:
          message = 'Ressource non trouvée';
          details = 'L\'élément recherché n\'existe pas';
          break;
        case 429:
          message = 'Trop de requêtes';
          details = 'Veuillez patienter avant de réessayer';
          break;
        case 500:
          message = 'Erreur serveur interne';
          details = 'Le serveur rencontre des difficultés';
          break;
        default:
          message = `Erreur réseau (${error.status})`;
          details = error.message || 'Erreur inconnue';
      }
    }

    return this.createError('network', message, details, context);
  }

  // Handle validation errors
  handleValidationError(field: string, message: string, context?: string): AppError {
    return this.createError(
      'validation',
      `Erreur de validation: ${field}`,
      message,
      context
    );
  }

  // Handle geolocation errors
  handleGeolocationError(error: GeolocationPositionError, context?: string): AppError {
    let message = 'Erreur de géolocalisation';
    let details = '';
    let recoverable = true;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Géolocalisation refusée';
        details = 'Veuillez autoriser l\'accès à votre position';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Position indisponible';
        details = 'Impossible de déterminer votre position';
        break;
      case error.TIMEOUT:
        message = 'Délai de géolocalisation dépassé';
        details = 'La détection de position a pris trop de temps';
        break;
      default:
        message = 'Erreur de géolocalisation inconnue';
        details = error.message;
        recoverable = false;
    }

    return this.createError('geolocation', message, details, context, recoverable);
  }

  // Handle database errors
  handleDatabaseError(error: any, context?: string): AppError {
    let message = 'Erreur de base de données';
    let details = error.message || 'Erreur inconnue';
    let recoverable = true;

    if (error.code) {
      switch (error.code) {
        case '23505': // Unique violation
          message = 'Données déjà existantes';
          details = 'Cet IMEI a déjà été signalé';
          break;
        case '23503': // Foreign key violation
          message = 'Référence invalide';
          details = 'Données liées manquantes';
          recoverable = false;
          break;
        case '42P01': // Undefined table
          message = 'Table non trouvée';
          details = 'Structure de base de données incorrecte';
          recoverable = false;
          break;
        default:
          message = `Erreur base de données (${error.code})`;
      }
    }

    return this.createError('database', message, details, context, recoverable);
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error: AppError): string {
    const baseMessage = error.message;
    const suggestion = this.getRecoverySuggestion(error);
    
    return suggestion ? `${baseMessage}. ${suggestion}` : baseMessage;
  }

  // Get recovery suggestions
  private getRecoverySuggestion(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'Vérifiez votre connexion internet et réessayez.';
      case 'geolocation':
        return 'Vous pouvez saisir manuellement votre localisation.';
      case 'validation':
        return 'Corrigez les informations et réessayez.';
      case 'database':
        return error.recoverable ? 'Réessayez dans quelques instants.' : 'Contactez le support technique.';
      default:
        return 'Réessayez ou contactez le support si le problème persiste.';
    }
  }

  // Persist critical errors
  private persistCriticalError(error: AppError) {
    try {
      const criticalErrors = JSON.parse(localStorage.getItem('trackzer_critical_errors') || '[]');
      criticalErrors.unshift(error);
      
      // Keep only last 10 critical errors
      const limitedErrors = criticalErrors.slice(0, 10);
      localStorage.setItem('trackzer_critical_errors', JSON.stringify(limitedErrors));
    } catch (e) {
      console.error('Failed to persist critical error:', e);
    }
  }

  // Get error statistics
  getErrorStats() {
    const totalErrors = this.errors.length;
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recoverableErrors = this.errors.filter(e => e.recoverable).length;
    const criticalErrors = this.errors.filter(e => !e.recoverable).length;

    return {
      totalErrors,
      errorsByType,
      recoverableErrors,
      criticalErrors,
      errorRate: totalErrors > 0 ? Math.round((criticalErrors / totalErrors) * 100) : 0
    };
  }

  // Clear old errors
  clearOldErrors(olderThanHours = 24) {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.errors = this.errors.filter(error => 
      new Date(error.timestamp) > cutoffTime
    );
  }

  // Get recent errors
  getRecentErrors(limit = 10): AppError[] {
    return this.errors.slice(0, limit);
  }
}

export const errorHandler = new ErrorHandler();