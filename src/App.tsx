import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import HomePage from './components/HomePage';
import { SearchPhone } from './components/SearchPhone';
import { ReportPhone } from './components/ReportPhone';
import { Dashboard } from './components/Dashboard';
import { AlertSystem } from './components/AlertSystem';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { LiveChat } from './components/LiveChat';
import { analytics } from './utils/analytics';
import { errorHandler } from './utils/errorHandler';
import { Alert } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Initialize analytics
    analytics.trackPageView('app_start');
    
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

  useEffect(() => {
    // Track tab changes
    analytics.trackPageView(activeTab);
  }, [activeTab]);

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main>
          {renderContent()}
        </main>
        
        <Footer />
        <AlertSystem alerts={alerts} onDismiss={dismissAlert} />
        <LiveChat />
      </div>
    </ErrorBoundary>
  );
}

export default App;