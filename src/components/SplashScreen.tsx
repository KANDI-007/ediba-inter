import React from 'react';
import { Building2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-cyan-200 to-brand-green flex items-center justify-center">
      <div className="text-center">
        {/* Logo avec animation */}
        <div className="relative mb-8">
          <img src="/logo-ediba.png" alt="EDIBA-INTER" className="w-56 h-auto mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        </div>

        {/* Texte animé */}
        <div className="text-4xl font-bold text-white mb-8">
          <span className="inline-block animate-pulse">E</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.1s' }}>D</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>I</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>B</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>A</span>
          <span className="inline-block animate-pulse mx-2" style={{ animationDelay: '0.5s' }}>-</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.6s' }}>I</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.7s' }}>N</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.8s' }}>T</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.9s' }}>E</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '1.0s' }}>R</span>
        </div>

        <div className="text-lg text-white/80 mb-8">
          Application de Facturation
        </div>

        {/* Loader circulaire */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;