import React, { useState, useEffect } from 'react';
import { BarChart3, MapPin, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Phone, Smartphone } from 'lucide-react';
import { PhoneType } from '../types';
import { MapComponent } from './MapComponent';
import { phoneService } from '../services/phoneService';

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [phones, setPhones] = useState<PhoneType[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    stolen: 0,
    found: 0,
    recovery_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [phonesData, statsData] = await Promise.all([
        phoneService.getAllPhones(),
        phoneService.getStats()
      ]);
      
      setPhones(phonesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const recentReports = phones
    .sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lost':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'stolen':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'found':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 trackzer-button px-6 py-2 text-white rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="trackzer-card rounded-lg p-8 paypal-shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 rounded-full p-3 mr-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Tableau de bord</h1>
                  <p className="text-gray-600 text-lg mt-2">Statistiques et activité des signalements au Cameroun</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="trackzer-input px-6 py-3 font-medium"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="trackzer-card rounded-lg p-6 paypal-shadow hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total signalements</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trackzer actif
            </div>
          </div>

          <div className="trackzer-card rounded-lg p-6 paypal-shadow hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Téléphones perdus</p>
                <p className="text-3xl font-bold text-orange-600">{stats.lost}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>{stats.total > 0 ? Math.round((stats.lost / stats.total) * 100) : 0}% du total</span>
            </div>
          </div>

          <div className="trackzer-card rounded-lg p-6 paypal-shadow hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Téléphones volés</p>
                <p className="text-3xl font-bold text-red-600">{stats.stolen}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>{stats.total > 0 ? Math.round((stats.stolen / stats.total) * 100) : 0}% du total</span>
            </div>
          </div>

          <div className="trackzer-card rounded-lg p-6 paypal-shadow hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Taux de récupération</p>
                <p className="text-3xl font-bold text-green-600">{stats.recovery_rate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trackzer efficace
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="trackzer-card rounded-lg p-6 paypal-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Évolution des signalements</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Ce mois</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min((stats.total / 50) * 100, 100)}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.total}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Perdus</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${stats.total > 0 ? (stats.lost / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.lost}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Volés</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${stats.total > 0 ? (stats.stolen / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.stolen}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Retrouvés</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${stats.total > 0 ? (stats.found / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.found}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="trackzer-card rounded-lg p-6 paypal-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Carte du Cameroun</h3>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            
            <MapComponent phones={phones} height="300px" center={[7.3697, 12.3547]} zoom={6} />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Signalements actifs</span>
                <span className="font-bold text-gray-900">{phones.filter(p => p.status !== 'found').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Téléphones retrouvés</span>
                <span className="font-bold text-gray-900">{stats.found}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Taux de succès</span>
                <span className="font-bold text-gray-900">{stats.recovery_rate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="trackzer-card rounded-lg paypal-shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Signalements récents</h3>
          </div>
          
          {recentReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentReports.map((phone) => (
                <div key={phone.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(phone.status)}
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {phone.brand} {phone.model}
                        </h4>
                        <p className="text-sm text-gray-500 font-mono">
                          IMEI: {phone.imei}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {getStatusText(phone.status)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(phone.reportedDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{phone.lastKnownLocation.address}</span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {phone.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun signalement pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};