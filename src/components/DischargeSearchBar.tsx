import React from 'react';
import { Search, Filter, Download, Grid3X3, List, Plus } from 'lucide-react';

interface DischargeSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onExportClick: () => void;
  onAddClick: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DischargeSearchBar: React.FC<DischargeSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onExportClick,
  onAddClick,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par prestataire, numéro ou service..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onFilterClick}
            className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
          
          <button
            onClick={onExportClick}
            className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={onAddClick}
            className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nouvelle décharge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargeSearchBar;
