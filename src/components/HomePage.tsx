import React from 'react';
import { Search, Shield, MapPin, Users, Zap, Globe, Lock, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cyan-300 rounded-full animate-float-slow opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-500 rounded-full animate-float-delayed opacity-70"></div>
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-16">
            {/* Logo with Holographic Effect */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 animate-glow">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight">
              TRACKZER
            </h1>
            
            {/* Subtitle with Tech Effect */}
            <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
              Système Intelligent de Traçage Mobile
            </p>
            
            {/* Description */}
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Plateforme avancée de sécurité mobile utilisant l'IA pour tracer et sécuriser 
              vos appareils avec une précision de niveau militaire
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Rechercher un Appareil
                </span>
              </button>
              
              <button className="group px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl font-semibold text-slate-200 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Signaler un Vol
                </span>
              </button>
            </div>
          </div>

          {/* Tech Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Users, value: "50K+", label: "Utilisateurs Actifs", color: "from-cyan-400 to-blue-500" },
              { icon: MapPin, value: "99.9%", label: "Précision GPS", color: "from-blue-400 to-purple-500" },
              { icon: Zap, value: "<2s", label: "Temps de Réponse", color: "from-purple-400 to-pink-500" },
              { icon: Lock, value: "256-bit", label: "Chiffrement SSL", color: "from-green-400 to-cyan-500" }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Recherche IMEI Avancée",
                description: "Algorithme de recherche intelligent avec validation Luhn et base de données mondiale",
                color: "from-cyan-400 to-blue-500"
              },
              {
                icon: MapPin,
                title: "Géolocalisation Précise",
                description: "Triangulation GPS multi-satellites avec précision sub-métrique",
                color: "from-blue-400 to-purple-500"
              },
              {
                icon: Shield,
                title: "Sécurité Militaire",
                description: "Chiffrement AES-256 et protocoles de sécurité de niveau gouvernemental",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-700/20 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-3xl transition-shadow duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}></div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2 text-slate-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">SSL Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Couverture Mondiale</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;