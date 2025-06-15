import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchPhone } from './components/SearchPhone';
import { ReportPhone } from './components/ReportPhone';
import { Dashboard } from './components/Dashboard';
import { AlertSystem } from './components/AlertSystem';
import { Alert } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simulate initial system alerts
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'info',
        message: 'Système Trackzer activé pour tout le Cameroun',
        timestamp: new Date().toISOString()
      }
    ];
    
    setAlerts(initialAlerts);

    // Auto-dismiss alerts after 5 seconds
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
    }, 5000);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'search':
        return <SearchPhone />;
      case 'report':
        return <ReportPhone />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main>
        {renderContent()}
      </main>
      
      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium">
              Trackzer - Solution de géolocalisation pour le Cameroun
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Service disponible dans toutes les villes du pays
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;