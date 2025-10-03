import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin,
  Heart,
  Zap,
  Lock,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Recherche IMEI', href: '#search' },
      { name: 'Signalement', href: '#report' },
      { name: 'Tableau de bord', href: '#dashboard' },
      { name: 'API Documentation', href: '#api' }
    ],
    company: [
      { name: 'À propos', href: '#about' },
      { name: 'Équipe', href: '#team' },
      { name: 'Carrières', href: '#careers' },
      { name: 'Presse', href: '#press' }
    ],
    support: [
      { name: 'Centre d\'aide', href: '#help' },
      { name: 'Contact', href: '#contact' },
      { name: 'Statut système', href: '#status' },
      { name: 'Communauté', href: '#community' }
    ],
    legal: [
      { name: 'Confidentialité', href: '#privacy' },
      { name: 'Conditions', href: '#terms' },
      { name: 'Cookies', href: '#cookies' },
      { name: 'Sécurité', href: '#security' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Github, href: '#github', label: 'GitHub' }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Utilisateurs' },
    { icon: Shield, value: '99.9%', label: 'Sécurité' },
    { icon: Zap, value: '<2s', label: 'Réponse' },
    { icon: Globe, value: '24/7', label: 'Support' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        <div className="border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300 group-hover:scale-110">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">TRACKZER</h3>
                  <p className="text-cyan-400 text-sm font-medium">Sécurité Mobile Avancée</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                Plateforme intelligente de traçage mobile utilisant l'IA pour sécuriser 
                vos appareils avec une précision militaire. Protégez ce qui compte le plus.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors duration-200">
                  <MapPin className="w-4 h-4 mr-3 text-cyan-500" />
                  <span className="text-sm">Yaoundé, Cameroun</span>
                </div>
                <div className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors duration-200">
                  <Mail className="w-4 h-4 mr-3 text-cyan-500" />
                  <span className="text-sm">contact@trackzer.cm</span>
                </div>
                <div className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors duration-200">
                  <Phone className="w-4 h-4 mr-3 text-cyan-500" />
                  <span className="text-sm">+237 696 215 869</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Produit
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Entreprise
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Support
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Légal
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm hover:translate-x-1 transform transition-transform"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center text-slate-400 text-sm mb-4 md:mb-0">
                <span>© {currentYear} Trackzer. Tous droits réservés.</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  Fait avec <Heart className="w-4 h-4 text-red-500 mx-1 animate-pulse" /> au Cameroun
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-slate-400 text-sm">
                  <Lock className="w-4 h-4 mr-2 text-green-500" />
                  <span>SSL Sécurisé</span>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>5.0 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};