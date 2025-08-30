import React from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  type?: 'default' | 'geolocation' | 'search' | 'upload';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  type = 'default',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const getIcon = () => {
    switch (type) {
      case 'geolocation':
        return <MapPin className={`${sizeClasses[size]} animate-pulse text-blue-600`} />;
      case 'search':
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />;
      case 'upload':
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-green-600`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-600`} />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'geolocation':
        return 'Détection de votre position...';
      case 'search':
        return 'Recherche en cours...';
      case 'upload':
        return 'Enregistrement...';
      default:
        return 'Chargement...';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {getIcon()}
        {type === 'geolocation' && (
          <div className="absolute inset-0 animate-ping">
            <MapPin className={`${sizeClasses[size]} text-blue-400 opacity-75`} />
          </div>
        )}
      </div>
      {(message || type !== 'default') && (
        <p className="mt-3 text-sm text-gray-600 font-medium text-center">
          {message || getDefaultMessage()}
        </p>
      )}
    </div>
  );
};