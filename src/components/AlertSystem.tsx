import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Alert } from '../types';

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ alerts, onDismiss }) => {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setVisibleAlerts(alerts);
  }, [alerts]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
    }
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleDismiss = (id: string) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id));
    onDismiss(id);
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-md">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-3 sm:p-4 paypal-shadow transition-all duration-300 ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getAlertIcon(alert.type)}
            </div>
            <div className="ml-2 sm:ml-3 flex-1">
              <p className="text-xs sm:text-sm font-medium">
                {alert.message}
              </p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(alert.timestamp).toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <div className="ml-2 sm:ml-4 flex-shrink-0">
              <button
                onClick={() => handleDismiss(alert.id)}
                className="inline-flex rounded-md p-1 sm:p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};