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
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Tech grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative text-center">
            {/* Tech logo with holographic effect */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-full p-8 border border-blue-500/30 shadow-2xl">
                  <div className="relative">
                    <MapPin className="h-20 w-20 text-transparent bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text floating-animation" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main title with tech styling */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text drop-shadow-2xl">
                TRACKZER
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-light text-blue-200/80 tracking-widest">
                CAMEROUN • AI POWERED
              </span>
            </h1>
            
            {/* Tech description */}
            <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Système intelligent de géolocalisation et récupération de téléphones
              <br />
              <span className="text-cyan-300 font-medium">Technologie avancée • Sécurité maximale • Résultats garantis</span>
            </p>
            
            {/* Tech action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => handleNavigation('search')}
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-10 py-5 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center justify-center">
                  <Search className="h-6 w-6 mr-3" />
                  SCANNER IMEI
                </div>
              </button>
              <button
                onClick={() => handleNavigation('report')}
                className="group relative bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 px-10 py-5 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  SIGNALER PERTE
                </div>
              </button>
            </div>
            
            {/* Tech indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-300">
                <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <span className="text-blue-100 text-sm font-medium block">Chiffrement AES-256</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/40 transition-all duration-300">
                <CheckCircle className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <span className="text-cyan-100 text-sm font-medium block">IA Prédictive</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:border-green-400/40 transition-all duration-300">
                <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <span className="text-green-100 text-sm font-medium block">25K+ Utilisateurs</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/40 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <span className="text-purple-100 text-sm font-medium block">92% Succès</span>
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text mb-6">
              Technologies de Pointe
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Intelligence artificielle, machine learning et blockchain pour une sécurité maximale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6 relative">
                  <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl p-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-6">
                Performance Système
              </h2>
              <p className="text-xl text-blue-100/80">
                Données en temps réel • Analyse prédictive • Résultats optimisés
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-6">
                    <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative text-white">
                      {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-3">
                    {stat.value}
                  </div>
                  <div className="text-blue-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-12 shadow-2xl">
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 inline-block mb-8 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl blur opacity-50"></div>
              <CheckCircle className="relative h-20 w-20 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text mb-8">
              Activez Trackzer Maintenant
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Rejoignez l'écosystème intelligent de récupération de téléphones le plus avancé du Cameroun
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-12 py-6 text-white font-bold text-xl rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <span className="relative">DÉMARRER LE SCAN</span>
            </button>
            
            <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Système actif 24/7
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Chiffrement militaire
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                IA en temps réel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Footer */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full p-3">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">
              TRACKZER INTELLIGENCE SYSTEM
            </h3>
            <p className="text-blue-200/80 text-lg mb-6">
              Propulsé par l'intelligence artificielle • Sécurisé par la blockchain
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
              <span>© 2024 Trackzer AI</span>
              <span>•</span>
              <span>Technologie Camerounaise</span>
              <span>•</span>
              <span>Innovation Africaine</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};