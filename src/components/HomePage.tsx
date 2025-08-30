import React from 'react';
import { Shield, Search, AlertTriangle, MapPin, Smartphone, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const handleNavigation = (tab: string) => {
    analytics.trackPageView(tab);
    onNavigate(tab);
  };

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Recherche IMEI",
      description: "Recherchez instantanément un téléphone par son numéro IMEI dans notre base de données nationale"
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Couverture Nationale",
      description: "Service disponible dans toutes les villes du Cameroun : Yaoundé, Douala, Bafoussam, Bamenda..."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
      title: "Signalement Rapide",
      description: "Signalez votre téléphone perdu ou volé en quelques clics avec notre formulaire sécurisé"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Sécurité Garantie",
      description: "Vos données sont protégées et chiffrées selon les standards internationaux"
    }
  ];

  const stats = [
    { icon: <Smartphone className="h-6 w-6" />, value: "5,847", label: "Téléphones Retrouvés" },
    { icon: <Users className="h-6 w-6" />, value: "25,234", label: "Utilisateurs Actifs" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "92%", label: "Taux de Récupération" },
    { icon: <Clock className="h-6 w-6" />, value: "24/7", label: "Support Disponible" }
  ];

  const cities = [
    "Yaoundé", "Douala", "Bafoussam", "Bamenda", "Garoua", "Maroua", 
    "Ngaoundéré", "Bertoua", "Ebolowa", "Kribi", "Limbe", "Buea"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/back.jpg" 
            alt="Satellite tracking background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-blue-800/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 paypal-shadow-lg border border-white/30">
                <MapPin className="h-16 w-16 text-white floating-animation" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-white drop-shadow-lg">Trackzer</span>
              <br />
              <span className="text-3xl md:text-4xl font-medium text-gray-700">
                <span className="text-blue-200 drop-shadow-lg">Cameroun</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              La solution de géolocalisation la plus fiable du Cameroun pour retrouver vos téléphones perdus ou volés
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleNavigation('search')}
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 px-8 py-4 text-white font-semibold text-lg paypal-shadow-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <Search className="h-5 w-5 mr-2 inline" />
                Rechercher Maintenant
              </button>
              <button
                onClick={() => handleNavigation('report')}
                className="bg-red-600/90 backdrop-blur-sm border border-red-500/50 hover:bg-red-600 px-8 py-4 text-white font-semibold text-lg paypal-shadow-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <AlertTriangle className="h-5 w-5 mr-2 inline" />
                Signaler un Vol
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Sécurisé SSL</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Données Chiffrées</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">25K+ Utilisateurs</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">92% Récupération</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Couverture Nationale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trackzer est disponible dans toutes les principales villes du Cameroun
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city, index) => (
              <div
                key={index}
                className="trackzer-card rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme utilise les dernières technologies pour vous offrir le meilleur service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="trackzer-card rounded-lg p-8 text-center hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-50 rounded-full p-4">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="trackzer-card rounded-lg p-12 paypal-shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nos Résultats
              </h2>
              <p className="text-xl text-gray-600">
                Des milliers de Camerounais nous font confiance chaque jour
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 rounded-full p-3 text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="trackzer-card rounded-lg p-12 paypal-shadow-lg">
            <div className="bg-green-100 rounded-full p-6 inline-block mb-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Prêt à Retrouver Votre Téléphone ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà récupéré leurs appareils grâce à Trackzer
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="trackzer-button px-10 py-4 text-white font-bold text-xl paypal-shadow-lg"
            >
              Commencer la Recherche
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                🔒 Vos données sont protégées et chiffrées • Service disponible 24h/24
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};