import React from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Settings, 
  X,
  Download,
  RefreshCw,
  ChevronDown
} from 'lucide-react';

interface ActivityLogSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedUser: string;
  onUserChange: (value: string) => void;
  selectedModule: string;
  onModuleChange: (value: string) => void;
  selectedAction: string;
  onActionChange: (value: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  users: string[];
  modules: string[];
  actions: string[];
  totalResults: number;
}

const ActivityLogSearchBar: React.FC<ActivityLogSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedUser,
  onUserChange,
  selectedModule,
  onModuleChange,
  selectedAction,
  onActionChange,
  dateRange,
  onDateRangeChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  onExport,
  onRefresh,
  users,
  modules,
  actions,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher dans les activités..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={onToggleFilters}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              showFilters
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {totalResults} activité{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
            </span>
            {(searchTerm || selectedUser !== 'all' || selectedModule !== 'all' || selectedAction !== 'all' || dateRange.start || dateRange.end) && (
              <button
                onClick={onClearFilters}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <X className="w-4 h-4" />
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Utilisateur
              </label>
              <select
                value={selectedUser}
                onChange={(e) => onUserChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les utilisateurs</option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Settings className="w-4 h-4 inline mr-1" />
                Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => onModuleChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Action
              </label>
              <select
                value={selectedAction}
                onChange={(e) => onActionChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Période
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Date de début"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Date de fin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogSearchBar;
