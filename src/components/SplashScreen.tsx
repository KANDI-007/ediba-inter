import React from 'react';
import { Loader2 } from 'lucide-react';
import LogoIcon from './LogoIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-cyan-200 to-brand-green flex items-center justify-center relative overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo avec animation moderne */}
        <div className="relative mb-8 inline-block">
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl transform transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl"></div>
            <div className="relative flex items-center justify-center">
              <LogoIcon size={120} variant="default" className="mx-auto" />
            </div>
            {/* Effet de brillance animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
        </div>

        {/* Texte animé avec effet moderne */}
        <div className="text-5xl font-black text-white mb-4 tracking-wider">
          <span className="inline-block transform transition-all hover:scale-110" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>EDIBA</span>
          <span className="mx-3 text-green-200">-</span>
          <span className="inline-block transform transition-all hover:scale-110" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>INTER</span>
        </div>

        <div className="text-xl text-white/90 mb-8 font-medium tracking-wide">
          Application de Facturation
        </div>

        {/* Loader moderne avec icône SVG */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-4">
            <img src="./loading-spinner.svg" alt="Chargement" className="w-full h-full" />
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Chargement...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
