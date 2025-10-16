import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings,
  Eye,
  RefreshCw
} from 'lucide-react';
import DashboardModern from './DashboardModern';
import Dashboard from './Dashboard';

const DashboardDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'modern' | 'classic'>('modern');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Demo Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Moderne</h1>
                <p className="text-sm text-gray-600">Interface chic et professionnelle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('modern')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'modern'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Moderne
                </button>
                <button
                  onClick={() => setViewMode('classic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'classic'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Classique
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title={isFullscreen ? 'Sortir du plein écran' : 'Plein écran'}
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}>
        {viewMode === 'modern' ? (
          <DashboardModern />
        ) : (
          <div className="p-8">
            <Dashboard />
          </div>
        )}
      </div>

      {/* Demo Info Panel */}
      {!isFullscreen && (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 max-w-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nouveau Tableau de Bord</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Interface moderne et chic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Graphiques interactifs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Animations fluides</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Design responsive</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Mode actuel:</span>
              <span className="text-xs font-medium text-blue-600 capitalize">
                {viewMode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDemo;
